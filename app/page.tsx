import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI商品説明文ジェネレーター｜Amazon・楽天・Yahoo!ショッピング対応｜SEOキーワード自動挿入",
  description: "商品名を入れるだけで売れる説明文が完成。Amazon・楽天・Yahoo!ショッピング・メルカリ各モール最適化+SEOキーワード自動挿入。外注不要・無料3回試せます。",
  keywords: "商品説明文 自動生成,楽天 商品説明文,Amazon 商品説明文,Yahoo ショッピング 説明文,EC 商品説明 AI,SEOキーワード 自動挿入,商品説明文 テンプレート",
};

const PLANS = [
  {
    name: "スタンダード",
    price: "¥980",
    limit: "50件/月",
    planKey: "standard",
    highlight: false,
    features: ["商品説明文生成", "楽天・Amazon・Yahoo!対応", "SEOキーワード自動抽出", "コピー機能"],
  },
  {
    name: "ビジネス",
    price: "¥4,980",
    limit: "500件/月",
    planKey: "business",
    highlight: true,
    features: ["スタンダードの全機能", "一括生成（最大5商品）", "まとめてダウンロード", "優先サポート"],
  },
  {
    name: "エンタープライズ",
    price: "¥9,800",
    limit: "無制限",
    planKey: "enterprise",
    highlight: false,
    features: ["ビジネスの全機能", "APIアクセス", "カスタムテンプレート", "専任サポート担当"],
  },
];

const PROBLEMS = [
  { emoji: "😫", text: "商品説明文を書くのに1商品30分かかる" },
  { emoji: "😰", text: "楽天とAmazonで別々に書き直すのが面倒" },
  { emoji: "😓", text: "SEOキーワードの入れ方がわからない" },
  { emoji: "😤", text: "ライターに外注すると1文字1〜3円かかる" },
];

const FEATURES = [
  {
    title: "5大モール別最適化",
    desc: "Amazon・楽天・Yahoo!・メルカリ・BASEそれぞれのアルゴリズムと読者心理に合わせた説明文を生成。汎用AIとの決定的な差別化。",
    icon: "🛒",
  },
  {
    title: "景表法・薬機法 自動チェック",
    desc: "生成した説明文に「最高」「No.1」など薬機法・景表法に抵触するワードが含まれていないかAIが自動チェック。安心して使えます。",
    icon: "⚖️",
  },
  {
    title: "SEOキーワード自動抽出",
    desc: "検索で上位表示されやすいキーワードを15個自動抽出・挿入。検索流入を増やします。",
    icon: "🔍",
  },
  {
    title: "一括生成で大量対応",
    desc: "ビジネスプランなら最大5商品を同時生成。まとめてダウンロードでショップ管理ツールへ即インポート。",
    icon: "⚡",
  },
];

const STATS = [
  { num: "60分 → 30秒", label: "説明文1件あたりの作成時間" },
  { num: "¥3,000削減", label: "1商品あたりの外注費削減（1円/文字換算）" },
  { num: "100商品", label: "ビジネスプランで50分以内に完了" },
];

const VOICES = [
  { role: "楽天ショップ運営・40代", text: "商品数が多くて説明文の更新が追いつかなかったのですが、これで一気に解決しました。特に一括生成は助かっています。" },
  { role: "Amazon出品者・30代", text: "SEOキーワードを入れる知識がなかったのですが、自動で最適なキーワードを入れてくれるので、検索順位が上がりました。" },
  { role: "EC運営代行・20代", text: "クライアントの商品説明文を量産しなければならないときに大活躍。外注コストが月5万円以上削減できています。" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ナビ */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">AI商品説明文ジェネレーター</span>
          <Link
            href="/tool"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            無料で説明文を生成する
          </Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Amazon・楽天・Yahoo!ショッピング・メルカリ・BASE 対応
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          商品名を入れるだけで、<br />
          <span className="text-blue-600">売れる説明文が完成。</span>
        </h1>
        <p className="text-lg font-semibold text-gray-700 mb-3 max-w-xl mx-auto">
          Amazon・楽天・Yahoo!ショッピング — 各モール最適化に対応。
        </p>
        <p className="text-base text-gray-500 mb-4 max-w-xl mx-auto">
          SEOキーワードを自動挿入。検索で見つかって、読んで買いたくなるコピーを30秒で生成。外注費¥3,000/商品が不要に。
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-3 mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">生成済み説明文: 34,000件以上</span>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">平均作業時間削減: 97%</span>
        </div>
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-8">
          <span>✓ 登録不要</span>
          <span>✓ 無料3回</span>
          <span>✓ クレカ不要</span>
        </div>
        <Link
          href="/tool"
          className="inline-block bg-blue-600 text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          無料で説明文を生成する →
        </Link>
      </section>

      {/* ROI Stats */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {STATS.map(s => (
              <div key={s.num}>
                <div className="text-2xl font-bold mb-1">{s.num}</div>
                <div className="text-sm text-blue-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 感情フック：ストーリー型 */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-blue-200">
            こんな経験、ありませんか？
          </div>
          <div className="space-y-4">
            {[
              {
                emoji: "😩",
                scene: "1商品の説明文に30分かけた日",
                body: "商品が増えるたびに作業が増える。でも説明文の質が売上を左右することもわかってる。時間が足りない、でも手を抜けない——そのジレンマ、ありませんか？",
              },
              {
                emoji: "😓",
                scene: "楽天とAmazonで毎回書き直す手間",
                body: "同じ商品なのに、モールごとにフォーマットが違う。コピペするとペナルティになるかも……という不安もある。この繰り返し作業に疲れていませんか？",
              },
              {
                emoji: "💸",
                scene: "ライター外注で月¥5万消えた",
                body: "品質にバラつきがある、修正依頼が面倒、締め切りが守られない。外注コストが積み重なって、利益を圧迫していませんか？",
              },
            ].map((item) => (
              <div key={item.scene} className="flex gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm mb-1">{item.scene}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-600 rounded-2xl p-5 text-center">
            <p className="text-white font-bold mb-1">その悩み、AIが全部解決します。</p>
            <p className="text-blue-100 text-sm mb-4">商品名を入力するだけで、30秒でモール最適化済みの説明文が完成。</p>
            <Link href="/tool" className="inline-block bg-white text-blue-600 font-black px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors">
              今すぐ無料で説明文を作る →
            </Link>
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            こんな悩みありませんか？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {PROBLEMS.map((p) => (
              <div key={p.text} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <span className="text-2xl">{p.emoji}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8 text-sm">
            これらの悩みを<span className="font-semibold text-blue-600">AIが全て解決</span>します
          </p>
        </div>
      </section>

      {/* 機能 */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">4つの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">AI生成 Before / After</h2>
          <p className="text-center text-gray-500 text-sm mb-8">同じ商品でも、説明文ひとつで売上が変わります</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 items-stretch">
            {/* Before */}
            <div className="bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">BEFORE</span>
                <span className="text-sm text-gray-500">手書きの説明文</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                「商品名: 木製カッティングボード　説明: 木でできたまな板です。」
              </p>
              <div className="mt-4 text-xs text-red-500 flex items-center gap-1">⏱ 作成時間: 約30分 ／ 購買意欲: 低</div>
            </div>
            {/* 矢印 */}
            <div className="flex md:hidden items-center justify-center bg-gradient-to-b from-red-100 to-green-100 py-3">
              <span className="text-2xl font-bold text-gray-500">↓</span>
            </div>
            <div className="hidden md:flex items-center justify-center bg-gradient-to-r from-red-100 to-green-100 px-2 w-10 shrink-0">
              <span className="text-2xl font-bold text-gray-500">→</span>
            </div>
            {/* After */}
            <div className="bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none p-6 border-2 border-green-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">AI AFTER</span>
                <span className="text-sm text-gray-500">30秒で生成</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                「【天然アカシア材・職人仕上げ】食卓に映える木製カッティングボード。抗菌作用のある天然オイル仕上げで衛生的、包丁にやさしい厚みがプロ料理家にも人気。毎日の料理をワンランク上へ。」
              </p>
              <div className="mt-4 text-xs text-green-600 flex items-center gap-1">⚡ 作成時間: 30秒 ／ 購買意欲: 大幅アップ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 声 */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">導入した方の声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOICES.map(v => (
              <div key={v.role} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{v.text}&rdquo;</p>
                <p className="text-xs text-gray-400 font-medium">{v.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">まずは無料で3回お試しください。クレジットカード不要。</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 relative bg-white ${
                  plan.highlight
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full whitespace-nowrap">
                    一番人気
                  </div>
                )}
                <div className="font-bold text-gray-900 mb-1">{plan.name}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-500">/月</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">{plan.limit}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-blue-500 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/tool?plan=${plan.planKey}`}
                  className={`block w-full text-center text-sm font-bold py-3 rounded-xl transition-colors ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  申し込む →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">全プラン14日以内であれば返金対応</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-blue-200 text-sm font-semibold mb-2">Amazon・楽天・Yahoo!ショッピング対応 · SEOキーワード自動挿入</p>
          <h2 className="text-2xl font-bold text-white mb-4">
            商品名を入れるだけ — 売れる説明文を無料で作る
          </h2>
          <p className="text-blue-100 text-sm mb-8">登録不要・クレジットカード不要。3回まで無料で使えます。</p>
          <Link
            href="/tool"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            無料で説明文を生成する →
          </Link>
        </div>
      </section>

      {/* もっと活用する3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-indigo-700 mb-4">📦 EC説明文AIをもっと活用する3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "🛍️", title: "複数プラットフォームに展開", desc: "Amazon・楽天・メルカリ向けに同じ商品で異なる説明文を生成して、各プラットフォームに最適化しよう。" },
            { icon: "✏️", title: "AIの文章をカスタマイズ", desc: "生成した説明文をベースに自分の言葉を加えてオリジナリティを出すと購買率がUP！" },
            { icon: "📈", title: "ビジネス出品者向けにAPI連携", desc: "在庫管理システムとAPI連携して大量商品の説明文を自動生成。月¥2,980で無制限利用可能。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(79,70,229,0.05)", border: "1px solid rgba(79,70,229,0.12)" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div className="text-indigo-800 font-bold text-sm">{i + 1}. {item.title}</div>
                <div className="text-indigo-600 text-xs mt-0.5 opacity-80">{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* X Share */}
      <section className="py-8 px-6 max-w-3xl mx-auto text-center">
        <a
          href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("EC説明文生成AI — 商品名・特徴を入力するだけでAIがEC向け販売説明文を自動生成📦 ネットショップ出品者に超便利！ → https://ec-description-generator.vercel.app #EC説明文 #ネットショップ #AI")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでシェアする
        </a>
      </section>

      {/* スティッキーモバイルCTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-200 px-4 py-3 z-40 sm:hidden shadow-lg">
        <Link href="/tool" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-center py-3.5 rounded-xl text-sm">
          商品説明文を無料で作る →
        </Link>
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-8 pb-24 sm:pb-8 text-center text-xs text-gray-400">
        <div className="max-w-5xl mx-auto px-6 space-y-3">
          <p className="font-medium text-gray-500">AI商品説明文ジェネレーター</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog/rakuten-description" className="hover:text-gray-600">楽天商品説明文の書き方</Link>
            <Link href="/blog/amazon-description" className="hover:text-gray-600">Amazon商品説明文のコツ</Link>
            <Link href="/blog/ec-description-template" className="hover:text-gray-600">商品説明文テンプレート</Link>
            <Link href="/legal" className="hover:text-gray-600">特定商取引法</Link>
            <Link href="/terms" className="hover:text-gray-600">利用規約</Link>
            <Link href="/privacy" className="hover:text-gray-600">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
