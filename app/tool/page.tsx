"use client";

import { useState, useEffect } from "react";

type Platform = "rakuten" | "amazon";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ec_gen_count";

const PLANS = [
  {
    name: "スタンダード",
    price: "¥980",
    per: "月",
    limit: "50件/月",
    stripeKey: "standard",
    highlight: false,
  },
  {
    name: "ビジネス",
    price: "¥2,980",
    per: "月",
    limit: "500件/月",
    stripeKey: "business",
    highlight: true,
  },
  {
    name: "エンタープライズ",
    price: "¥9,800",
    per: "月",
    limit: "無制限",
    stripeKey: "enterprise",
    highlight: false,
  },
];

async function startCheckout(plan: string) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">🎉</div>
          <h2 className="text-lg font-bold text-gray-900">無料枠を使い切りました</h2>
          <p className="text-sm text-gray-500 mt-1">
            引き続きご利用いただくには有料プランをご選択ください
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {PLANS.map((plan) => (
            <button
              key={plan.name}
              onClick={() => startCheckout(plan.stripeKey)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors ${
                plan.highlight
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-gray-800 border-gray-200 hover:border-blue-400"
              }`}
            >
              <div>
                <div className="font-semibold text-sm">{plan.name}</div>
                <div className={`text-xs ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                  {plan.limit}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{plan.price}</div>
                <div className={`text-xs ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                  /{plan.per}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState<Platform>("rakuten");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    setUsageCount(stored);
  }, []);

  const remaining = Math.max(0, FREE_LIMIT - usageCount);
  const isLimitReached = usageCount >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLimitReached) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, category, features, price, platform }),
      });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? usageCount + 1;
      localStorage.setItem(STORAGE_KEY, String(newCount));
      setUsageCount(newCount);
      setResult(data.result || "生成に失敗しました");

      if (newCount >= FREE_LIMIT) {
        setTimeout(() => setShowPaywall(true), 1500);
      }
    } catch {
      setResult("通信エラーが発生しました。インターネット接続を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    "楽天・Amazon向けのAI商品説明文ジェネレーターが便利すぎる！無料で3回試せます✨\nhttps://ec-description-generator.vercel.app"
  )}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI商品説明文ジェネレーター</h1>
            <p className="text-sm text-gray-500">楽天・Amazon向けの売れる商品説明文を瞬時に生成</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                isLimitReached
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isLimitReached ? "無料枠終了" : `無料あと${remaining}回`}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              販売プラットフォーム
            </label>
            <div className="flex gap-3">
              {(["rakuten", "amazon"] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    platform === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {p === "rakuten" ? "楽天市場" : "Amazon.co.jp"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例: ステンレス真空断熱ボトル 500ml"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="例: キッチン用品 / 健康食品 / アパレル"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">価格（円）</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="例: 2980"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              特徴・セールスポイント <span className="text-red-500">*</span>
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={5}
              placeholder={"例:\n- 24時間保温・保冷\n- 食洗機対応\n- 漏れ防止設計\n- カラー展開12色"}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-medium py-3 rounded-lg transition-colors text-sm text-white ${
              isLimitReached
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            }`}
          >
            {loading ? "生成中..." : isLimitReached ? "有料プランに申し込む" : "商品説明文を生成する"}
          </button>
        </form>

        {/* 結果表示 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">生成結果</label>
            {result && (
              <div className="flex gap-3">
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Xでシェア
                </a>
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {copied ? "コピーしました!" : "コピー"}
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                  <p className="text-sm">AIが最適な説明文を生成しています...</p>
                </div>
              </div>
            ) : result ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-sm text-center">
                  商品情報を入力して<br />「生成する」ボタンを押してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 料金プラン */}
      <div className="max-w-4xl mx-auto px-6 pb-10">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">料金プラン</h2>
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl border p-4 relative ${
                plan.highlight ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full">
                  人気No.1
                </div>
              )}
              <div className="font-bold text-gray-900 mb-1">{plan.name}</div>
              <div className="text-2xl font-bold text-blue-600">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">/{plan.per}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 mb-4">{plan.limit}</div>
              <button
                onClick={() => startCheckout(plan.stripeKey)}
                className={`block w-full text-center text-sm font-medium py-2 rounded-lg transition-colors ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                申し込む
              </button>
            </div>
          ))}
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
