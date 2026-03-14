import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI商品説明文ジェネレーター｜楽天・Amazon・Yahoo!対応｜30秒で自動生成",
  description: "商品名と特徴を入力するだけ。AIがSEO最適化された楽天・Amazon・Yahoo!向け商品説明文を30秒で生成。キャッチコピー・SEOキーワード10個・説明文がセットで出力。無料3回試せます。",
  keywords: "商品説明文 自動生成,楽天 商品説明文,Amazon 商品説明文,EC 商品説明 AI,商品説明文 テンプレート,楽天市場 説明文 書き方",
};

const PLANS = [
  {
    name: "スタンダード",
    price: "¥980",
    limit: "50件/月",
    stripeKey: "standard",
    highlight: false,
    features: ["商品説明文生成", "楽天・Amazon・Yahoo!対応", "SEOキーワード自動抽出", "コピー機能"],
  },
  {
    name: "ビジネス",
    price: "¥4,980",
    limit: "500件/月",
    stripeKey: "business",
    highlight: true,
    features: ["スタンダードの全機能", "一括生成（最大5商品）", "まとめてダウンロード", "優先サポート"],
  },
  {
    name: "エンタープライズ",
    price: "¥9,800",
    limit: "無制限",
    stripeKey: "enterprise",
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
            無料で試す
          </Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          楽天・Amazon・Yahoo!・メルカリ・BASE出品者向け
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          商品説明文を<span className="text-blue-600">30秒</span>で<br />
          SEO最適化して自動生成
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-xl mx-auto">
          商品名と特徴を入力するだけ。キャッチコピー・説明文・SEOキーワード10個が
          セットで即時生成。外注不要・知識不要。
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-8">
          <span>✓ 登録不要</span>
          <span>✓ 無料3回</span>
          <span>✓ クレカ不要</span>
        </div>
        <Link
          href="/tool"
          className="inline-block bg-blue-600 text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          無料で3回試す →
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">導入前後の変化</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white border border-red-200 rounded-xl p-6">
              <div className="text-red-500 font-bold text-sm mb-4">導入前</div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span>❌</span>1商品の説明文に30〜60分</li>
                <li className="flex gap-2"><span>❌</span>楽天・Amazon別々に作業</li>
                <li className="flex gap-2"><span>❌</span>キーワード調査に追加1時間</li>
                <li className="flex gap-2"><span>❌</span>外注費1商品あたり¥3,000〜</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <div className="text-blue-600 font-bold text-sm mb-4">導入後</div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span>✅</span>1商品の説明文が30秒</li>
                <li className="flex gap-2"><span>✅</span>楽天・Amazon・Yahoo!同時生成</li>
                <li className="flex gap-2"><span>✅</span>SEOキーワードも自動で挿入</li>
                <li className="flex gap-2"><span>✅</span>100商品でも月¥4,980で対応</li>
              </ul>
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
                  href={`/tool?plan=${plan.stripeKey}`}
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
          <h2 className="text-2xl font-bold text-white mb-4">
            今すぐ無料で試してみてください
          </h2>
          <p className="text-blue-100 text-sm mb-8">登録不要・クレジットカード不要。3回まで無料で使えます。</p>
          <Link
            href="/tool"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            無料で3回試す →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
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
