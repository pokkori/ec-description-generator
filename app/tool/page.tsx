"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PayjpModal from "@/components/PayjpModal";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

type Platform = "rakuten" | "amazon" | "yahoo" | "mercari";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ec_gen_count";

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };
type ProductInput = { id: number; productName: string; category: string; features: string; price: string };
type ProductResult = { product: ProductInput; parsed: ParsedResult; error?: string };

let nextId = 1;
function newProduct(): ProductInput {
  return { id: nextId++, productName: "", category: "", features: "", price: "" };
}

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
  if (sections.length === 0) sections.push({ title: "生成結果", icon: "📄", content: text });
  return { sections, raw: text };
}

// startCheckout は PayjpModal で処理するため削除済み

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
      {copied ? "✓ コピー済み" : label}
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
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span><span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[280px]">
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

function PaywallModal({ onClose, onStartPayjp }: { onClose: () => void; onStartPayjp: (plan: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">🚀</div>
          <h2 className="text-lg font-bold text-gray-900">無料枠を使い切りました</h2>
          <p className="text-sm text-gray-500 mt-1">まとめ生成で作業効率を10倍に</p>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { name: "スタンダード", price: "¥980/月", limit: "50件/月・単品生成", key: "standard", highlight: false },
            { name: "ビジネス", price: "¥4,980/月", limit: "500件/月・最大5商品まとめ生成", key: "business", highlight: true },
            { name: "エンタープライズ", price: "¥9,800/月", limit: "無制限・まとめ生成（上限なし）", key: "enterprise", highlight: false },
          ].map(p => (
            <button key={p.name} onClick={() => onStartPayjp(p.key)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors text-left ${p.highlight ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-gray-800 border-gray-200 hover:border-blue-400"}`}>
              <div>
                <div className="font-semibold text-sm">{p.name}</div>
                <div className={`text-xs ${p.highlight ? "text-blue-100" : "text-gray-500"}`}>{p.limit}</div>
              </div>
              <div className="font-bold text-sm shrink-0 ml-2">{p.price}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">閉じる</button>
      </div>
    </div>
  );
}

function ProductCard({ product, index, total, onChange, onRemove, canRemove }: {
  product: ProductInput; index: number; total: number;
  onChange: (id: number, field: keyof ProductInput, value: string) => void;
  onRemove: (id: number) => void; canRemove: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">商品 {index + 1} / {total}</span>
        {canRemove && (
          <button onClick={() => onRemove(product.id)} className="text-xs text-red-400 hover:text-red-600">削除</button>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">商品名 <span className="text-red-500">*</span></label>
        <input type="text" value={product.productName} onChange={e => onChange(product.id, "productName", e.target.value)} required
          placeholder="例: ステンレス真空断熱ボトル 500ml"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">カテゴリ</label>
          <input type="text" value={product.category} onChange={e => onChange(product.id, "category", e.target.value)}
            placeholder="例: キッチン用品"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">価格（円）</label>
          <input type="number" value={product.price} onChange={e => onChange(product.id, "price", e.target.value)}
            placeholder="例: 2980"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">特徴・セールスポイント <span className="text-red-500">*</span></label>
        <textarea value={product.features} onChange={e => onChange(product.id, "features", e.target.value)} rows={3} required
          placeholder={"例:\n- 24時間保温・保冷\n- 食洗機対応\n- カラー展開12色"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
    </div>
  );
}

export default function ECTool() {
  const [platform, setPlatform] = useState<Platform>("rakuten");
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [products, setProducts] = useState<ProductInput[]>([newProduct()]);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlan, setPayjpPlan] = useState("standard");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setUsageCount(parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
    // LPの料金プランボタンから直接決済フローに入る
    const plan = searchParams.get("plan");
    if (plan === "standard" || plan === "business" || plan === "enterprise") {
      setPayjpPlan(plan);
      setShowPayjp(true);
    }
  }, [searchParams]);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);
  const isLimitReached = usageCount >= FREE_LIMIT;

  const updateProduct = (id: number, field: keyof ProductInput, value: string) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const addProduct = () => {
    if (products.length >= 3) { setShowPaywall(true); return; }
    setProducts(ps => [...ps, newProduct()]);
  };
  const removeProduct = (id: number) => setProducts(ps => ps.filter(p => p.id !== id));

  const generateOne = async (product: ProductInput, count: number): Promise<{ result?: ParsedResult; error?: string; newCount: number }> => {
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...product, platform }) });
    if (res.status === 429) return { error: "LIMIT", newCount: count };
    const data = await res.json();
    if (!res.ok) return { error: data.error || "エラーが発生しました", newCount: count };
    return { result: parseResult(data.result || ""), newCount: data.count ?? count + 1 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) { setShowPaywall(true); return; }
    const validProducts = products.filter(p => p.productName && p.features);
    if (validProducts.length === 0) { setError("商品名と特徴を入力してください"); return; }
    setLoading(true); setResults([]); setError(""); setProgress({ current: 0, total: validProducts.length });

    let currentCount = usageCount;
    const newResults: ProductResult[] = [];

    for (let i = 0; i < validProducts.length; i++) {
      setProgress({ current: i + 1, total: validProducts.length });
      const { result, error: err, newCount } = await generateOne(validProducts[i], currentCount);
      currentCount = newCount;
      localStorage.setItem(STORAGE_KEY, String(currentCount));
      setUsageCount(currentCount);
      if (err === "LIMIT") { setShowPaywall(true); break; }
      newResults.push({ product: validProducts[i], parsed: result!, error: err });
    }

    setResults(newResults);
    setActiveResult(0);
    setLoading(false);
    if (currentCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
  };

  const downloadAll = () => {
    const text = results.map((r, i) => `${"=".repeat(40)}\n商品 ${i + 1}: ${r.product.productName}\n${"=".repeat(40)}\n${r.parsed.raw}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ec_descriptions.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onStartPayjp={(plan) => { setPayjpPlan(plan); setShowPaywall(false); setShowPayjp(true); }} />}
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={payjpPlan === "enterprise" ? "エンタープライズプラン ¥9,800/月" : payjpPlan === "business" ? "ビジネスプラン ¥4,980/月" : "スタンダードプラン ¥980/月"}
          plan={payjpPlan}
          onSuccess={() => { setShowPayjp(false); setUsageCount(0); localStorage.removeItem(STORAGE_KEY); }}
          onClose={() => setShowPayjp(false)}
        />
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI商品説明文ジェネレーター</h1>
            <p className="text-sm text-gray-500">楽天・Amazon・Yahoo!・メルカリ対応｜まとめ生成で作業効率10倍</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isLimitReached ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {isLimitReached ? "無料枠終了" : `無料あと${remaining}回`}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左：入力エリア */}
          <div className="space-y-4">
            {/* モード切替 */}
            <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
              {[
                { value: "single" as const, label: "単品生成", desc: "1商品ずつ" },
                { value: "bulk" as const, label: "まとめ生成", desc: "最大3商品一括" },
              ].map(m => (
                <button key={m.value} onClick={() => { setMode(m.value); setProducts([newProduct()]); setResults([]); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m.value ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                  {m.label}
                  <span className={`ml-1 text-xs ${mode === m.value ? "text-blue-100" : "text-gray-400"}`}>（{m.desc}）</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* プラットフォーム */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">販売プラットフォーム（全商品共通）</label>
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

              {/* 商品入力 */}
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} total={products.length}
                  onChange={updateProduct} onRemove={removeProduct} canRemove={products.length > 1} />
              ))}

              {mode === "bulk" && (
                <button type="button" onClick={addProduct}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  + 商品を追加（最大3商品・有料プランで10商品）
                </button>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={loading}
                className={`w-full font-bold py-3 rounded-xl text-white transition-colors ${isLimitReached ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
                {loading
                  ? `生成中... ${progress.current}/${progress.total}商品`
                  : isLimitReached ? "有料プランに申し込む"
                  : mode === "bulk" && products.length > 1
                  ? `${products.filter(p => p.productName && p.features).length}商品をまとめ生成する`
                  : "商品説明文セットを生成する（無料）"}
              </button>
            </form>
          </div>

          {/* 右：結果エリア */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">生成結果</label>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
                <div className="text-center px-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-700 font-semibold">
                    {progress.total > 1 ? `商品 ${progress.current} / ${progress.total} を生成中...` : "AIが説明文を生成中..."}
                  </p>
                  {progress.total > 1 && (
                    <div className="mt-3 bg-gray-100 rounded-full h-2 w-48 mx-auto">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">📌 タイトル案 → ✨ キャッチコピー → 📝 説明文 → 🔍 SEOキーワード</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {/* 複数商品タブ */}
                {results.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    {results.map((r, i) => (
                      <button key={i} onClick={() => setActiveResult(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate max-w-[120px] ${activeResult === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {r.product.productName.slice(0, 12) || `商品 ${i + 1}`}
                      </button>
                    ))}
                    <button onClick={downloadAll} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      ⬇ まとめてDL
                    </button>
                  </div>
                )}
                {results[activeResult]?.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{results[activeResult].error}</div>
                ) : results[activeResult]?.parsed ? (
                  <ResultTabs parsed={results[activeResult].parsed} />
                ) : null}
              </div>
            ) : (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] gap-3">
                <div className="text-4xl">🛒</div>
                <p className="text-sm text-center font-medium text-gray-500">
                  {mode === "bulk" ? "複数商品を入力してまとめ生成" : "商品情報を入力して生成"}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                  <p className="font-semibold text-gray-600">1商品につき生成される内容：</p>
                  <p className="text-gray-500">📌 商品タイトル案（3パターン）</p>
                  <p className="text-gray-500">✨ キャッチコピー</p>
                  <p className="text-gray-500">📝 商品説明文（300〜500文字）</p>
                  <p className="text-gray-500">🔍 SEOキーワード（15個）</p>
                  <p className="text-gray-500">💬 Q&A（3問）</p>
                  <p className="text-gray-500">📊 競合ポジショニング</p>
                </div>
                {mode === "bulk" && (
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 w-full max-w-[260px]">
                    <p className="font-semibold mb-1">まとめ生成のメリット</p>
                    <p>複数商品を一括処理。結果はタブで切り替え・全文ダウンロード可能。</p>
                  </div>
                )}
              </div>
            )}
          </div>
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
