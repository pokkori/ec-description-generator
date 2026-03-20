import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}
const FREE_LIMIT = 3;
const COOKIE_KEY = "ec_use_count";
const APP_ID = "ec";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const email = req.cookies.get("user_email")?.value;
  let isPremium = false;
  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
  } else {
    const pv = req.cookies.get("premium")?.value;
    isPremium = pv === "1" || pv === "biz" || pv === "ent";
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { productName, category, features, price, platform, tone, keywordStrength } = body as Record<string, string>;
  if (!productName || !features) {
    return NextResponse.json({ error: "商品名と特徴は必須です" }, { status: 400 });
  }
  if (productName.length > 200) return NextResponse.json({ error: "商品名は200文字以内で入力してください" }, { status: 400 });
  if (features.length > 1000) return NextResponse.json({ error: "特徴は1000文字以内で入力してください" }, { status: 400 });

  // 景表法・薬機法 禁止ワードリスト
  const NG_WORDS = [
    "最高", "No.1", "NO.1", "no.1", "日本一", "世界一", "絶対", "完全", "永久",
    "治る", "治療", "効果があります", "医師推奨", "100%", "必ず", "絶対に",
    "最強", "唯一", "奇跡", "夢のような", "副作用なし", "即効", "劇的",
  ];
  const inputText = `${productName} ${features}`;
  const ngWordsFound = NG_WORDS.filter(w => inputText.includes(w));

  const PLATFORM_HINTS: Record<string, string> = {
    amazon: "Amazon向け: 検索SEOを意識したキーワード多用。箇条書きで仕様・特徴を明確に。ASIN対応フォーマット。",
    rakuten: "楽天市場向け: 感情訴求・お得感強調。「送料無料」「ポイント還元」などの特典を冒頭に。読みやすい長文。",
    yahoo: "Yahoo!ショッピング向け: 価格の安さとコスパを前面に。簡潔で分かりやすい説明。",
    mercari: "メルカリ向け: 商品の状態（新品/未使用/中古）を明記。簡潔で信頼感のある説明。",
    base: "BASE/Shopify向け: ブランドの世界観・ストーリーを重視。感性に訴えかける表現。",
  };

  const platformGuide =
    platform === "rakuten"
      ? "楽天市場向け：検索キーワードを自然に文章に盛り込む。信頼感・安心感・お買い得感を強調。絵文字や記号（★◆■）を適度に使い視認性を上げる。スマホ表示を意識した改行。"
      : platform === "yahoo"
      ? "Yahoo!ショッピング向け：シンプルで読みやすい文体。ポイント還元・送料無料などのお得感を強調。検索ワードを冒頭に自然に含める。"
      : platform === "mercari"
      ? "メルカリ向け：コンパクトで親しみやすい文体。状態・サイズ・発送方法を明確に。値段交渉への対応方針も含める。"
      : platform === "base"
      ? "BASE/Shopify向け：ブランドのストーリー・世界観を大切にした文体。感性に訴えかけるリッチな表現。購入者との共感を重視。ハッシュタグ提案も含める。"
      : "Amazon.co.jp向け：Amazonのアルゴリズムに最適化。箇条書き5点で主な特徴を端的に。後半に詳細説明。A+コンテンツ向け構成。";

  const TONE_GUIDE: Record<string, string> = {
    professional: "文体: プロフェッショナル・ビジネストーン。信頼感・実績・スペックを重視した説得力ある表現を使う。専門用語を適切に活用し、品質と信頼性を前面に出す。",
    friendly: "文体: 親しみやすく共感を呼ぶトーン。口コミ・レビュー風の自然な語り口。日常生活での使用シーンを想像しやすい表現。読者に「わかる！」と思わせる共感ワードを使う。",
    luxury: "文体: 高級感・ブランド感あるプレミアムトーン。こだわり・職人技・特別感を表現。感性に訴えかけるリッチな言葉遣い。「選ばれし人のための」「上質な」「至高の」等の表現を自然に使う。",
    casual: "文体: カジュアルでフレンドリーなトーン。若者・SNS世代に響く軽快な表現を使う。絵文字・感嘆符を適度に活用し、テンション高めのポップな文体。「めちゃくちゃ」「激推し」「やばい」等のSNS語を適度に取り入れる。",
  };
  const KEYWORD_STRENGTH_GUIDE: Record<string, string> = {
    seo: "SEOキーワード方針: キーワード密度を高めに設定。商品名・カテゴリ・用途ワードを説明文の冒頭・中盤・末尾に自然に配置。検索エンジン最適化を最優先。",
    balanced: "SEOキーワード方針: 検索キーワードを自然な文中に適度に散りばめる。読みやすさとSEO効果のバランスを最適化。",
    natural: "SEOキーワード方針: 人間が読んで自然に感じる流暢な文章を最優先。SEOキーワードは最小限に留め、読者体験を重視する。",
  };

  const toneGuide = TONE_GUIDE[tone] || TONE_GUIDE.professional;
  const keywordGuide = KEYWORD_STRENGTH_GUIDE[keywordStrength] || KEYWORD_STRENGTH_GUIDE.balanced;

  const prompt = `あなたはECマーケティングと商品ページ最適化の専門コンサルタントです。Amazon・楽天市場・Yahoo!ショッピングでの売上改善実績を多数持ち、消費者行動心理・SEO・コピーライティングを統合した商品説明文の制作を得意としています。
以下の商品情報をもとに、購買率を最大化する即戦力の商品説明文セットを生成してください。
すべての文章は自然な日本語で、購入者の「買わない理由」を潰しながら「欲しい」という感情を引き出す表現を使ってください。

【プラットフォーム】${platform === "rakuten" ? "楽天市場" : platform === "yahoo" ? "Yahoo!ショッピング" : platform === "mercari" ? "メルカリ" : "Amazon.co.jp"}
【プラットフォーム別方針】${platformGuide}
【文体トーン方針】${toneGuide}
【SEOキーワード方針】${keywordGuide}

【商品情報】
商品名: ${productName}
カテゴリ: ${category || "指定なし"}
価格: ${price ? `¥${price}` : "指定なし"}
特徴・セールスポイント: ${features}

---

## 📌 商品タイトル案（3パターン）

各パターンは全角50文字以内で、検索キーワードを自然に含めてください。

**パターンA（SEO重視）:** （主要キーワードを冒頭に、スペック・用途を盛り込む）
**パターンB（ベネフィット重視）:** （「〜できる」「〜になれる」等、購入後の変化を示す）
**パターンC（ターゲット明示）:** （「〜に悩む方へ」「〜をお探しの方」等、ターゲットを明確に）

---

## ✨ キャッチコピー

購買意欲を最大化する1〜2行で記載してください。
「なぜこの商品が必要か」「この商品を選ぶと何が変わるか」を一瞬で伝える表現を使ってください。
（景品表示法・薬機法に抵触する最上位表現・効能保証は使用禁止）

---

## 📝 商品説明文（350〜500文字）

${platform === "amazon"
  ? "【Amazon向け構成】冒頭に主な特徴を箇条書き5点（各30〜50文字）、その後に詳細説明（200〜300文字）。検索アルゴリズムを意識したキーワード自然配置。"
  : platform === "rakuten"
  ? "【楽天向け構成】感情訴求を冒頭に（「〜でお悩みではありませんか？」等）、次に商品の特徴・安心感・お得感を展開。絵文字・記号（★◆■）を適度に使い視認性UP。スマホ表示を意識した改行。"
  : platform === "mercari"
  ? "【メルカリ向け構成】商品状態・サイズ・付属品・発送方法を冒頭に明記。次に商品の魅力。最後に「コメント歓迎」「値下げ交渉はお気軽に」等の購入促進文。"
  : platform === "base"
  ? "【BASE向け構成】ブランドのストーリー・こだわり・製作背景を冒頭に。次に商品スペック。感性に訴えかけるリッチな表現で世界観を伝える。"
  : "【標準構成】冒頭に「この商品が選ばれる理由」を1文、次に特徴・ベネフィット・安心感を論理的に展開。"}

「買わない理由」（価格・品質不安・他商品との比較等）を先回りして解消する表現を含めること。

（ここに350〜500文字の商品説明文を生成）

---

## 🔍 SEOキーワード（15個）

購買意向が高く検索ボリュームが見込めるキーワードをカンマ区切りで列挙してください。
「商品名＋用途」「商品名＋悩み」「カテゴリ＋特徴」等のロングテールキーワードも含めること。

---

## 💬 よくある質問・購入不安への回答（Q&A形式 4問）

購入をためらわせる「不安・疑問」を先読みして回答してください。

Q1: （サイズ・スペック・使い方に関する不安）
A1:
Q2: （品質・耐久性・素材に関する不安）
A2:
Q3: （配送・返品・保証に関する不安）
A3:
Q4: （他商品・他ストアとの比較・この商品を選ぶ理由）
A4:

---

## 📊 競合との差別化ポジショニング

この商品が「なぜ選ばれるべきか」を2〜3行で明確に記述してください。
競合商品の弱点に触れず、自社商品の強みを前面に出す表現を使うこと。

---

## 🎯 CVR予測スコアと改善提案

### CVR予測スコア（購買転換率予測）
以下の形式で必ず出力してください:
===CVR_SCORE===XX
（XXは0〜100の整数。商品の訴求力・説明の明確さ・ターゲット適合度・価格競争力から総合判定。平均的な商品が55〜65、優れた商品が75〜85）

### Before/After 改善ポイント（入力情報をもとに）
以下の3点を必ず記述してください:
1. **改善前の問題点**: （入力された商品情報の弱点・訴求が弱い部分）
2. **改善後の表現**: （上記をどう改善したか・どのコピーでそれを解決したか）
3. **期待できる効果**: （CVR改善・検索流入増・カート追加率向上等の具体的な期待効果）

### 次にやるべきこと（出品者向け3アクション）
① （今日できる改善アクション）
② （1週間以内に実施すると効果的なこと）
③ （1ヶ月後に検証すべきKPI）

## 次の3ステップ

最後に必ず「## 次の3ステップ」というセクションを追加し、ユーザーが今すぐ取れる具体的な行動を箇条書き（「- 」で始まる）3つ記載してください。例：「- この説明文をメイン画像の下に貼り付ける」「- A/Bテストでこの文と既存文を比較する」「- SNS広告のキャプションに最初の1文を活用する」など商品に応じた具体的な行動を書いてください。`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.enqueue(encoder.encode(`\nDONE:${JSON.stringify({ count: newCount, ngWordsFound })}`));
          controller.close();
        } catch (err) { console.error(err); controller.error(err); }
      },
    });
    const headers: Record<string, string> = {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Set-Cookie": `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure; Path=/`,
    };
    return new Response(readable, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
