"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import KomojuButton from "@/components/KomojuButton";
import { track } from '@vercel/analytics';

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

type Platform = "rakuten" | "amazon" | "yahoo" | "mercari" | "base";
type Tone = "professional" | "friendly" | "luxury" | "casual";
type KeywordStrength = "seo" | "balanced" | "natural";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ec_gen_count";
const HISTORY_KEY = "ec_gen_history";

// 生成履歴の型
type HistoryEntry = {
  id: number;
  productName: string;
  platform: string;
  tone: string;
  raw: string;
  savedAt: string;
};

function saveHistory(productName: string, platform: string, tone: string, raw: string) {
  try {
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const entry: HistoryEntry = {
      id: Date.now(),
      productName,
      platform,
      tone,
      raw,
      savedAt: new Date().toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    };
    history.unshift(entry);
    if (history.length > 20) history.splice(20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch { return []; }
}

// CVRスコア採点ロジック（フロントエンド・プラットフォーム別5軸）
function calculateCVRScore(text: string, platform: string): {
  score: number;
  breakdown: { label: string; score: number; maxScore: number; hint: string }[];
} {
  const breakdown: { label: string; score: number; maxScore: number; hint: string }[] = [];

  // 1. 文字数チェック（プラットフォーム別推奨）
  const lengthRanges: Record<string, [number, number]> = {
    amazon: [200, 400], rakuten: [400, 800], yahoo: [150, 300],
    mercari: [100, 200], base: [300, 500]
  };
  const [min, max] = lengthRanges[platform] || [200, 500];
  const len = text.length;
  const lenScore = len >= min && len <= max ? 20 : len >= min * 0.6 ? 10 : 5;
  breakdown.push({ label: "文字数", score: lenScore, maxScore: 20, hint: `推奨${min}〜${max}字（現在${len}字）` });

  // 2. 感情訴求ワード
  const emotionWords = ["限定", "特別", "人気", "厳選", "こだわり", "国産", "高品質", "おすすめ", "安心", "信頼", "丁寧", "上質"];
  const emotionCount = emotionWords.filter(w => text.includes(w)).length;
  const emotionScore = Math.min(20, emotionCount * 5);
  breakdown.push({ label: "感情訴求", score: emotionScore, maxScore: 20, hint: emotionCount > 0 ? `${emotionCount}個の訴求ワード検出` : "「限定」「こだわり」等のワードを追加" });

  // 3. 景表法NGワード検出（0点ペナルティ）
  const ngWords = ["最高", "日本一", "No.1", "絶対", "完全", "100%保証", "必ず", "ナンバーワン", "業界初"];
  const ngFound = ngWords.filter(w => text.includes(w));
  const ngScore = ngFound.length === 0 ? 20 : Math.max(0, 20 - ngFound.length * 7);
  breakdown.push({ label: "景表法クリア", score: ngScore, maxScore: 20, hint: ngFound.length > 0 ? `⚠️「${ngFound.slice(0, 2).join("」「")}」は使用注意` : "✅ NGワードなし" });

  // 4. 数値・スペック訴求
  const numberMatches = text.match(/\d+/g) || [];
  const numberScore = numberMatches.length >= 3 ? 20 : numberMatches.length >= 1 ? 12 : 4;
  breakdown.push({ label: "スペック訴求", score: numberScore, maxScore: 20, hint: numberMatches.length > 0 ? `✅ 数値${numberMatches.length}箇所` : "サイズ・重量・成分%等を追加" });

  // 5. 行動促進ワード
  const ctaWords = ["ぜひ", "お試し", "今すぐ", "チェック", "どうぞ", "ご確認", "ぜひお試し", "お求め"];
  const ctaCount = ctaWords.filter(w => text.includes(w)).length;
  const ctaScore = ctaCount >= 2 ? 20 : ctaCount === 1 ? 13 : 4;
  breakdown.push({ label: "購買促進", score: ctaScore, maxScore: 20, hint: ctaCount > 0 ? `✅ 行動促進ワード${ctaCount}個` : "「ぜひお試しください」等を追加" });

  const total = breakdown.reduce((sum, b) => sum + b.score, 0);
  return { score: total, breakdown };
}

// CVRスコアパネル（円形SVGゲージ + 5軸ブレークダウン）
function CVRScorePanel({ text, platform }: { text: string; platform: string }) {
  const { score, breakdown } = calculateCVRScore(text, platform);
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const bgClass = score >= 75 ? "bg-green-50 border-green-300" : score >= 50 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300";
  const badgeClass = score >= 75 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  const badge = score >= 75 ? "高CVR見込み" : score >= 50 ? "改善で伸びる" : "要改善";
  const barClass = score >= 75 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

  // SVG 円形ゲージ
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  const hints = breakdown.filter(b => b.score < b.maxScore);

  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${bgClass}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700">🎯 CVR予測スコア（リアルタイム採点）</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
      </div>

      {/* 円形ゲージ + 5軸バー */}
      <div className="flex items-center gap-4">
        {/* 円形SVGゲージ */}
        <div className="shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="44" cy="44" r={radius}
              fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 44 44)"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text x="44" y="47" textAnchor="middle" dominantBaseline="middle"
              fontSize="20" fontWeight="900" fill={color}>{score}</text>
            <text x="44" y="62" textAnchor="middle" fontSize="9" fill="#9ca3af">/100</text>
          </svg>
        </div>

        {/* 5軸ブレークダウン */}
        <div className="flex-1 space-y-1.5">
          {breakdown.map((b, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-gray-600">{b.label}</span>
                <span className={`text-xs font-bold ${b.score === b.maxScore ? "text-green-600" : "text-amber-600"}`}>{b.score}/{b.maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${(b.score / b.maxScore) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 改善ヒント */}
      {hints.length > 0 && (
        <div className="mt-3 bg-white/70 rounded-lg p-3 space-y-1">
          <p className="text-xs font-bold text-gray-600 mb-1">スコアを上げるヒント</p>
          {hints.map((b, i) => (
            <p key={i} className="text-xs text-gray-500 flex items-start gap-1">
              <span className="text-amber-500 shrink-0">→</span>{b.label}: {b.hint}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// 文字数カウンター + Amazon/楽天推奨ガイド
function CharCountGuide({ text, platform }: { text: string; platform: string }) {
  const len = text.length;
  const guides: Record<string, { min: number; max: number; label: string }> = {
    amazon: { min: 200, max: 400, label: "Amazon推奨: 200〜400字" },
    rakuten: { min: 400, max: 800, label: "楽天推奨: 400〜800字" },
    yahoo: { min: 150, max: 300, label: "Yahoo!推奨: 150〜300字" },
    mercari: { min: 100, max: 200, label: "メルカリ推奨: 100〜200字" },
    base: { min: 300, max: 500, label: "BASE推奨: 300〜500字" },
  };
  const guide = guides[platform] ?? guides.amazon;
  const isOk = len >= guide.min && len <= guide.max;
  const isTooShort = len < guide.min;
  const color = isOk ? "text-green-600" : isTooShort ? "text-red-500" : "text-amber-600";
  const bgColor = isOk ? "bg-green-50 border-green-200" : isTooShort ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200";
  return (
    <div className={`mt-2 border rounded-lg px-3 py-2 flex items-center justify-between ${bgColor}`}>
      <span className="text-xs text-gray-500">{guide.label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${color}`}>{len}字</span>
        <span className={`text-xs font-bold ${color}`}>{isOk ? "✓ 適正" : isTooShort ? "不足" : "超過"}</span>
      </div>
    </div>
  );
}

type Section = { title: string; icon: string; content: string };
type ParsedResult = { sections: Section[]; raw: string };
type ProductInput = { id: number; productName: string; category: string; features: string; price: string };
type ProductResult = { product: ProductInput; parsed: ParsedResult; error?: string; rawText?: string };

let nextId = 1;
function newProduct(): ProductInput {
  return { id: nextId++, productName: "", category: "", features: "", price: "" };
}

function extractCvrScore(text: string): number | null {
  const m = text.match(/===CVR_SCORE===(\d+)/);
  return m ? Math.min(100, parseInt(m[1], 10)) : null;
}

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "商品タイトル案", icon: "📌" },
    { key: "キャッチコピー", icon: "✨" },
    { key: "商品説明文", icon: "📝" },
    { key: "SEOキーワード", icon: "🔍" },
    { key: "よくある質問", icon: "💬" },
    { key: "ポジショニング", icon: "📊" },
    { key: "CVR予測スコア", icon: "🎯" },
  ];
  const cleanText = text.replace(/===CVR_SCORE===\d+\n?/g, "");
  const sections: Section[] = [];
  const parts = cleanText.split(/^---$/m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const matched = sectionDefs.find(s => trimmed.includes(s.key));
    if (matched) {
      const content = trimmed.replace(/^##\s.*$/m, "").trim();
      sections.push({ title: matched.key, icon: matched.icon, content });
    }
  }
  if (sections.length === 0) sections.push({ title: "生成結果", icon: "📄", content: cleanText });
  return { sections, raw: cleanText };
}

// startCheckout は PayjpModal で処理するため削除済み

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        aria-label={copied ? "コピーしました" : `${label}をクリップボードにコピーする`}
        className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${copied ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
      >
        {copied ? "✅ コピーしました！" : label}
      </button>
      {copied && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg animate-bounce">
          クリップボードにコピーしました
        </div>
      )}
    </div>
  );
}

// ECサイト風プレビューコンポーネント
function ECPreview({ parsed, productName, platform }: { parsed: ParsedResult; productName?: string; platform?: string }) {
  const titleSection = parsed.sections.find(s => s.title === "商品タイトル案");
  const descSection = parsed.sections.find(s => s.title === "商品説明文");
  const catchSection = parsed.sections.find(s => s.title === "キャッチコピー");

  const titleText = titleSection?.content.split("\n").find(l => l.trim())?.replace(/^[①②③1-9\.\-\s]+/, "").trim() ?? productName ?? "商品タイトル";
  const catchText = catchSection?.content.split("\n").find(l => l.trim())?.trim() ?? "";
  const descText = descSection?.content.trim() ?? "";

  const platformLabel = {
    rakuten: "楽天市場", amazon: "Amazon", yahoo: "Yahoo!ショッピング",
    mercari: "メルカリ", base: "BASE"
  }[platform ?? ""] ?? "ECサイト";

  return (
    <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-gray-50">
      <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-2">
        <span>🛒 {platformLabel} プレビュー</span>
        <span className="ml-auto text-blue-200">（参考イメージ）</span>
      </div>
      <div className="p-4 bg-white">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{titleText}</h3>
          {catchText && <p className="text-sm text-blue-600 font-semibold mb-2">{catchText}</p>}
          <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3 text-gray-400 text-sm">
            [商品画像エリア]
          </div>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-wrap">{descText.slice(0, 200)}{descText.length > 200 ? "..." : ""}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">商品説明・SEOキーワード含む</span>
            <button type="button" aria-label="カートに入れる（プレビュー表示）" className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">カートに入れる</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 文章品質スコア計算ロジック（フロントエンドのみ）
type QualityCheckItem = { label: string; ok: boolean; point: number };
function calcQualityScore(text: string): { total: number; items: QualityCheckItem[] } {
  const charLen = text.length;
  const hasKeyword = /特徴|品質|安心|おすすめ|人気|定番|こだわり|丁寧|高品質|厳選/.test(text);
  const hasNumber = /\d+/.test(text);
  const hasEmoji = /[\u{1F300}-\u{1FFFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text);
  const lineBreaks = (text.match(/\n/g) || []).length;
  const hasTrust = /送料|返品|保証|安全|公式|正規|認証|実績|満足|レビュー/.test(text);

  const charOk = charLen >= 200 && charLen <= 400;
  const items: QualityCheckItem[] = [
    { label: `文字数200〜400字（現在${charLen}字）`, ok: charOk, point: 25 },
    { label: "品質・安心系キーワードを含む", ok: hasKeyword, point: 20 },
    { label: "数字（サイズ・重量・個数等）を含む", ok: hasNumber, point: 15 },
    { label: "絵文字を含む", ok: hasEmoji, point: 10 },
    { label: "改行が3回以上（読みやすさ）", ok: lineBreaks >= 3, point: 15 },
    { label: "送料・返品・保証等の信頼ワードを含む", ok: hasTrust, point: 15 },
  ];
  const total = items.reduce((acc, item) => acc + (item.ok ? item.point : 0), 0);
  return { total, items };
}

function QualityScoreCard({ text }: { text: string }) {
  const { total, items } = calcQualityScore(text);
  const color = total >= 80 ? "text-green-600" : total >= 60 ? "text-amber-600" : "text-red-600";
  const bg = total >= 80 ? "bg-green-50 border-green-300" : total >= 60 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300";
  const barColor = total >= 80 ? "bg-green-500" : total >= 60 ? "bg-amber-500" : "bg-red-500";
  const badge = total >= 80 ? "優秀！" : total >= 60 ? "良好" : "改善余地あり";
  const badgeColor = total >= 80 ? "bg-green-100 text-green-700" : total >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700">📊 説明文品質スコア</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <span className={`text-5xl font-black ${color}`}>{total}</span>
        <span className="text-lg text-gray-500 mb-1">/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${total}%` }} />
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
            <span className={item.ok ? "text-green-500" : "text-red-400"}>{item.ok ? "✅" : "❌"}</span>
            <span className={item.ok ? "" : "text-gray-400"}>{item.label}</span>
            <span className={`ml-auto font-semibold ${item.ok ? "text-green-600" : "text-gray-300"}`}>+{item.point}pt</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CvrScoreCard({ score }: { score: number }) {
  const color = score >= 75 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600";
  const bg = score >= 75 ? "bg-green-50 border-green-300" : score >= 60 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300";
  const barColor = score >= 75 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  const label = score >= 75 ? "高CVR見込み" : score >= 60 ? "平均的" : "改善の余地あり";
  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700">🎯 CVR予測スコア（購買転換率）</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score >= 75 ? "bg-green-100 text-green-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{label}</span>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <span className={`text-5xl font-black ${color}`}>{score}</span>
        <span className="text-lg text-gray-500 mb-1">/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-gray-500">
        {score >= 75 ? "この説明文は購買意欲を強く喚起する内容です。そのまま掲載してください。" : score >= 60 ? "平均的なCVRが期待できます。「CVR予測スコアと改善提案」タブの内容で更に磨くと効果的です。" : "改善余地があります。「CVR予測スコアと改善提案」の指摘を反映して再生成することをお勧めします。"}
      </p>
    </div>
  );
}

// A/Bテスト比較カード
function ABTestCompare({ textA, textB, labelA, labelB }: { textA: string; textB: string; labelA: string; labelB: string }) {
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const qA = calcQualityScore(textA);
  const qB = calcQualityScore(textB);
  return (
    <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
      <p className="text-sm font-bold text-indigo-800 mb-3">🔬 A/Bテスト比較</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: labelA, text: textA, score: qA.total, key: "A" as const },
          { label: labelB, text: textB, score: qB.total, key: "B" as const },
        ].map(({ label, score, key }) => (
          <div key={key}
            onClick={() => setWinner(key)}
            className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${winner === key ? "border-indigo-500 bg-indigo-100" : "border-gray-200 bg-white hover:border-indigo-300"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-indigo-700">{label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score >= 80 ? "bg-green-100 text-green-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                品質 {score}pt
              </span>
            </div>
            {winner === key && <span className="text-xs font-bold text-indigo-600">✓ このパターンを採用</span>}
          </div>
        ))}
      </div>
      {winner && (
        <p className="text-xs text-center text-indigo-600 mt-2 font-bold">
          {winner === "A" ? labelA : labelB} が選ばれました！上のタブから文章をコピーしてください。
        </p>
      )}
    </div>
  );
}

function ResultTabs({ parsed, productName, platform, rawText, tone }: { parsed: ParsedResult; productName?: string; platform?: string; rawText?: string; tone?: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const cvrScore = rawText ? extractCvrScore(rawText) : null;
  const descSection = parsed.sections.find(s => s.title === "商品説明文");
  const [editedDesc, setEditedDesc] = useState(descSection?.content ?? "");
  const [debouncedDesc, setDebouncedDesc] = useState(editedDesc);

  // descSection が変わったら editedDesc をリセット
  useEffect(() => {
    setEditedDesc(descSection?.content ?? "");
    setDebouncedDesc(descSection?.content ?? "");
  }, [descSection?.content]);

  // debounce: 400ms後にスコア更新
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDesc(editedDesc), 400);
    return () => clearTimeout(timer);
  }, [editedDesc]);

  // activeTab のセクション（editedDesc を商品説明文に反映）
  const currentSections = parsed.sections.map(s =>
    s.title === "商品説明文" ? { ...s, content: editedDesc } : s
  );
  const section = currentSections[activeTab];
  const qualityText = editedDesc || parsed.raw;

  const handlePrint = () => {
    const html = `<html><head><title>EC商品説明文</title><style>body{font-family:sans-serif;padding:32px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${parsed.raw.replace(/</g, "&lt;")}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    w?.addEventListener("load", () => { w.print(); URL.revokeObjectURL(url); });
  };

  const shareText = productName
    ? `「${productName}」の商品説明文をAIで生成してみたら、CVR予測スコアまで出てきて驚いた！SEOキーワード・Q&A・競合ポジショニングまで30秒で完成。もう手書きには戻れない。 https://ec-description-generator.vercel.app #EC #ネットショップ #AI文章生成`
    : `EC説明文AIを試したら商品説明文・タイトル3案・SEOキーワード15個がまとめて生成された！CVR予測スコアも出てきて感動。 https://ec-description-generator.vercel.app #EC #ネットショップ #AI文章生成`;

  return (
    <div className="space-y-3">
      {/* 達成感演出バナー */}
      <div className="animate-bounce bg-green-50 border-2 border-green-400 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-bold text-green-800">説明文が完成しました！</p>
          <p className="text-xs text-green-600">タイトル案・キャッチコピー・説明文・SEOキーワード・Q&A・ポジショニング</p>
        </div>
      </div>
      {cvrScore !== null && <CvrScoreCard score={cvrScore} />}
      {/* リアルタイムCVRスコアパネル（商品説明文テキスト連動） */}
      <CVRScorePanel text={debouncedDesc || qualityText} platform={platform ?? "amazon"} />
      <QualityScoreCard text={qualityText} />

      <div className="flex gap-1 flex-wrap">
        {currentSections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            aria-label={`「${s.title}」セクションを表示する`}
            aria-pressed={activeTab === i}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span aria-hidden="true">{s.icon}</span><span>{s.title}</span>
          </button>
        ))}
        <button onClick={() => setShowPreview(!showPreview)}
          aria-label={showPreview ? "ECサイト風プレビューを閉じる" : "ECサイト風プレビューを表示する"}
          aria-expanded={showPreview}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showPreview ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`}>
          <span aria-hidden="true">🛒</span> プレビュー
        </button>
      </div>

      {/* ECサイト風プレビュー */}
      {showPreview && (
        <ECPreview parsed={{ ...parsed, sections: currentSections }} productName={productName} platform={platform} />
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[280px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        {section.title === "商品説明文" ? (
          <>
            <textarea
              value={editedDesc}
              onChange={e => setEditedDesc(e.target.value)}
              rows={10}
              aria-label="商品説明文（直接編集するとCVRスコアがリアルタイムで更新されます）"
              className="w-full text-sm text-gray-800 font-sans leading-relaxed border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
              placeholder="説明文を直接編集するとCVRスコアがリアルタイムで更新されます"
            />
            <p className="text-xs text-blue-500 mt-1">✏️ テキストを編集するとCVRスコアが自動更新されます</p>
            <CharCountGuide text={editedDesc} platform={platform ?? "amazon"} />
          </>
        ) : section.title === "SEOキーワード" ? (
          <>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
            <SeoKeywordBar keywords={section.content} />
          </>
        ) : (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
        )}
      </div>
      <div className="flex gap-2 justify-end flex-wrap">
        <CopyButton text={parsed.raw} label="📋 全文コピー" />
        <button onClick={handlePrint} aria-label="商品説明文を印刷またはPDFとして保存する" className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1 rounded-lg bg-sky-500 text-white hover:bg-sky-600 font-medium transition-colors"
        >
          𝕏 AIが作った説明文をシェア
        </a>
      {/* 次のアクション3選 */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm font-bold text-blue-800 mb-3">📋 次にやるべきこと3選</p>
        <ol className="space-y-2">
          {[
            { icon: "📋", text: "この説明文をコピーして商品ページに貼り付ける" },
            { icon: "🔄", text: "別の角度（価格訴求・感情訴求）で再生成してA/Bテストする" },
            { icon: "📊", text: "説明文を変えた後の商品ページのCVR変化を計測する" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{i + 1}. {item.text}</span>
            </li>
          ))}
        </ol>
      </div>
      {/* 生成した説明文を使ってみよう - BASE A8.netアフィリエイト */}
      <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-sm font-bold text-orange-800 mb-3">🏪 生成した説明文を使ってみよう</p>
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8ZAE9E+2QQG+62MDD"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-between bg-white border border-orange-300 rounded-xl px-4 py-3 hover:bg-orange-50 transition-colors"
        >
          <div>
            <div className="text-sm font-bold text-slate-800">BASE — 無料でネットショップ開業</div>
            <div className="text-xs text-slate-500 mt-0.5">初期費用・月額無料 • 今すぐショップ開設できる</div>
          </div>
          <span className="text-orange-600 font-bold text-xs bg-orange-100 px-2 py-1 rounded-full shrink-0 ml-2">無料で開業 →</span>
        </a>
        <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR（BASE公式サイトに遷移します）</p>
      </div>
      </div>
    </div>
  );
}

// SEOキーワード強度バー（キーワードセクションの可視化）
function SeoKeywordBar({ keywords }: { keywords: string }) {
  if (!keywords.trim()) return null;
  const kws = keywords.split(/[,、\n]/).map(k => k.trim()).filter(k => k.length > 0);
  const total = kws.length;
  const strengthScore = Math.min(100, Math.round((total / 15) * 100));
  const color = strengthScore >= 80 ? "bg-green-500" : strengthScore >= 50 ? "bg-amber-500" : "bg-red-400";
  const label = strengthScore >= 80 ? "強い" : strengthScore >= 50 ? "普通" : "弱い";
  const labelColor = strengthScore >= 80 ? "text-green-700" : strengthScore >= 50 ? "text-amber-700" : "text-red-600";
  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">🔍 SEOキーワード強度 ({total}個)</span>
        <span className={`text-xs font-bold ${labelColor}`}>{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${strengthScore}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">推奨: 12〜15個｜現在{total}個{total < 12 ? "（追加推奨）" : total > 18 ? "（多すぎ注意）" : "（最適）"}</p>
    </div>
  );
}

// 3プラットフォーム同時比較パネル
type MultiPlatformResult = { platform: string; platformLabel: string; parsed: ParsedResult; rawText: string; cvrScore: number | null };

function MultiPlatformPanel({ results, onClose }: { results: MultiPlatformResult[]; onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const platformColors: Record<string, string> = {
    rakuten: "bg-red-600", amazon: "bg-orange-500", yahoo: "bg-purple-600"
  };
  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };
  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-indigo-800">🔀 3プラットフォーム同時比較</p>
        <button onClick={onClose} aria-label="3プラットフォーム比較パネルを閉じる" className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full">閉じる</button>
      </div>
      {/* プラットフォーム選択タブ */}
      <div className="flex gap-1 mb-3">
        {results.map((r, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            aria-label={`${r.platformLabel}の比較結果を表示する`}
            aria-pressed={activeIdx === i}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeIdx === i ? `${platformColors[r.platform] ?? "bg-blue-600"} text-white shadow` : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"}`}>
            {r.platformLabel}
            {r.cvrScore !== null && (
              <span className={`block text-xs ${activeIdx === i ? "text-white/80" : "text-gray-400"}`}>CVR {r.cvrScore}pt</span>
            )}
          </button>
        ))}
      </div>
      {/* CVR比較バー */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
        <p className="text-xs font-bold text-gray-600 mb-2">CVR予測スコア比較</p>
        {results.map((r, i) => (
          <div key={i} className="mb-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-gray-600">{r.platformLabel}</span>
              <span className="text-xs font-bold text-gray-800">{r.cvrScore ?? "—"}/100</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${(r.cvrScore ?? 0) >= 70 ? "bg-green-500" : (r.cvrScore ?? 0) >= 50 ? "bg-amber-500" : "bg-red-400"}`}
                style={{ width: `${r.cvrScore ?? 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* 選択プラットフォームの説明文プレビュー */}
      {results[activeIdx] && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">📝 商品説明文</span>
            <button
              onClick={() => {
                const desc = results[activeIdx].parsed.sections.find(s => s.title === "商品説明文")?.content ?? results[activeIdx].rawText;
                handleCopy(desc, activeIdx);
              }}
              aria-label={copiedIdx === activeIdx ? "コピーしました" : `${results[activeIdx]?.platformLabel ?? ""}の商品説明文をクリップボードにコピーする`}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${copiedIdx === activeIdx ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            >
              {copiedIdx === activeIdx ? "✅ コピーしました" : "コピー"}
            </button>
          </div>
          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {results[activeIdx].parsed.sections.find(s => s.title === "商品説明文")?.content?.slice(0, 300) ?? results[activeIdx].rawText.slice(0, 300)}
            {((results[activeIdx].parsed.sections.find(s => s.title === "商品説明文")?.content?.length ?? 0) > 300) ? "..." : ""}
          </p>
        </div>
      )}
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
            <button key={p.name} onClick={() => { track('upgrade_click', { service: 'EC説明文生成AI', plan: p.key }); onStartPayjp(p.key); }}
              aria-label={`${p.name}プラン（${p.price}、${p.limit}）を選択する`}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-colors text-left ${p.highlight ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-white text-gray-800 border-gray-200 hover:border-blue-400"}`}>
              <div>
                <div className="font-semibold text-sm">{p.name}</div>
                <div className={`text-xs ${p.highlight ? "text-blue-100" : "text-gray-500"}`}>{p.limit}</div>
              </div>
              <div className="font-bold text-sm shrink-0 ml-2">{p.price}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} aria-label="プレミアムプランのモーダルを閉じる" className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">閉じる</button>
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
          <button onClick={() => onRemove(product.id)} aria-label={`商品 ${index + 1} を削除する`} className="text-xs text-red-400 hover:text-red-600">削除</button>
        )}
      </div>
      {/* カテゴリプリセット */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { emoji: "👕", label: "アパレル", cat: "ファッション・衣類", feat: "- 素材：コットン100%\n- サイズ展開：S〜XL\n- 洗濯機OK\n- 速乾・吸湿性高い" },
          { emoji: "💄", label: "美容", cat: "コスメ・スキンケア", feat: "- 肌に優しい低刺激処方\n- 無香料・無添加\n- 全肌タイプ対応\n- 美容成分○○配合" },
          { emoji: "🍳", label: "キッチン", cat: "キッチン用品・調理器具", feat: "- 食洗機対応\n- IH対応\n- ステンレス素材\n- 高さ調節機能付き" },
          { emoji: "📱", label: "デジタル", cat: "スマートフォン・電子機器", feat: "- バッテリー持続XX時間\n- 防水・防塵対応\n- USB-C充電\n- 軽量コンパクト設計" },
          { emoji: "🧸", label: "ギフト", cat: "ギフト・プレゼント向け", feat: "- ラッピング対応\n- メッセージカード付き\n- 贈り物箱入り\n- 高見え・特別感ある仕上げ" },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { onChange(product.id, "category", p.cat); onChange(product.id, "features", p.feat); }}
            aria-label={`カテゴリ「${p.label}」のプリセットを入力欄に反映する`}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full transition font-medium"
          >
            <span aria-hidden="true">{p.emoji}</span> {p.label}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">商品名 <span className="text-red-500">*</span></label>
        <input type="text" value={product.productName} onChange={e => onChange(product.id, "productName", e.target.value)} required
          placeholder="例: ステンレス真空断熱ボトル 500ml"
          aria-label={`商品 ${index + 1} の商品名（必須）`}
          aria-required="true"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">カテゴリ</label>
          <input type="text" value={product.category} onChange={e => onChange(product.id, "category", e.target.value)}
            placeholder="例: キッチン用品"
            aria-label={`商品 ${index + 1} のカテゴリ`}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">価格（円）</label>
          <input type="number" value={product.price} onChange={e => onChange(product.id, "price", e.target.value)}
            placeholder="例: 2980"
            aria-label={`商品 ${index + 1} の価格（円）`}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">特徴・セールスポイント <span className="text-red-500">*</span></label>
        <textarea value={product.features} onChange={e => onChange(product.id, "features", e.target.value)} rows={3} required
          placeholder={"例:\n- 24時間保温・保冷\n- 食洗機対応\n- カラー展開12色"}
          aria-label={`商品 ${index + 1} の特徴・セールスポイント（必須）`}
          aria-required="true"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
    </div>
  );
}

function ECToolInner() {
  const [platform, setPlatform] = useState<Platform>("rakuten");
  const [tone, setTone] = useState<Tone>("professional");
  const [keywordStrength, setKeywordStrength] = useState<KeywordStrength>("balanced");
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [products, setProducts] = useState<ProductInput[]>([newProduct()]);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [activeResult, setActiveResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [usageCount, setUsageCount] = useState(0);
  const [ngWords, setNgWords] = useState<string[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlan, setPayjpPlan] = useState("standard");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [multiResults, setMultiResults] = useState<MultiPlatformResult[]>([]);
  const [multiLoading, setMultiLoading] = useState(false);
  const [showMultiCompare, setShowMultiCompare] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setUsageCount(parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10));
    setHistory(loadHistory());
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

  const generateOne = async (product: ProductInput, count: number): Promise<{ result?: ParsedResult; error?: string; newCount: number; ngWordsFound?: string[]; rawText?: string }> => {
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...product, platform, tone, keywordStrength }) });
    if (res.status === 429) return { error: "LIMIT", newCount: count };
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || "少し時間を置いてもう一度お試しください 🙏", newCount: count };
    }
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let newCount = count + 1;
    let ngWordsFound: string[] = [];
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk.includes("\nDONE:")) {
        const idx = chunk.indexOf("\nDONE:");
        accumulated += chunk.slice(0, idx);
        setStreamingText(accumulated);
        try {
          const meta = JSON.parse(chunk.slice(idx + 6));
          newCount = meta.count ?? newCount;
          ngWordsFound = meta.ngWordsFound ?? [];
        } catch { /* ignore */ }
      } else {
        accumulated += chunk;
        setStreamingText(accumulated);
      }
    }
    setStreamingText("");
    return { result: parseResult(accumulated), newCount, ngWordsFound, rawText: accumulated };
  };

  const handleMultiGenerate = async () => {
    const validProducts = products.filter(p => p.productName && p.features);
    if (validProducts.length === 0) { setError("商品名と特徴を入力してください"); return; }
    if (isLimitReached) { track('paywall_shown', { service: 'EC説明文生成AI' }); setShowPaywall(true); return; }
    setMultiLoading(true);
    setMultiResults([]);
    track('multi_platform_generate', { service: 'EC説明文生成AI' });
    const targetPlatforms: { value: Platform; label: string }[] = [
      { value: "amazon", label: "Amazon" },
      { value: "rakuten", label: "楽天市場" },
      { value: "yahoo", label: "Yahoo!ショッピング" },
    ];
    try {
      let currentCount = usageCount;
      const mResults = await Promise.all(targetPlatforms.map(async (p) => {
        const product = validProducts[0];
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...product, platform: p.value, tone, keywordStrength }),
        });
        if (!res.ok) return null;
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk.includes("\nDONE:")) {
            const idx = chunk.indexOf("\nDONE:");
            accumulated += chunk.slice(0, idx);
            try {
              const meta = JSON.parse(chunk.slice(idx + 6));
              currentCount = meta.count ?? currentCount;
            } catch { /* ignore */ }
          } else {
            accumulated += chunk;
          }
        }
        const parsed = parseResult(accumulated);
        const cvrScore = extractCvrScore(accumulated) ?? calculateCVRScore(accumulated, p.value).score;
        return { platform: p.value, platformLabel: p.label, parsed, rawText: accumulated, cvrScore } as MultiPlatformResult;
      }));
      localStorage.setItem(STORAGE_KEY, String(currentCount));
      setUsageCount(currentCount);
      setMultiResults(mResults.filter((r): r is MultiPlatformResult => r !== null));
      setShowMultiCompare(true);
      if (currentCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } finally {
      setMultiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) { track('paywall_shown', { service: 'EC説明文生成AI' }); setShowPaywall(true); return; }
    const validProducts = products.filter(p => p.productName && p.features);
    if (validProducts.length > 0) track('ai_generated', { service: 'EC説明文生成AI' });
    if (validProducts.length === 0) { setError("商品名と特徴を入力してください"); return; }
    setLoading(true); setResults([]); setError(""); setStreamingText(""); setProgress({ current: 0, total: validProducts.length });

    let currentCount = usageCount;
    const newResults: ProductResult[] = [];
    const allNgWords: string[] = [];

    for (let i = 0; i < validProducts.length; i++) {
      setProgress({ current: i + 1, total: validProducts.length });
      const { result, error: err, newCount, ngWordsFound, rawText: rawTextResult } = await generateOne(validProducts[i], currentCount);
      currentCount = newCount;
      localStorage.setItem(STORAGE_KEY, String(currentCount));
      setUsageCount(currentCount);
      if (err === "LIMIT") { track('paywall_shown', { service: 'EC説明文生成AI' }); setShowPaywall(true); break; }
      if (ngWordsFound) allNgWords.push(...ngWordsFound.filter(w => !allNgWords.includes(w)));
      newResults.push({ product: validProducts[i], parsed: result!, error: err, rawText: rawTextResult });
    }
    setNgWords(allNgWords);

    setResults(newResults);
    setActiveResult(0);
    setLoading(false);
    // 生成履歴に保存（最初の商品のみ）
    if (newResults.length > 0 && newResults[0].parsed) {
      saveHistory(newResults[0].product.productName, platform, tone, newResults[0].parsed.raw);
      setHistory(loadHistory());
    }
    if (currentCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
  };

  const downloadAll = () => {
    const text = results.map((r, i) => `${"=".repeat(40)}\n商品 ${i + 1}: ${r.product.productName}\n${"=".repeat(40)}\n${r.parsed.raw}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ec_descriptions.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows: string[][] = [
      ["商品名", "プラットフォーム", "トーン", "説明文", "CVRスコア", "文字数", "生成日時"],
    ];
    const platformLabel: Record<string, string> = {
      rakuten: "楽天市場", amazon: "Amazon", yahoo: "Yahoo!ショッピング",
      mercari: "メルカリ", base: "BASE",
    };
    const toneLabel: Record<string, string> = {
      professional: "プロフェッショナル", friendly: "フレンドリー",
      luxury: "高級感", casual: "カジュアル",
    };
    const now = new Date().toLocaleString("ja-JP");
    for (const r of results) {
      if (!r.parsed) continue;
      const descSection = r.parsed.sections.find(s => s.title === "商品説明文");
      const descText = descSection ? descSection.content : r.parsed.raw;
      const cvrScore = calculateCVRScore(descText, platform).score;
      rows.push([
        r.product.productName,
        platformLabel[platform] ?? platform,
        toneLabel[tone] ?? tone,
        descText,
        String(cvrScore),
        String(descText.length),
        now,
      ]);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ec_descriptions_${new Date().toLocaleDateString("ja-JP").replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onStartPayjp={(plan) => { setPayjpPlan(plan); setShowPaywall(false); setShowPayjp(true); }} />}
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} aria-label="決済モーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">🛒</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">{payjpPlan === "enterprise" ? "エンタープライズ — 無制限+API連携" : payjpPlan === "business" ? "ビジネス — 無制限+複数ショップ" : "スタンダード — 無制限利用"}</p>
            <KomojuButton planId="standard" planLabel={payjpPlan === "enterprise" ? "エンタープライズプラン ¥9,800/月" : payjpPlan === "business" ? "ビジネスプラン ¥4,980/月" : "スタンダードプラン ¥980/月"} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
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
                  aria-label={`${m.label}モードに切り替える（${m.desc}）`}
                  aria-pressed={mode === m.value}
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
                    { value: "rakuten", label: "楽天市場", icon: "🛒", hint: "感情訴求・特典強調・読みやすい長文" },
                    { value: "amazon", label: "Amazon.co.jp", icon: "📦", hint: "検索SEO重視・スペック詳細・箇条書き" },
                    { value: "yahoo", label: "Yahoo!ショッピング", icon: "🛍️", hint: "価格訴求・レビュー連動・シンプル" },
                    { value: "mercari", label: "メルカリ", icon: "♻️", hint: "状態記載・簡潔・信頼感重視" },
                    { value: "base", label: "BASE / Shopify", icon: "🏪", hint: "ブランドストーリー・世界観・感性訴求" },
                  ] as { value: Platform; label: string; icon: string; hint: string }[]).map(p => (
                    <button key={p.value} type="button" onClick={() => setPlatform(p.value)}
                      aria-label={`${p.label}向けに説明文を生成する（${p.hint}）`}
                      aria-pressed={platform === p.value}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors text-left ${platform === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                      <span className="mr-1" aria-hidden="true">{p.icon}</span>{p.label}
                      {platform === p.value && (
                        <span className="block text-xs font-normal text-blue-100 mt-0.5">{p.hint}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文体トーン選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文体トーン</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "professional" as Tone, label: "プロフェッショナル", icon: "💼", hint: "信頼感・実績・スペック重視" },
                    { value: "friendly" as Tone, label: "親しみやすい", icon: "😊", hint: "口コミ風・共感・日常生活" },
                    { value: "luxury" as Tone, label: "高級感", icon: "✨", hint: "ブランド・こだわり・特別感" },
                    { value: "casual" as Tone, label: "カジュアル", icon: "🎉", hint: "若者向け・SNS映え・フレンドリー" },
                  ]).map(t => (
                    <button key={t.value} type="button" onClick={() => setTone(t.value)}
                      aria-label={`文体トーン「${t.label}」を選択する（${t.hint}）`}
                      aria-pressed={tone === t.value}
                      className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors text-left ${tone === t.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"}`}>
                      <span className="mr-1" aria-hidden="true">{t.icon}</span>{t.label}
                      {tone === t.value && (
                        <span className="block text-xs font-normal text-indigo-100 mt-0.5">{t.hint}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEOキーワード強度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEOキーワード強度</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "seo" as KeywordStrength, label: "SEO重視", icon: "🔍", hint: "キーワード密度高め・検索上位狙い" },
                    { value: "balanced" as KeywordStrength, label: "バランス型", icon: "⚖️", hint: "自然な文中にSEOキーワード挿入" },
                    { value: "natural" as KeywordStrength, label: "読みやすさ重視", icon: "📖", hint: "人間が読んで自然な流暢な文章" },
                  ]).map(k => (
                    <button key={k.value} type="button" onClick={() => setKeywordStrength(k.value)}
                      aria-label={`SEOキーワード強度「${k.label}」を選択する（${k.hint}）`}
                      aria-pressed={keywordStrength === k.value}
                      className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors text-left ${keywordStrength === k.value ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:border-green-400"}`}>
                      <span className="mr-1" aria-hidden="true">{k.icon}</span>{k.label}
                      {keywordStrength === k.value && (
                        <span className="block text-xs font-normal text-green-100 mt-0.5">{k.hint}</span>
                      )}
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
                  aria-label="まとめ生成に商品を追加する（最大3商品、有料プランで10商品）"
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
                  + 商品を追加（最大3商品・有料プランで10商品）
                </button>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={loading}
                aria-label={loading ? "商品説明文を生成中です" : isLimitReached ? "有料プランに申し込む" : "商品説明文セットを生成する"}
                aria-busy={loading}
                className={`w-full font-bold py-3 rounded-xl text-white transition-colors ${isLimitReached ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
                {loading
                  ? `生成中... ${progress.current}/${progress.total}商品`
                  : isLimitReached ? "有料プランに申し込む"
                  : mode === "bulk" && products.length > 1
                  ? `${products.filter(p => p.productName && p.features).length}商品をまとめ生成する`
                  : "商品説明文セットを生成する（無料）"}
              </button>
              {/* 3プラットフォーム同時比較ボタン */}
              <button
                type="button"
                onClick={handleMultiGenerate}
                disabled={multiLoading || loading}
                aria-label={multiLoading ? "Amazon・楽天・Yahoo!の3プラットフォームで同時生成中です" : "Amazon・楽天・Yahoo!の3サイトで説明文を同時比較生成する"}
                aria-busy={multiLoading}
                className="w-full font-bold py-2.5 rounded-xl text-indigo-700 bg-indigo-50 border-2 border-indigo-300 hover:bg-indigo-100 disabled:opacity-50 transition-colors text-sm"
              >
                {multiLoading ? "3プラットフォーム同時生成中..." : <><span aria-hidden="true">🔀</span> Amazon・楽天・Yahoo! 3サイト同時比較</>}
              </button>
            </form>
          </div>

          {/* 右：結果エリア */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">生成結果</label>
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  aria-label={showHistory ? "過去の生成履歴を閉じる" : `過去の生成履歴を表示する（${history.length}件）`}
                  aria-expanded={showHistory}
                  className="text-xs text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  <span aria-hidden="true">📋</span> 過去の履歴 ({history.length}件)
                </button>
              )}
            </div>

            {/* 生成履歴パネル */}
            {showHistory && history.length > 0 && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 mb-3">過去の生成結果（最大20件）</p>
                <div className="space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="bg-white border border-blue-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-800 truncate max-w-[160px]">{h.productName || "商品名なし"}</span>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{h.savedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">{h.platform}</span>
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">{h.tone}</span>
                      </div>
                      <button
                        onClick={() => {
                          const parsed = parseResult(h.raw);
                          setResults([{ product: { id: h.id, productName: h.productName, category: "", features: "", price: "" }, parsed, rawText: h.raw }]);
                          setActiveResult(0);
                          setShowHistory(false);
                        }}
                        aria-label={`「${h.productName || "商品名なし"}」の過去の生成結果を再表示する`}
                        className="text-xs text-blue-600 font-bold hover:text-blue-700"
                      >
                        この結果を再表示 →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3プラットフォーム同時比較結果 */}
            {showMultiCompare && multiResults.length > 0 && (
              <MultiPlatformPanel
                results={multiResults}
                onClose={() => setShowMultiCompare(false)}
              />
            )}

            {/* 禁止ワードチェック結果 */}
            {ngWords.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                <p className="text-red-700 font-bold text-sm mb-2">⚠️ 景表法・薬機法 注意ワード検出</p>
                <div className="flex flex-wrap gap-2">
                  {ngWords.map(w => (
                    <span key={w} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{w}</span>
                  ))}
                </div>
                <p className="text-xs text-red-500 mt-2">これらのワードは薬機法・景品表示法に抵触する可能性があります。表現を修正してください。</p>
              </div>
            )}

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-xl min-h-[420px] flex flex-col">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-700 font-semibold" aria-live="polite" aria-atomic="true">
                      {progress.total > 1 ? `商品 ${progress.current} / ${progress.total} を生成中...` : "AIが説明文を生成中..."}
                    </p>
                    {progress.total > 1 && (
                      <div className="mt-1 bg-gray-100 rounded-full h-1.5 w-full">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                {streamingText ? (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{streamingText.slice(-800)}</pre>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-gray-400">タイトル案 → キャッチコピー → 説明文 → SEOキーワード</p>
                  </div>
                )}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {/* 複数商品タブ */}
                {results.length > 1 && (
                  <div className="flex gap-1 flex-wrap">
                    {results.map((r, i) => (
                      <button key={i} onClick={() => setActiveResult(i)}
                        aria-label={`「${r.product.productName || `商品 ${i + 1}`}」の生成結果を表示する`}
                        aria-pressed={activeResult === i}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate max-w-[120px] ${activeResult === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {r.product.productName.slice(0, 12) || `商品 ${i + 1}`}
                      </button>
                    ))}
                    <button onClick={downloadAll} aria-label="全商品の説明文をまとめてテキストファイルでダウンロードする" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      <span aria-hidden="true">⬇</span> まとめてDL
                    </button>
                    <button onClick={downloadCSV} aria-label="説明文をCSV形式でダウンロードする" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                      <span aria-hidden="true">⬇</span> CSV出力
                    </button>
                  </div>
                )}
                {results[activeResult]?.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{results[activeResult].error}</div>
                ) : results[activeResult]?.parsed ? (
                  <>
                    <ResultTabs parsed={results[activeResult].parsed} productName={results[activeResult].product.productName} platform={platform} rawText={results[activeResult].rawText} tone={tone} />
                    <button
                      onClick={handleRegenerate}
                      disabled={loading}
                      aria-label="別のパターンで商品説明文を再生成する"
                      className="mt-2 text-sm text-gray-500 underline hover:text-gray-700 disabled:opacity-40"
                    >
                      <span aria-hidden="true">🔄</span> 別のパターンで再生成
                    </button>
                  </>
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

export default function ECTool() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>}>
      <ECToolInner />
    </Suspense>
  );
}
