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

  const { productName, category, features, price, platform } = body as Record<string, string>;
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

  const prompt = `あなたはECマーケティングと商品ページ最適化の専門コンサルタントです。Amazon・楽天市場・Yahoo!ショッピングでの売上改善実績を多数持ち、消費者行動心理・SEO・コピーライティングを統合した商品説明文の制作を得意としています。
以下の商品情報をもとに、購買率を最大化する即戦力の商品説明文セットを生成してください。
すべての文章は自然な日本語で、購入者の「買わない理由」を潰しながら「欲しい」という感情を引き出す表現を使ってください。

【プラットフォーム】${platform === "rakuten" ? "楽天市場" : platform === "yahoo" ? "Yahoo!ショッピング" : platform === "mercari" ? "メルカリ" : "Amazon.co.jp"}
【プラットフォーム別方針】${platformGuide}

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
競合商品の弱点に触れず、自社商品の強みを前面に出す表現を使うこと。`;

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3200,
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
