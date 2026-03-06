import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_LIMIT = 3;
const COOKIE_KEY = "ec_use_count";

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
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (cookieCount >= FREE_LIMIT) {
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
      ? "楽天市場向け：検索キーワードを自然に含め、信頼感と購買意欲を高める文章にする。HTMLタグ不使用。"
      : "Amazon.co.jp向け：箇条書きで明確に、検索最適化されたキーワードを含める。";

  const prompt = `あなたはEC商品説明文のプロフェッショナルライターです。
以下の商品情報をもとに、売上が上がる商品説明文を生成してください。

${platformGuide}

商品名: ${productName}
カテゴリ: ${category || "指定なし"}
価格: ${price ? `¥${price}` : "指定なし"}
特徴・セールスポイント: ${features}

以下の形式で出力してください:

【キャッチコピー】
（購買意欲を高める1〜2行のコピー）

【商品説明文】
（200〜400文字の説明文）

【検索キーワード】
（商品に関連するキーワードを10個、カンマ区切りで）`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
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
