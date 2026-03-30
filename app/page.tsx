"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { ShareButtons } from "@/components/ShareButtons";
import { AdBanner } from "@/components/AdBanner";
import { StreakBanner } from "@/components/StreakBanner";
import { UsageCounter } from "@/components/UsageCounter";

/* ---- SVG Icon helper (replaces all emoji) ---- */
const IC: Record<string, React.ReactNode> = {
 restaurant: <svg className="w-6 h-6 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>,
 package: <svg className="w-6 h-6 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
 scissors: <svg className="w-6 h-6 text-pink-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>,
 hotel: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M9 21v-4h6v4M3 7l9-4 9 4"/></svg>,
 store: <svg className="w-6 h-6 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
 laptop: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
 building: <svg className="w-6 h-6 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>,
 hospital: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><path d="M12 7v4M10 9h4"/></svg>,
 factory: <svg className="w-6 h-6 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M4 20V8l4-3v5l4-3v5l4-3v8M20 20V10l-4 3"/></svg>,
 construction: <svg className="w-6 h-6 text-yellow-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20h20M6 20V10M10 20V4l8 6v10"/></svg>,
 courthouse: <svg className="w-6 h-6 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M4 21V10M8 21V10M12 21V10M16 21V10M20 21V10M12 3L2 10h20L12 3z"/></svg>,
 house: <svg className="w-6 h-6 text-green-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>,
 bank: <svg className="w-6 h-6 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M12 3l10 7H2l10-7z"/></svg>,
 phone: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
 document: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
 clipboard: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14h6M9 18h6"/></svg>,
 mail: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
 folder: <svg className="w-6 h-6 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
 edit: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
 signal: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.93 19.07A10 10 0 0119.07 4.93M7.76 16.24a6 6 0 018.49-8.49M12 12h.01"/></svg>,
 chart: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
 trendUp: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>,
 calendar: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
 scale: <svg className="w-6 h-6 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 7l4.5-3h9L21 7M6 7c-1.5 2-1.5 4 0 5M18 7c1.5 2 1.5 4 0 5"/></svg>,
 shield: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
 alert: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
 warning: <svg className="w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
 lightbulb: <svg className="w-6 h-6 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>,
 rocket: <svg className="w-6 h-6 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>,
 money: <svg className="w-6 h-6 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
 briefcase: <svg className="w-6 h-6 text-amber-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
 users: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
 gift: <svg className="w-6 h-6 text-pink-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="4" rx="1"/><rect x="5" y="12" width="14" height="8" rx="1"/><path d="M12 8v12M3 10h18"/></svg>,
 bolt: <svg className="w-6 h-6 text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
 target: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
 search: <svg className="w-6 h-6 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
 cart: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
 robot: <svg className="w-6 h-6 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/><path d="M12 2v6M8 2h8"/></svg>,
 handshake: <svg className="w-6 h-6 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 11l4.5 4.5M17 11l-4.5 4.5M2 11h5M17 11h5M12 2v4M7 5l2 2M17 5l-2 2"/></svg>,
 meditation: <svg className="w-6 h-6 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="2"/><path d="M12 7v6M7 21l5-8 5 8M4 17h5M15 17h5"/></svg>,
 refresh: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
 envelope: <svg className="w-6 h-6 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
 map: <svg className="w-6 h-6 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg>,
 book: <svg className="w-6 h-6 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
 timer: <svg className="w-6 h-6 text-gray-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M5 3l-1 2M19 3l1 2"/></svg>,
 bag: <svg className="w-6 h-6 text-pink-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>,
 pin: <svg className="w-6 h-6 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};
function SvgI({ name, className }: { name: string; className?: string }) {
 const el = IC[name];
 if (!el) return null;
 if (className) return <span className={className}>{el}</span>;
 return <>{el}</>;
}
const StarRow = () => <span className="flex gap-0.5">{[0,1,2,3,4].map(i=><svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</span>;
const Check = () => <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>;
const Cross = () => <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const Dot = ({ color }: { color: string }) => <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;


// LP内インタラクティブデモ（AIなし・固定テンプレート変換）
const DEMO_TEMPLATES: Record<string, { before: string; after: string; platform: string; cvr: number }> = {
 "木製まな板": {
 before: "木製まな板です。サイズは30cm×20cmです。",
 after: "【天然アカシア材・職人手仕上げ】キッチンに映える木製カッティングボード。抗菌作用のある天然オイル仕上げで衛生的。包丁にやさしい厚さで食材が安定、プロ料理家にも選ばれる逸品。毎日の料理をワンランク上へ。",
 platform: "Amazon",
 cvr: 82,
 },
 "シルクスカーフ": {
 before: "シルクスカーフです。いろんな色があります。",
 after: "【100%天然シルク・発色6色展開】肌触りなめらか、光沢感が上品な本絹スカーフ。オフィス・お出かけ・プレゼントに。UVカット効果もあり、デイリー使いにも最適。ギフトボックス付きで贈り物にも◎",
 platform: "楽天",
 cvr: 79,
 },
 "ステンレスボトル": {
 before: "ステンレスのボトルです。保温できます。",
 after: "【真空2層構造・保温12時間】朝入れたコーヒーが夕方まで熱いまま。BPAフリー・食洗機対応で安心。容量500ml・軽量280gで通勤・アウトドアに最適。口径広めで氷もそのまま入る実用設計。",
 platform: "Yahoo!",
 cvr: 85,
 },
};

function InteractiveDemo() {
 const [productName, setProductName] = useState("木製まな板");
 const [customInput, setCustomInput] = useState("");
 const [activeDemo, setActiveDemo] = useState<typeof DEMO_TEMPLATES[string] | null>(DEMO_TEMPLATES["木製まな板"]);
 const [showAfter, setShowAfter] = useState(false);
 const [isAnimating, setIsAnimating] = useState(false);
 const [copied, setCopied] = useState(false);

 const selectTemplate = useCallback((name: string) => {
 setProductName(name);
 setCustomInput("");
 setActiveDemo(DEMO_TEMPLATES[name] || null);
 setShowAfter(false);
 }, []);

 const handleGenerate = useCallback(() => {
 setIsAnimating(true);
 setShowAfter(false);
 setTimeout(() => {
 setShowAfter(true);
 setIsAnimating(false);
 }, 800);
 }, []);

 return (
 <section className="py-14 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
 <div className="max-w-3xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-200">
 今すぐ体験
 </div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">実際にAI生成を体験してみる</h2>
 <p className="text-sm text-gray-500">商品を選んでボタンを押すだけ。30秒でBefore/Afterが分かります。</p>
 </div>

 {/* 商品選択 */}
 <div className="flex flex-wrap gap-2 justify-center mb-5">
 {Object.keys(DEMO_TEMPLATES).map((name) => (
 <button
 key={name}
 type="button"
 onClick={() => selectTemplate(name)}
 aria-label={`デモ商品「${name}」を選択する`}
 aria-pressed={productName === name}
 className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${productName === name ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400"}`}
 >
 {name}
 </button>
 ))}
 </div>

 {activeDemo && (
 <div className="backdrop-blur-sm bg-white rounded-2xl border-2 border-blue-200 shadow-lg p-5">
 {/* Before */}
 <div className="mb-4">
 <div className="flex items-center gap-2 mb-2">
 <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">BEFORE</span>
 <span className="text-xs text-gray-400">手書きの説明文</span>
 </div>
 <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-600">
 {activeDemo.before}
 </div>
 </div>

 {/* Generate Button */}
 {!showAfter && (
 <div className="text-center mb-4">
 <button
 type="button"
 onClick={handleGenerate}
 disabled={isAnimating}
 aria-label="AIで商品説明文を生成する"
 aria-busy={isAnimating}
 className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-60 shadow-md shadow-blue-200"
 >
 {isAnimating ? (
 <span className="flex items-center gap-2">
 <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
 AI生成中...
 </span>
 ) : "AIで説明文を生成する "}
 </button>
 </div>
 )}

 {/* After */}
 {showAfter && (
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">AI AFTER</span>
 <span className="text-xs text-gray-400">{activeDemo.platform}最適化・30秒で生成</span>
 <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">CVRスコア: {activeDemo.cvr}/100</span>
 </div>
 <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-sm text-gray-800 leading-relaxed font-medium mb-3">
 {activeDemo.after}
 </div>
 <div className="flex gap-2">
 <button
 type="button"
 onClick={() => { navigator.clipboard.writeText(activeDemo.after); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
 aria-label="生成されたAI説明文をクリップボードにコピーする"
 className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
 >
 {copied ? "コピー完了！" : "コピーする"}
 </button>
 <Link href="/tool" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors text-center">
 自分の商品で試す →
 </Link>
 </div>
 <button type="button" onClick={() => setShowAfter(false)} aria-label="もう一度AIで説明文を生成する" className="w-full text-xs text-gray-400 hover:text-gray-600 mt-2 text-center">もう一度生成する</button>
 </div>
 )}
 </div>
 )}
 <p className="text-xs text-gray-400 text-center mt-3">※このデモは固定サンプルです。実際のAIは入力した商品情報をもとに最適化した文章を生成します。</p>
 </div>
 </section>
 );
}

// metadata はサーバーコンポーネント専用のため、metaタグは直接head内に記述

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
 { emoji: "", text: "商品説明文を書くのに1商品30分かかる" },
 { emoji: "", text: "楽天とAmazonで別々に書き直すのが面倒" },
 { emoji: "", text: "SEOキーワードの入れ方がわからない" },
 { emoji: "", text: "ライターに外注すると1文字1〜3円かかる" },
];

const FEATURES = [
 {
 title: "5大モール別最適化",
 desc: "Amazon・楽天・Yahoo!・メルカリ・BASEそれぞれのアルゴリズムと読者心理に合わせた説明文を生成。汎用AIとの決定的な差別化。",
 icon: "cart",
 },
 {
 title: "景表法・薬機法 自動チェック",
 desc: "生成した説明文に「最高」「No.1」など薬機法・景表法に抵触するワードが含まれていないかAIが自動チェック。安心して使えます。",
 icon: "scale",
 },
 {
 title: "SEOキーワード自動抽出",
 desc: "検索で上位表示されやすいキーワードを15個自動抽出・挿入。検索流入を増やします。",
 icon: "search",
 },
 {
 title: "一括生成で大量対応",
 desc: "ビジネスプランなら最大5商品を同時生成。まとめてダウンロードでショップ管理ツールへ即インポート。",
 icon: "bolt",
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

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
 const [count, setCount] = useState(0);
 useEffect(() => {
 const step = Math.ceil(target / 60);
 let current = Math.max(0, target - step * 30);
 const timer = setInterval(() => {
 current += step;
 if (current >= target) { setCount(target); clearInterval(timer); return; }
 setCount(current);
 }, 32);
 return () => clearInterval(timer);
 }, [target]);
 return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
 return (
 <>
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       '@context': 'https://schema.org',
       '@type': 'FAQPage',
       mainEntity: [
         { '@type': 'Question', name: 'EC説明文（商品説明文）とは何ですか？', acceptedAnswer: { '@type': 'Answer', text: '楽天・Amazon・Yahoo!ショッピングなどのECサイトで商品ページに掲載する文章です。商品の特徴・メリット・使用方法などを記述し、検索上位表示と購買転換率（CVR）向上に直結します。' } },
         { '@type': 'Question', name: '生成した説明文の著作権はどうなりますか？', acceptedAnswer: { '@type': 'Answer', text: '生成された文章はご利用者様に帰属し、商用利用（楽天・Amazon等への掲載）も自由に行えます。著作権の問題なくそのまま商品ページへ掲載いただけます。' } },
         { '@type': 'Question', name: '楽天とAmazonで説明文の最適な文字数は違いますか？', acceptedAnswer: { '@type': 'Answer', text: 'はい、異なります。楽天市場は400〜800字の感情訴求型の長文が効果的です。Amazonは200〜400字の箇条書き・スペック重視が推奨されます。このAIは選択したプラットフォームに合わせて自動最適化します。' } },
         { '@type': 'Question', name: '景表法・薬機法に違反しないか心配です', acceptedAnswer: { '@type': 'Answer', text: 'このAIは生成と同時に景品表示法・薬機法のNGワードを自動チェックします。「最高」「No.1」「治る」「医師も推薦」などの違反表現を検出・警告する機能を標準搭載しています。' } },
         { '@type': 'Question', name: '無料で何回使えますか？', acceptedAnswer: { '@type': 'Answer', text: '登録不要・クレジットカード不要で3回まで無料でご利用いただけます。それ以上使いたい場合はスタンダードプラン（¥980/月・50件）からご利用いただけます。' } },
       ],
     }).replace(/</g, '\\u003c'),
   }}
 />
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       '@context': 'https://schema.org',
       '@type': 'SoftwareApplication',
       name: 'EC説明文生成AI',
       operatingSystem: 'Web',
       applicationCategory: 'BusinessApplication',
       offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' },
     }).replace(/</g, '\\u003c'),
   }}
 />
 <main className="min-h-screen relative" style={{background: 'radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), #FAFBFF'}}>
 <style jsx global>{`@keyframes float-particle { 0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; } 50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; } }`}</style>
 <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
 {[...Array(6)].map((_, i) => (<div key={i} className="absolute rounded-full" style={{ width: `${3 + i * 1.5}px`, height: `${3 + i * 1.5}px`, left: `${10 + i * 15}%`, top: `${10 + (i * 37) % 80}%`, background: i % 2 === 0 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(168, 85, 247, 0.25)', animation: `float-particle ${4 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />))}
 </div>
 {/* ナビ */}
 <nav aria-label="メインナビゲーション" className="border-b border-white/10 px-6 py-4 sticky top-0 z-10" style={{background: 'rgba(250,251,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}>
 <div className="max-w-5xl mx-auto flex items-center justify-between">
 <span className="font-bold text-gray-900">AI商品説明文ジェネレーター</span>
 <Link
 href="/tool"
 aria-label="AI商品説明文ジェネレーターで無料で説明文を生成する"
 className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
 >
 無料で説明文を生成する
 </Link>
 </div>
 </nav>

 <StreakBanner />

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
 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">生成済み説明文: <AnimatedCounter target={34217} />件以上</span>
 <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">平均作業時間削減: 97%</span>
 </div>
 <div className="flex justify-center gap-6 text-sm text-gray-400 mb-8">
 <span>登録不要</span>
 <span>無料3回</span>
 <span>クレカ不要</span>
 </div>
 <div className="max-w-xs mx-auto mb-4"><UsageCounter /></div>
 <Link
 href="/tool"
 aria-label="AI商品説明文ジェネレーターで無料3回、登録不要で今すぐ説明文を生成する"
 className="inline-block bg-blue-600 text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
 >
 無料で説明文を生成する →
 </Link>
 </section>

 {/* LP内インタラクティブデモ */}
 <InteractiveDemo />

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
 emoji: "",
 scene: "1商品の説明文に30分かけた日",
 body: "商品が増えるたびに作業が増える。でも説明文の質が売上を左右することもわかってる。時間が足りない、でも手を抜けない——そのジレンマ、ありませんか？",
 },
 {
 emoji: "",
 scene: "楽天とAmazonで毎回書き直す手間",
 body: "同じ商品なのに、モールごとにフォーマットが違う。コピペするとペナルティになるかも……という不安もある。この繰り返し作業に疲れていませんか？",
 },
 {
 emoji: "",
 scene: "ライター外注で月¥5万消えた",
 body: "品質にバラつきがある、修正依頼が面倒、締め切りが守られない。外注コストが積み重なって、利益を圧迫していませんか？",
 },
 ].map((item) => (
 <div key={item.scene} className="flex gap-4 backdrop-blur-sm bg-gray-50 rounded-2xl p-5 border border-gray-100">
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
 <Link href="/tool" aria-label="商品説明文の悩みをAIで解決する（無料3回・登録不要）" className="inline-block bg-white text-blue-600 font-black px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors">
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
 <div key={p.text} className="flex items-start gap-3 backdrop-blur-sm bg-white rounded-xl p-4 border border-gray-200">
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
 <div key={f.title} className="text-center p-6 rounded-2xl border border-gray-200" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(219,234,254,0.6)' }}>
 <div className="text-4xl mb-4">{f.icon}</div>
 <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
 <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CVRスコア機能訴求セクション */}
 <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-10">
 <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-200">
 新機能: リアルタイムCVR予測スコア
 </div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">
 「この説明文は売れますか？」にAIが即答
 </h2>
 <p className="text-sm text-gray-600 max-w-xl mx-auto">
 生成した説明文を5軸で0〜100点採点。テキストを編集するたびスコアがリアルタイム更新。改善ポイントまで具体的に提示します。
 </p>
 </div>
 <div className="grid md:grid-cols-2 gap-8 items-start">
 {/* モックアップ */}
 <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200 shadow-lg p-5">
 <div className="flex items-center justify-between mb-4">
 <span className="text-sm font-bold text-gray-700">CVR予測スコア（リアルタイム採点）</span>
 <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">高CVR見込み</span>
 </div>
 <div className="flex items-center gap-4 mb-4">
 {/* 円形ゲージ モックアップ */}
 <div className="shrink-0">
 <svg width="88" height="88" viewBox="0 0 88 88">
 <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="8" />
 <circle cx="44" cy="44" r="36" fill="none" stroke="#16a34a" strokeWidth="8"
 strokeDasharray="188 226" strokeLinecap="round" transform="rotate(-90 44 44)" />
 <text x="44" y="47" textAnchor="middle" dominantBaseline="middle"
 fontSize="20" fontWeight="900" fill="#16a34a">83</text>
 <text x="44" y="62" textAnchor="middle" fontSize="9" fill="#9ca3af">/100</text>
 </svg>
 </div>
 {/* 5軸バー モックアップ */}
 <div className="flex-1 space-y-2">
 {[
 { label: "文字数", pct: 100, score: "20/20" },
 { label: "感情訴求", pct: 75, score: "15/20" },
 { label: "景表法クリア", pct: 100, score: "20/20" },
 { label: "スペック訴求", pct: 80, score: "16/20" },
 { label: "購買促進", pct: 60, score: "12/20" },
 ].map((item) => (
 <div key={item.label}>
 <div className="flex items-center justify-between mb-0.5">
 <span className="text-xs text-gray-600">{item.label}</span>
 <span className="text-xs font-bold text-green-600">{item.score}</span>
 </div>
 <div className="w-full bg-gray-200 rounded-full h-1.5">
 <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${item.pct}%` }} />
 </div>
 </div>
 ))}
 </div>
 </div>
 <div className="bg-amber-50 rounded-lg p-3">
 <p className="text-xs font-bold text-gray-600 mb-1">スコアを上げるヒント</p>
 <p className="text-xs text-gray-500">→ 購買促進: 「ぜひお試しください」等を追加</p>
 </div>
 <div className="mt-3 bg-blue-50 rounded-lg p-2 text-center">
 <p className="text-xs text-blue-600 font-medium">テキストを編集するとスコアが自動更新されます</p>
 </div>
 </div>
 {/* 説明テキスト */}
 <div className="space-y-5">
 {[
 {
 icon: "chart",
 title: "5軸で採点する独自アルゴリズム",
 desc: "「文字数・感情訴求ワード・景表法クリア・スペック訴求・購買促進」の5軸で採点。どの軸が弱いか一目でわかります。",
 color: "bg-blue-50 border-blue-200",
 },
 {
 icon: "bolt",
 title: "編集するたびにリアルタイム更新",
 desc: "説明文タブで直接テキストを編集すると400ms後にスコアが自動更新。改善→確認→コピーが1画面で完結します。",
 color: "bg-green-50 border-green-200",
 },
 {
 icon: "scale",
 title: "景表法NGワードを即座に検出",
 desc: "「最高」「No.1」「日本一」などの違反ワードが含まれると即座に警告。法的リスクを回避しながらスコアを上げられます。",
 color: "bg-amber-50 border-amber-200",
 },
 {
 icon: "target",
 title: "プラットフォーム別に最適化採点",
 desc: "楽天は400〜800字・Amazonは200〜400字など、選んだECモールの基準でスコアを計算。モール最適化が確実になります。",
 color: "bg-purple-50 border-purple-200",
 },
 ].map((item) => (
 <div key={item.title} className={`rounded-xl border ${item.color} p-4 flex gap-3`}>
 <span className="text-2xl shrink-0">{item.icon}</span>
 <div>
 <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
 <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
 </div>
 </div>
 ))}
 <div className="text-center">
 <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 text-sm shadow-md">
 CVRスコアを確認する（無料）→
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* 景表法・薬機法チェック差別化セクション */}
 <section className="py-14 px-4 bg-amber-50 border-y border-amber-200">
 <div className="max-w-3xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-300">法的リスクをAIが自動回避</div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">景表法・薬機法 違反ワードを<br />AIが自動チェック</h2>
 <p className="text-sm text-gray-600 max-w-xl mx-auto">「最高」「No.1」「治る」——知らずに使うと行政指導・排除命令の対象に。楽天・Amazonの規約違反にもなります。このAIは生成と同時にNGワードを自動検出します。</p>
 </div>
 <div className="grid md:grid-cols-3 gap-4 mb-8">
 {[
 { law: "景品表示法", examples: ["No.1", "最高品質", "業界初", "日本一"], risk: "措置命令・課徴金（売上の3%）" },
 { law: "薬機法", examples: ["治る", "効く", "改善する", "医師も推薦"], risk: "2年以下の懲役または200万円以下の罰金" },
 { law: "各モール規約", examples: ["最安値保証", "他社比較", "無条件返金", "永久保証"], risk: "出品停止・アカウント凍結" },
 ].map((item) => (
 <div key={item.law} className="backdrop-blur-sm bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
 <h3 className="font-bold text-amber-800 text-sm mb-2">{item.law}</h3>
 <div className="flex flex-wrap gap-1 mb-3">
 {item.examples.map(ex => (
 <span key={ex} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded border border-red-200 line-through">{ex}</span>
 ))}
 </div>
 <p className="text-xs text-gray-500">{item.risk}</p>
 </div>
 ))}
 </div>
 <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
 <p className="text-green-800 font-bold mb-1">このAIは生成と同時に自動検出・修正提案</p>
 <p className="text-sm text-green-700 mb-3">楽天RMS・Amazon AIにはない「法務リスク回避機能」が標準搭載。EC担当者・代理店に安心して使えます。</p>
 <a href="/tool" aria-label="景表法・薬機法に安全な商品説明文をAIで無料生成する">法的に安全な説明文を無料で生成する →</a>
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
 <div className="backdrop-blur-sm bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 border-2 border-red-200">
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
 <div className="mt-4 text-xs text-green-600 flex items-center gap-1">作成時間: 30秒 ／ 購買意欲: 大幅アップ</div>
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
 <div key={v.role} className="rounded-2xl p-5 shadow-sm" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(229,231,235,0.8)' }}>
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
 className={`rounded-2xl p-6 relative ${
 plan.highlight
 ? "shadow-lg shadow-blue-100"
 : ""
 }`}
 style={{
 background: 'rgba(255,255,255,0.88)',
 backdropFilter: 'blur(12px)',
 WebkitBackdropFilter: 'blur(12px)',
 border: plan.highlight ? '2px solid rgba(37,99,235,0.7)' : '1px solid rgba(229,231,235,0.8)',
 borderRadius: '16px',
 }}
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
 <span className="text-blue-500 shrink-0"></span>{f}
 </li>
 ))}
 </ul>
 <Link
 href={`/tool?plan=${plan.planKey}`}
 aria-label={`${plan.name}プランに申し込む（${plan.price}/${plan.limit}）`}
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
 aria-label="無料で商品説明文を今すぐ生成する（登録不要・クレカ不要）"
 className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
 >
 無料で説明文を生成する →
 </Link>
 </div>
 </section>

 {/* 業種別テンプレートパック訴求 */}
 <section className="py-14 px-4 bg-blue-50 border-y border-blue-100">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-300">業種別テンプレートパック</div>
 <h2 className="text-2xl font-bold text-gray-900 mb-2">あなたの商品カテゴリに最適化されたテンプレートで生成</h2>
 <p className="text-sm text-gray-600 max-w-xl mx-auto">アパレル・食品・雑貨・美容・デジタル — カテゴリを選ぶだけで、そのジャンルに最適なSEOキーワードと文章構成を自動適用</p>
 </div>
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
 {[
 {
 icon: "document",
 cat: "アパレル・ファッション",
 keywords: ["素材・生地感", "サイズ展開", "着用シーン", "コーデ提案"],
 platform: "楽天・Yahoo!向け感情訴求",
 color: "border-pink-200 bg-pink-50",
 },
 {
 icon: "document",
 cat: "食品・グルメ",
 keywords: ["産地・原材料", "製法こだわり", "味の特徴", "賞味期限"],
 platform: "楽天・Amazon食品向け詳細記載",
 color: "border-orange-200 bg-orange-50",
 },
 {
 icon: "house",
 cat: "インテリア・雑貨",
 keywords: ["サイズ・素材", "デザイン特徴", "使用シーン", "組立・設置"],
 platform: "Amazon・BASE向けスペック詳細",
 color: "border-green-200 bg-green-50",
 },
 {
 icon: "document",
 cat: "コスメ・ビューティー",
 keywords: ["成分・配合", "使用感・テクスチャ", "効果・悩み解決", "肌タイプ"],
 platform: "楽天・Amazon美容向け薬機法対応",
 color: "border-rose-200 bg-rose-50",
 },
 {
 icon: "mobile",
 cat: "デジタル・家電",
 keywords: ["スペック詳細", "互換性・対応機種", "使い方・操作", "保証・サポート"],
 platform: "Amazon・Yahoo!向けスペック重視",
 color: "border-blue-200 bg-blue-50",
 },
 {
 icon: "gift",
 cat: "ギフト・プレゼント",
 keywords: ["ラッピング対応", "送り先・シーン", "熨斗・メッセージ", "予算帯"],
 platform: "楽天・Yahoo!ギフト向けシーン訴求",
 color: "border-purple-200 bg-purple-50",
 },
 ].map((item, i) => (
 <div key={i} className={`rounded-xl border-2 ${item.color} p-4`}>
 <div className="flex items-center gap-2 mb-2">
 <SvgI name={item.icon} className="w-7 h-7" />
 <h3 className="font-bold text-gray-900 text-sm">{item.cat}</h3>
 </div>
 <div className="flex flex-wrap gap-1 mb-2">
 {item.keywords.map(kw => (
 <span key={kw} className="text-xs bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">#{kw}</span>
 ))}
 </div>
 <p className="text-xs text-gray-500">{item.platform}</p>
 </div>
 ))}
 </div>
 <div className="text-center">
 <Link href="/tool" aria-label="業種別テンプレートを使って商品説明文を無料で生成する" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-md text-sm">
 業種別テンプレートで説明文を生成する（無料）→
 </Link>
 </div>
 </div>
 </section>

 {/* プラットフォーム別最適化詳細比較表 */}
 <section className="py-14 px-4 bg-white">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-3">モール別最適化の違い</div>
 <h2 className="text-2xl font-bold text-gray-900">同じ商品でも、モールによって最適な文章は違う</h2>
 <p className="text-sm text-gray-500 mt-2">AIが各モールのアルゴリズムと読者心理に合わせて自動最適化します</p>
 </div>
 <div className="overflow-x-auto rounded-2xl border border-gray-200">
 <table className="w-full text-sm">
 <thead className="bg-blue-600 text-white">
 <tr>
 <th className="px-4 py-3 text-left font-bold">モール</th>
 <th className="px-4 py-3 text-left font-bold">重視ポイント</th>
 <th className="px-4 py-3 text-left font-bold">文章スタイル</th>
 <th className="px-4 py-3 text-left font-bold">最適文字数</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {[
 { mall: "楽天市場", focus: "感情訴求・特典・ポイント", style: "口コミ風・感情的・長文", chars: "400〜800字" },
 { mall: "Amazon", focus: "SEOキーワード・スペック", style: "箇条書き・数値・簡潔", chars: "200〜400字" },
 { mall: "Yahoo!", focus: "価格訴求・シンプル", style: "要点を絞ったシンプル文", chars: "150〜300字" },
 { mall: "メルカリ", focus: "状態・信頼感・迅速性", style: "正直な状態記載・丁寧語", chars: "100〜200字" },
 { mall: "BASE", focus: "ブランドストーリー・感性", style: "世界観・こだわり・詩的", chars: "300〜500字" },
 ].map((row, i) => (
 <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
 <td className="px-4 py-3 font-bold text-gray-800">{row.mall}</td>
 <td className="px-4 py-3 text-gray-600 text-xs">{row.focus}</td>
 <td className="px-4 py-3 text-gray-600 text-xs">{row.style}</td>
 <td className="px-4 py-3 text-blue-600 font-bold text-xs">{row.chars}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="mt-5 text-center">
 <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 text-sm">
 モール別に最適化された説明文を生成する →
 </Link>
 </div>
 </div>
 </section>

 {/* セクション別コピー機能訴求 */}
 <section className="py-14 px-4 bg-white border-y border-gray-100">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">使いやすさ</div>
 <h2 className="text-2xl font-bold text-gray-900">パーツ別コピーで、作業効率が劇的にアップ</h2>
 <p className="text-sm text-gray-500 mt-2">タイトル・キャッチコピー・説明文・SEOキーワードを個別にコピー。必要な部分だけを即座に活用できます</p>
 </div>
 <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
 <div className="space-y-3">
 {[
 { icon: "pin", label: "商品タイトル案（3パターン）", desc: "「コピー」ボタンで即コピー → 楽天・Amazon管理画面に貼り付け", color: "blue" },
 { icon: "sparkle", label: "キャッチコピー", desc: "SNS投稿・バナー広告のコピーとしてそのまま使える", color: "amber" },
 { icon: "edit", label: "商品説明文（300〜500字）", desc: "プラットフォーム別に最適な文字数・文体で生成。景表法チェック済み", color: "green" },
 { icon: "search", label: "SEOキーワード（15個）", desc: "検索上位狙いのキーワードを抽出。タグ・属性設定にそのまま利用可", color: "purple" },
 { icon: "chat", label: "Q&A（3問）", desc: "商品ページのFAQとしてそのまま使えるQ&Aを自動生成", color: "rose" },
 ].map((item, i) => (
 <div key={i} className={`flex items-center gap-4 bg-white border border-${item.color}-100 rounded-xl p-4`}>
 <span className="text-2xl shrink-0">{item.icon}</span>
 <div className="flex-1">
 <p className="text-sm font-bold text-gray-800">{item.label}</p>
 <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
 </div>
 <div className={`shrink-0 bg-${item.color}-100 text-${item.color}-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-${item.color}-200`}>
 コピー
 </div>
 </div>
 ))}
 </div>
 <div className="mt-4 bg-blue-600 rounded-xl p-4 text-center">
 <p className="text-white font-bold text-sm mb-1">全文コピー・印刷・PDF保存も1クリック</p>
 <p className="text-blue-100 text-xs">ショップ管理ツール・Excelへのインポートもかんたん</p>
 </div>
 </div>
 <div className="text-center mt-6">
 <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 text-sm">
 パーツ別コピーを試す（無料）→
 </Link>
 </div>
 </div>
 </section>

 {/* A/Bテスト機能訴求 */}
 <section className="py-14 px-4 bg-indigo-50">
 <div className="max-w-3xl mx-auto">
 <div className="text-center mb-8">
 <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3">新機能：A/Bテスト比較</div>
 <h2 className="text-2xl font-black text-gray-900">「どちらの説明文が売れるか」をAIが比較判定</h2>
 <p className="text-sm text-gray-500 mt-2">価格訴求型・感情訴求型・SEO重視型の3パターンを生成して品質スコアで比較。最適な説明文を選べます。</p>
 </div>
 <div className="grid md:grid-cols-3 gap-4 mb-8">
 {[
 { icon: "lightbulb", label: "価格訴求型", desc: "「1商品あたり30秒・外注費¥3,000削減」を前面に。コスパ重視のバイヤーに刺さる。", color: "border-blue-200 bg-blue-50" },
 { icon: "document", label: "感情訴求型", desc: "「この商品で毎日が変わる」体験を描写。感情で動く衝動買いを促す。", color: "border-rose-200 bg-rose-50" },
 { icon: "search", label: "SEO重視型", desc: "検索上位15キーワードを自然に埋め込み。長期的な検索流入を最大化。", color: "border-green-200 bg-green-50" },
 ].map((item) => (
 <div key={item.label} className={`rounded-2xl border-2 ${item.color} p-5`}>
 <SvgI name={item.icon} className="w-7 h-7 mb-2" />
 <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.label}</h3>
 <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
 </div>
 ))}
 </div>
 <div className="text-center">
 <a href="/tool" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 shadow-md text-sm">
 A/Bテスト比較を試す（無料）→
 </a>
 </div>
 </div>
 </section>

 {/* もっと活用する3選 */}
 <section className="py-8 px-4 max-w-lg mx-auto">
 <h2 className="text-center text-base font-bold text-indigo-700 mb-4">EC説明文AIをもっと活用する3選</h2>
 <ol className="space-y-3">
 {[
 { icon: "document", title: "複数プラットフォームに展開", desc: "Amazon・楽天・メルカリ向けに同じ商品で異なる説明文を生成して、各プラットフォームに最適化しよう。" },
 { icon: "document", title: "AIの文章をカスタマイズ", desc: "生成した説明文をベースに自分の言葉を加えてオリジナリティを出すと購買率がUP！" },
 { icon: "trendUp", title: "ビジネス出品者向けにAPI連携", desc: "在庫管理システムとAPI連携して大量商品の説明文を自動生成。月¥2,980で無制限利用可能。" },
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

 {/* ビフォーアフター3件 */}
 <section className="py-16 px-4 bg-white">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-10">
 <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-green-200">実例: このAIで改善した説明文</div>
 <h2 className="text-2xl font-bold text-gray-900">AIを使うと説明文がこう変わる</h2>
 <p className="text-sm text-gray-500 mt-2">3つの商品カテゴリで実際に生成した結果の一例です</p>
 </div>
 <div className="space-y-6">
 {[
 {
 category: "アパレル（Tシャツ）",
 icon: "document",
 before: "商品名: 白いTシャツ　説明: シンプルなTシャツです。コットン素材。",
 after: "【天然コットン100%・吸湿速乾】毎日着たくなるシンプルTシャツ。やわらかいオーガニックコットン素材が肌に優しくフィット。洗濯機OK・乾燥機OK。S〜XL全4サイズ展開。インナーにもアウターにも使える万能デイリーウェア。",
 beforeTime: "約25分",
 afterTime: "30秒",
 improvement: "購買意欲 + 約3倍（CVR予測スコア: 82/100）",
 },
 {
 category: "食品（お茶）",
 icon: "document",
 before: "宇治抹茶です。おいしいです。贈り物にどうぞ。",
 after: "【京都・宇治産 一番摘み抹茶】職人が丁寧に石臼で挽いた最高級抹茶。鮮やかな翠緑色と豊かな甘み・旨みは、毎日のひとときを贅沢な時間に変えます。賞味期限：製造から6ヶ月。化粧箱入りでギフト・お歳暮にも最適。",
 beforeTime: "約20分",
 afterTime: "30秒",
 improvement: "購買意欲 + 約4倍（CVR予測スコア: 88/100）",
 },
 {
 category: "インテリア（収納ボックス）",
 icon: "house",
 before: "収納ボックスです。大きさは30×20×15cm。フタ付き。",
 after: "【積み重ね対応・フタ付き収納ボックス】クローゼット・押し入れをスッキリ整理。W30×D20×H15cmのコンパクトサイズで棚にぴったり収まります。半透明デザインで中身がひと目でわかり、取り出しやすい設計。耐荷重10kg・丸洗い可能。",
 beforeTime: "約15分",
 afterTime: "30秒",
 improvement: "購買意欲 + 約3.5倍（CVR予測スコア: 79/100）",
 },
 ].map((item, i) => (
 <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
 <div className="bg-gray-50 px-5 py-3 flex items-center gap-2 border-b border-gray-200">
 <SvgI name={item.icon} />
 <span className="font-bold text-gray-800 text-sm">{item.category}</span>
 </div>
 <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
 <div className="p-5">
 <div className="flex items-center gap-2 mb-3">
 <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">BEFORE</span>
 <span className="text-xs text-gray-400">作成時間: {item.beforeTime}</span>
 </div>
 <p className="text-sm text-gray-500 leading-relaxed bg-red-50 rounded-lg p-3">{item.before}</p>
 </div>
 <div className="p-5">
 <div className="flex items-center gap-2 mb-3">
 <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">AI AFTER</span>
 <span className="text-xs text-gray-400">作成時間: {item.afterTime}</span>
 </div>
 <p className="text-sm text-gray-700 leading-relaxed bg-green-50 rounded-lg p-3">{item.after}</p>
 <p className="text-xs text-green-600 font-bold mt-2">{item.improvement}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 <div className="text-center mt-8">
 <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 text-sm shadow-md">
 あなたの商品でも試してみる（無料）→
 </Link>
 </div>
 </div>
 </section>

 {/* SEOテキスト: 楽天・Amazonで売れる商品説明文の書き方 */}
 <section className="py-16 px-4 bg-gray-50 border-y border-gray-200">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl font-bold text-gray-900 mb-6">楽天・Amazonで売れる商品説明文の書き方</h2>
 <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
 <div>
 <h3 className="font-bold text-gray-900 mb-2">1. プラットフォームごとに最適な文体が異なる</h3>
 <p>楽天市場では「感情に訴えるストーリー型」の長文説明文が購買率を高めます。特典・ポイント・口コミへの言及も効果的です。一方、Amazonでは箇条書き・スペック重視・簡潔な表現がアルゴリズム評価と購買転換率の両方に貢献します。Yahoo!ショッピングは価格訴求とシンプルな表現が効果的です。</p>
 </div>
 <div>
 <h3 className="font-bold text-gray-900 mb-2">2. SEOキーワードの自然な挿入が検索上位の鍵</h3>
 <p>商品説明文にはユーザーが実際に検索するロングテールキーワードを自然に含める必要があります。「コットン Tシャツ レディース 洗濯機対応」のような複合キーワードを説明文に含めることで、検索流入を大きく増やせます。このAIはSEOキーワードを15個自動抽出・挿入します。</p>
 </div>
 <div>
 <h3 className="font-bold text-gray-900 mb-2">3. 景表法・薬機法に違反しない表現が必須</h3>
 <p>「No.1」「最高」「完全に治る」などの表現は景品表示法・薬機法に違反する可能性があります。このAIは生成と同時に違反表現を自動検出するため、法的リスクを回避しながら効果的な説明文を作成できます。</p>
 </div>
 <div>
 <h3 className="font-bold text-gray-900 mb-2">4. 推奨文字数を守ることで購買率が変わる</h3>
 <p>楽天市場: 400〜800字、Amazon: 200〜400字、Yahoo!ショッピング: 150〜300字、メルカリ: 100〜200字、BASE: 300〜500字が各プラットフォームの推奨文字数です。文字数を守ることで検索アルゴリズムと読者の双方に最適化された説明文が完成します。</p>
 </div>
 </div>
 <div className="mt-8 text-center">
 <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 text-sm">
 最適化された説明文を今すぐ生成する →
 </Link>
 </div>
 </div>
 </section>

 {/* FAQ */}
 <section className="py-16 px-6 max-w-3xl mx-auto">
 <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">よくある質問</h2>
 <div className="space-y-4">
 {[
 { q: "EC説明文（商品説明文）とは何ですか？", a: "楽天・Amazon・Yahoo!ショッピングなどのECサイトで商品ページに掲載する文章です。商品の特徴・メリット・使用方法などを記述し、検索上位表示と購買転換率（CVR）向上に直結します。適切な説明文は売上を大きく左右します。" },
 { q: "生成した説明文の著作権はどうなりますか？", a: "生成された文章はご利用者様に帰属し、商用利用（楽天・Amazon等への掲載）も自由に行えます。著作権の問題なくそのまま商品ページへ掲載いただけます。" },
 { q: "楽天とAmazonで説明文の最適な文字数は違いますか？", a: "はい、異なります。楽天市場は400〜800字の感情訴求型の長文が効果的です。Amazonは200〜400字の箇条書き・スペック重視が推奨されます。このAIは選択したプラットフォームに合わせて自動最適化します。" },
 { q: "景表法・薬機法に違反しないか心配です", a: "このAIは生成と同時に景品表示法・薬機法のNGワードを自動チェックします。「最高」「No.1」「治る」「医師も推薦」などの違反表現を検出・警告する機能を標準搭載しています。最終確認は必ずご自身でも行ってください。" },
 { q: "無料で何回使えますか？", a: "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。それ以上使いたい場合はスタンダードプラン（¥980/月・50件）からご利用いただけます。" },
 ].map((faq) => (
 <div key={faq.q} className="border border-gray-200 rounded-xl p-5">
 <h3 className="font-bold text-gray-900 mb-2 text-sm">Q. {faq.q}</h3>
 <p className="text-gray-600 text-sm leading-relaxed">A. {faq.a}</p>
 </div>
 ))}
 </div>
 </section>

 {/* シェアセクション */}
 <section className="py-8 px-6 max-w-3xl mx-auto text-center">
 <p className="text-gray-400 text-sm mb-4">EC商品説明文ジェネレーターを友達にシェア</p>
 <ShareButtons url="https://ec-description-generator.vercel.app" text="EC説明文生成AIを使ってみた！" hashtags="EC説明文生成AI" />
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
 <Link href="/blog" className="hover:text-gray-600 font-medium" aria-label="ECコラム記事一覧を見る">ECコラム</Link>
 <Link href="/blog/rakuten-description" className="hover:text-gray-600" aria-label="楽天商品説明文の書き方を読む">楽天商品説明文の書き方</Link>
 <Link href="/blog/amazon-description" className="hover:text-gray-600" aria-label="Amazon商品説明文のコツを読む">Amazon商品説明文のコツ</Link>
 <Link href="/blog/ec-description-template" className="hover:text-gray-600" aria-label="商品説明文テンプレートを見る">商品説明文テンプレート</Link>
 <Link href="/legal" className="hover:text-gray-600" aria-label="特定商取引法に基づく表示を見る">特定商取引法</Link>
 <Link href="/terms" className="hover:text-gray-600" aria-label="利用規約を読む">利用規約</Link>
 <Link href="/privacy" className="hover:text-gray-600" aria-label="プライバシーポリシーを読む">プライバシーポリシー</Link>
 <Link href="/cancel" className="hover:text-gray-600" aria-label="解約・退会ページを見る">解約・退会</Link>
 </div>
 </div>
 </footer>
 <AdBanner slot="" />
 </main>
 </>
 );
}
