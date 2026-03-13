import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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
    isPremium = req.cookies.get("stripe_premium")?.value === "1" || req.cookies.get("premium")?.value === "1";
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

  const platformGuide =
    platform === "rakuten"
      ? "楽天市場向け：検索キーワードを自然に文章に盛り込む。信頼感・安心感・お買い得感を強調。絵文字や記号（★◆■）を適度に使い視認性を上げる。スマホ表示を意識した改行。"
      : platform === "yahoo"
      ? "Yahoo!ショッピング向け：シンプルで読みやすい文体。ポイント還元・送料無料などのお得感を強調。検索ワードを冒頭に自然に含める。"
      : platform === "mercari"
      ? "メルカリ向け：コンパクトで親しみやすい文体。状態・サイズ・発送方法を明確に。値段交渉への対応方針も含める。"
      : "Amazon.co.jp向け：Amazonのアルゴリズムに最適化。箇条書き5点で主な特徴を端的に。後半に詳細説明。A+コンテンツ向け構成。";

  const prompt = `あなたはEC売上改善の専門コンサルタントです。年間1,000件以上の商品ページを最適化し、平均CVR 40%改善を実現してきた実績を持ちます。以下の商品情報をもとに、即戦力となる商品説明文セットを生成してください。

【プラットフォーム】${platform === "rakuten" ? "楽天市場" : platform === "yahoo" ? "Yahoo!ショッピング" : platform === "mercari" ? "メルカリ" : "Amazon.co.jp"}
【対応方針】${platformGuide}

【商品情報】
商品名: ${productName}
カテゴリ: ${category || "指定なし"}
価格: ${price ? `¥${price}` : "指定なし"}
特徴・セールスポイント: ${features}

---

## 📌 商品タイトル案（3パターン）

**パターンA（SEO重視）:**
**パターンB（ベネフィット重視）:**
**パターンC（ターゲット明示）:**

---

## ✨ キャッチコピー

（購買意欲を最大化する1〜2行。「なぜこの商品が必要か」を一瞬で伝える）

---

## 📝 商品説明文

（300〜500文字。${platform === "amazon" ? "冒頭に箇条書き5点、その後詳細説明" : "読み流せる自然な文体で、商品の価値を具体的に伝える"}）

---

## 🔍 SEOキーワード（15個）

（検索ボリュームが高く購買意向の強いキーワードをカンマ区切りで）

---

## 💬 よくある質問・不安への回答（Q&A形式 3問）

Q1:
A1:
Q2:
A2:
Q3:
A3:

---

## 📊 この商品の強みを競合と比較した際のポジショニング

（1〜2行で、なぜこの商品を選ぶべきかを明確に）`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
