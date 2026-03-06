import Link from "next/link";

const PLANS = [
  {
    name: "スタンダード",
    price: "¥980",
    limit: "50件/月",
    gumroadUrl: "https://gumroad.com/l/REPLACE_BASIC",
    highlight: false,
    features: ["商品説明文生成", "楽天・Amazon対応", "キーワード自動抽出"],
  },
  {
    name: "ビジネス",
    price: "¥2,980",
    limit: "500件/月",
    gumroadUrl: "https://gumroad.com/l/REPLACE_PRO",
    highlight: true,
    features: ["スタンダードの全機能", "CSV一括生成", "優先サポート"],
  },
  {
    name: "エンタープライズ",
    price: "¥9,800",
    limit: "無制限",
    gumroadUrl: "https://gumroad.com/l/REPLACE_BUSINESS",
    highlight: false,
    features: ["ビジネスの全機能", "APIアクセス", "専用サポート"],
  },
];

const PROBLEMS = [
  { emoji: "😫", text: "商品説明文を書くのに1商品30分かかる" },
  { emoji: "😰", text: "楽天とAmazonで別々に書き直すのが面倒" },
  { emoji: "😓", text: "SEOキーワードの入れ方がわからない" },
  { emoji: "😤", text: "ライターに外注すると高くつく" },
];

const FEATURES = [
  {
    title: "楽天・Amazon両対応",
    desc: "プラットフォームの特性に合わせた最適な説明文を自動で生成。書き直し不要。",
    icon: "🛒",
  },
  {
    title: "SEOキーワード自動抽出",
    desc: "検索で上位表示されやすいキーワードを自動で10個抽出・挿入します。",
    icon: "🔍",
  },
  {
    title: "30秒で完成",
    desc: "商品名と特徴を入力するだけ。キャッチコピー・説明文・キーワードが一括生成。",
    icon: "⚡",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ナビ */}
      <nav className="border-b border-gray-100 px-6 py-4">
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
          楽天・Amazon出品者向け
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          商品説明文を<br />
          <span className="text-blue-600">30秒</span>で自動生成
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          商品名と特徴を入力するだけ。AIがSEO最適化された
          楽天・Amazon向け商品説明文を即時に生成します。
        </p>
        <Link
          href="/tool"
          className="inline-block bg-blue-600 text-white text-base font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          無料で3回試す →
        </Link>
        <p className="text-xs text-gray-400 mt-3">クレジットカード不要</p>
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
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">3つの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-6">
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
                <li className="flex gap-2"><span>❌</span>1商品の説明文に30分</li>
                <li className="flex gap-2"><span>❌</span>楽天・Amazon別々に作業</li>
                <li className="flex gap-2"><span>❌</span>キーワード調査に追加で1時間</li>
                <li className="flex gap-2"><span>❌</span>100商品 = 50時間の作業</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-xl p-6">
              <div className="text-blue-600 font-bold text-sm mb-4">導入後</div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span>✅</span>1商品の説明文が30秒</li>
                <li className="flex gap-2"><span>✅</span>楽天・Amazon同時生成</li>
                <li className="flex gap-2"><span>✅</span>キーワードも自動抽出</li>
                <li className="flex gap-2"><span>✅</span>100商品 = 50分で完了</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">まずは無料で3回お試しください</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 relative ${
                  plan.highlight
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full">
                    人気No.1
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
                      <span className="text-blue-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  申し込む
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            まずは無料で試してみてください
          </h2>
          <p className="text-blue-100 text-sm mb-8">クレジットカード不要・3回まで無料</p>
          <Link
            href="/tool"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            無料で試す →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="max-w-5xl mx-auto px-6 space-y-2">
          <p>AI商品説明文ジェネレーター</p>
          <div className="flex justify-center gap-6">
            <Link href="/blog/rakuten-description" className="hover:text-gray-600">楽天商品説明文の書き方</Link>
            <Link href="/blog/amazon-description" className="hover:text-gray-600">Amazon商品説明文のコツ</Link>
            <Link href="/blog/ec-description-template" className="hover:text-gray-600">商品説明文テンプレート</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
