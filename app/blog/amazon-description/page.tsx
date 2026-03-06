import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amazon商品説明文の書き方｜検索上位を狙うための5つのポイント",
  description:
    "Amazon.co.jpで検索上位に表示される商品説明文の書き方を解説。箇条書きの活用法、A+コンテンツとの使い分け、禁止事項まで網羅。",
};

export default function AmazonDescriptionPage() {
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

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs text-blue-600 font-medium mb-3">Amazon攻略ガイド</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          Amazon商品説明文の書き方｜検索上位を狙うための5つのポイント
        </h1>
        <p className="text-gray-500 text-sm mb-8">更新日: 2026年3月</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <p>
            Amazonでの売上を左右する要素のひとつが商品説明文です。
            Amazonのアルゴリズム（A9）は、商品ページのテキスト情報をもとに検索順位を決定します。
            本記事では、検索上位を狙うための具体的な書き方を解説します。
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. 商品タイトルにメインキーワードを入れる</h2>
            <p>
              Amazonの検索順位に最も影響するのが商品タイトルです。
              「ブランド名 + 商品名 + 主要スペック + 用途・ターゲット」の順で書くのが基本です。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">タイトルの例</p>
              <p className="text-gray-600">
                「○○ステンレス 水筒 500ml 真空断熱 保温保冷 24時間 スポーツボトル 大人 子供 マグボトル」
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. 箇条書き（商品の特徴）を最大限活用する</h2>
            <p>
              Amazonの「商品の特徴」欄（箇条書き5項目）はSEOに強く影響します。
              各項目は200文字以内で、メリットとキーワードを盛り込みましょう。
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>1行目：最大のセールスポイント</li>
              <li>2行目：スペック・仕様</li>
              <li>3行目：使用シーン・ターゲット</li>
              <li>4行目：素材・安全性</li>
              <li>5行目：保証・サポート情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. バックエンドキーワードを設定する</h2>
            <p>
              Amazonには、商品ページには表示されないがSEOに効く「バックエンドキーワード」があります。
              商品説明文で使いきれなかったキーワード（類義語・英語名・ひらがな・カタカナ）を設定しましょう。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. 商品説明文は購買意欲を高める文章にする</h2>
            <p>
              「商品の特徴」欄でSEOを対策し、「商品説明」欄ではストーリーで購買意欲を高めます。
              どんなシーンで使うと便利か、使う前後でどう生活が変わるかを具体的に描写しましょう。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-bold mb-2">例文</p>
              <p className="text-gray-600">
                「毎朝忙しくても、熱々のコーヒーをオフィスまで持参できたら——。
                このステンレスボトルは、朝7時に入れたコーヒーが昼の12時でも65度以上をキープ。
                真空断熱二重構造が、あなたの一日を温め続けます。」
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Amazonの禁止事項を守る</h2>
            <p>
              以下の表現はAmazonガイドラインで禁止されています。使用すると商品が削除されることがあります。
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>他社商品との比較（「○○より優れた」など）</li>
              <li>「送料無料」「割引」などの価格・プロモーション情報</li>
              <li>レビューへの言及（「高評価」「星5つ」など）</li>
              <li>外部サイトへのリンク</li>
            </ul>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="font-bold text-gray-900 mb-2">
              Amazon向け商品説明文をAIで自動生成
            </p>
            <p className="text-sm text-gray-500 mb-4">
              上記のポイントを押さえた説明文を30秒で生成。まずは無料でお試しください。
            </p>
            <Link
              href="/tool"
              className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              無料で試す（3回まで無料）
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
