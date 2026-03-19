import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ECコラム｜楽天・Amazon商品説明文の書き方・テンプレート集",
  description:
    "楽天市場・Amazon・Yahoo!ショッピングで売れる商品説明文の書き方を解説。SEOキーワード、景表法、禁止ワード対策まで網羅。",
};

const articles = [
  {
    href: "/blog/rakuten-description",
    category: "楽天市場",
    categoryColor: "bg-red-100 text-red-700",
    title: "楽天市場の商品説明文の書き方｜売上が上がる7つのコツ",
    desc: "楽天市場で売れる説明文の書き方を解説。SEOキーワードの入れ方、禁止事項、実際のテンプレートまで徹底解説します。",
    date: "2026年3月",
  },
  {
    href: "/blog/amazon-description",
    category: "Amazon",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "Amazonの商品説明文のコツ｜検索順位を上げる書き方",
    desc: "AmazonのSEOに強い商品説明文の書き方を解説。商品紹介コンテンツ（A+）の活用方法と禁止ワードも紹介します。",
    date: "2026年3月",
  },
  {
    href: "/blog/ec-description-template",
    category: "テンプレート",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "EC商品説明文テンプレート集｜コピペで使える構成例",
    desc: "ファッション・食品・美容・家電・日用品別の商品説明文テンプレートをまとめました。そのままコピペして使えます。",
    date: "2026年3月",
  },
];

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900 text-sm">
            AI商品説明文ジェネレーター
          </Link>
          <Link
            href="/tool"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            無料で試す
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ECコラム</h1>
        <p className="text-gray-500 text-sm mb-10">
          楽天・Amazon・Yahoo!ショッピングで売れる商品説明文の書き方・テンプレートを解説します。
        </p>

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="block border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{article.desc}</p>
              <div className="mt-3 text-xs text-blue-600 font-medium">続きを読む →</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-2">商品説明文の作成はAIにお任せ</p>
          <p className="text-sm text-gray-500 mb-4">
            商品名を入力するだけ。楽天・Amazon・Yahoo!対応の説明文をAIが30秒で生成します。
          </p>
          <Link
            href="/tool"
            className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            無料で試す（3回まで無料）
          </Link>
        </div>
      </div>
    </main>
  );
}
