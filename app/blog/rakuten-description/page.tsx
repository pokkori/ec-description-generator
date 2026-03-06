import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "楽天市場の商品説明文の書き方｜売上が上がる7つのコツ",
  description:
    "楽天市場で売れる商品説明文の書き方を解説。SEOキーワードの入れ方、禁止事項、実際のテンプレートまで徹底解説します。",
};

export default function RakutenDescriptionPage() {
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
        <div className="text-xs text-blue-600 font-medium mb-3">楽天市場 攻略ガイド</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          楽天市場の商品説明文の書き方｜売上が上がる7つのコツ
        </h1>
        <p className="text-gray-500 text-sm mb-8">更新日: 2026年3月</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <p>
            楽天市場で売上を伸ばすには、商品説明文の質が大きく影響します。
            本記事では、実際に効果のある商品説明文の書き方を7つのコツとともに解説します。
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. 最初の200文字が勝負</h2>
            <p>
              楽天市場の検索結果では、商品説明文の冒頭200文字前後が表示されます。
              ここにメインキーワードと最大のセールスポイントを集中させましょう。
              「何の商品か」「どんな人に向いているか」「最大の特徴は何か」を冒頭で伝えます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. 検索キーワードを自然に入れる</h2>
            <p>
              楽天市場のSEOでは、ユーザーが検索しそうなキーワードを説明文に含めることが重要です。
              ただし、詰め込みすぎは逆効果。自然な文章の中にキーワードを組み込みましょう。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">例：ステンレスボトルの場合</p>
              <p className="text-gray-600">
                「ステンレス 水筒」「保温ボトル 500ml」「真空断熱 マグボトル」など、
                複数の検索パターンをカバーするキーワードを含めましょう。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. ベネフィットで書く</h2>
            <p>
              商品の特徴（スペック）ではなく、使うことで得られるベネフィットを伝えましょう。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <p><span className="text-red-500">❌ 悪い例：</span>「真空断熱二重構造採用」</p>
              <p><span className="text-blue-600">✅ 良い例：</span>「朝入れたコーヒーが昼まで熱々のまま。真空断熱二重構造で24時間保温をキープ」</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. 想定読者を明確にする</h2>
            <p>
              「誰のための商品か」を明示することで、ターゲットユーザーの共感を得られます。
              「毎日オフィスに水筒を持参している方へ」「子どもの遠足用をお探しの方へ」など、
              具体的なシーンを入れましょう。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. 数字で信頼性を上げる</h2>
            <p>
              「高品質」「長持ち」などの抽象的な表現より、数字を使った具体的な表現が効果的です。
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>「24時間保温・保冷」</li>
              <li>「容量500ml（約2.5杯分）」</li>
              <li>「重さ270g（500mlペットボトルより軽い）」</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. よくある質問を先に答える</h2>
            <p>
              購入前に不安になりやすいポイントを説明文内で解消しましょう。
              「食洗機は使えますか？」「子どもでも開けられますか？」といった疑問に
              先回りして答えることで、問い合わせを減らし購買率を上げられます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. 禁止ワードに注意する</h2>
            <p>
              楽天市場では「日本一」「最高品質」「No.1」などの最上級表現は、
              根拠なく使用すると規約違反になります。
              使用する場合は調査機関の調査結果など、根拠となるデータが必要です。
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="font-bold text-gray-900 mb-2">
              商品説明文を自動生成してみませんか？
            </p>
            <p className="text-sm text-gray-500 mb-4">
              商品名と特徴を入力するだけ。上記のコツを踏まえた説明文をAIが30秒で生成します。
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
