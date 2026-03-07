"use client";
import { useState, useEffect } from "react";

type Platform = "rakuten" | "amazon" | "yahoo" | "mercari";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ec_gen_count";

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "商品タイトル案", icon: "📌" },
    { key: "キャッチコピー", icon: "✨" },
    { key: "商品説明文", icon: "📝" },
    { key: "SEOキーワード", icon: "🔍" },
    { key: "よくある質問", icon: "💬" },
    { key: "ポジショニング", icon: "📊" },
  ];
  const sections: Section[] = [];
  const parts = text.split(/^---$/m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const matched = sectionDefs.find(s => trimmed.includes(s.key));
    if (matched) {
      const content = trimmed.replace(/^##\s.*$/m, "").trim();
      sections.push({ title: matched.key, icon: matched.icon, content });
    }
  }
  if (sections.length === 0) {
    sections.push({ title: "生成結果", icon: "📄", content: text });
  }
  return { sections, raw: text };
}

async function startCheckout(plan: string) {
  const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
      {copied ? "コピー済み ✓" : label}
    </button>
  );
}

function ResultTabs({ parsed }: { parsed: ParsedResult }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];

  const handlePrint = () => {
    const html = `<html><head><title>EC商品説明文</title><style>body{font-family:sans-serif;padding:32px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${parsed.raw.replace(/</g, "&lt;")}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    w?.addEventListener("load", () => { w.print(); URL.revokeObjectURL(url); });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span><span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
      </div>
      <div className="flex gap-2 justify-end">
        <CopyButton text={parsed.raw} label="全文コピー" />
        <button onClick={handlePrint} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
      </div>
    </div>
  );
}

function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">🚀</div>
          <h2 className="text-lg font-bold text-gray-900">無料枠を使い切りました</h2>
          <p className="text-sm text-gray-500 mt-1">売れる商品説明文を毎月何件でも生成</p>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { name: "スタンダード", price: "¥980/月", limit: "50件/月", key: "standard", highlight: false },
            { name: "ビジネス", price: "¥2,980/月", limit: "500件/月・複数商品対応", key: "business", highlight: true },
            { name: "エンタープライズ", price: "¥9,800/月", limit: "無制限・チーム利用", key: "enterprise", highlight: false },
          ].map(p => (
            <button key={p.name} onClick={() => startCheckout(p.key)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors ${p.highlight ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-gray-800 border-gray-200 hover:border-blue-400"}`}>
              <div>
                <div className="font-semibold text-sm text-left">{p.name}</div>
                <div className={`text-xs text-left ${p.highlight ? "text-blue-100" : "text-gray-500"}`}>{p.limit}</div>
              </div>
              <div className="font-bold text-sm">{p.price}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">閉じる</button>
      </div>
    </div>
  );
}

export default function ECTool() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState<Platform>("rakuten");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setUsageCount(parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10)); }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);
  const isLimitReached = usageCount >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) { setShowPaywall(true); return; }
    setLoading(true); setParsed(null); setError("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName, category, features, price, platform }) });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? usageCount + 1;
      localStorage.setItem(STORAGE_KEY, String(newCount));
      setUsageCount(newCount);
      setParsed(parseResult(data.result || ""));
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setError("通信エラーが発生しました。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI商品説明文ジェネレーター</h1>
            <p className="text-sm text-gray-500">楽天・Amazon・Yahoo!・メルカリ対応｜タイトル案・SEOキーワード・Q&Aをセット生成</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isLimitReached ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {isLimitReached ? "無料枠終了" : `無料あと${remaining}回`}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">販売プラットフォーム</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "rakuten", label: "楽天市場" },
                { value: "amazon", label: "Amazon.co.jp" },
                { value: "yahoo", label: "Yahoo!ショッピング" },
                { value: "mercari", label: "メルカリ" },
              ] as { value: Platform; label: string }[]).map(p => (
                <button key={p.value} type="button" onClick={() => setPlatform(p.value)}
                  className={`py-2 rounded-lg border text-sm font-medium transition-colors ${platform === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名 <span className="text-red-500">*</span></label>
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required
              placeholder="例: ステンレス真空断熱ボトル 500ml"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)}
              placeholder="例: キッチン用品 / 健康食品 / アパレル"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">価格（円）</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)}
              placeholder="例: 2980"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">特徴・セールスポイント <span className="text-red-500">*</span></label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} required rows={5}
              placeholder={"例:\n- 24時間保温・保冷\n- 食洗機対応\n- 漏れ防止設計\n- カラー展開12色"}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">箇条書きで書くと精度が上がります（{features.length}/1000文字）</p>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimitReached ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
            {loading ? "生成中..." : isLimitReached ? "有料プランに申し込む" : "商品説明文セットを生成する（無料）"}
          </button>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">生成結果</label>
          {loading ? (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">AIが最適な説明文を生成中...</p>
                <p className="text-xs text-gray-400 mt-2">📌 タイトル案 → ✨ キャッチコピー → 📝 説明文 → 🔍 SEOキーワード</p>
                <p className="text-xs text-gray-300 mt-1">通常15〜20秒かかります</p>
              </div>
            </div>
          ) : parsed ? (
            <ResultTabs parsed={parsed} />
          ) : (
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] text-gray-400 gap-3">
              <div className="text-4xl">🛒</div>
              <p className="text-sm text-center font-medium text-gray-500">商品情報を入力して<br />生成ボタンを押してください</p>
              <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                <p className="font-semibold text-gray-600">生成される内容：</p>
                <p className="text-gray-500">📌 商品タイトル案（3パターン）</p>
                <p className="text-gray-500">✨ キャッチコピー</p>
                <p className="text-gray-500">📝 商品説明文（300〜500文字）</p>
                <p className="text-gray-500">🔍 SEOキーワード（15個）</p>
                <p className="text-gray-500">💬 よくある質問・Q&A（3問）</p>
                <p className="text-gray-500">📊 競合ポジショニング</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-8">
        <a href="/legal" className="hover:underline">特定商取引法に基づく表記</a>
        <span className="mx-2">|</span>
        <a href="/privacy" className="hover:underline">プライバシーポリシー</a>
      </footer>
    </main>
  );
}
