import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "商品説明文テンプレート集｜楽天・Amazon・ジャンル別にコピペで使える",
  description:
    "すぐに使える商品説明文テンプレートを楽天・Amazon・ジャンル別に紹介。コピペして編集するだけで売れる商品説明文が完成します。",
};

const TEMPLATES = [
  {
    category: "楽天市場 汎用テンプレート",
    content: `【○○をお探しの方へ】

△△で悩んでいませんか？

この商品は〇〇のために作られました。

■ こんな方におすすめ
・〜な方
・〜な方
・〜な方

■ 商品の特徴
【特徴1】〇〇
〜〜〜〜〜〜〜

【特徴2】〇〇
〜〜〜〜〜〜〜

【特徴3】〇〇
〜〜〜〜〜〜〜

■ 商品仕様
サイズ：
素材：
重量：
カラー：

■ よくある質問
Q. 〇〇できますか？
A. はい/いいえ、〜〜〜。`,
  },
  {
    category: "Amazon 商品の特徴（箇条書き）テンプレート",
    content: `【最大のセールスポイント】〇〇で△△を実現。〜〜〜〜〜〜（使用シーン・ベネフィット）

【スペック・仕様】サイズ：/重量：/素材：/対応：〜〜〜（具体的な数値で信頼性UP）

【こんな方に】〜〜〜な方、〜〜〜を探していた方に最適。（ターゲットを明示）

【安全・品質】〇〇認証取得済み/〇〇素材使用/〇〇検査済み（安心感を訴求）

【保証・サポート】〇〇日間返品保証/〇〇年保証付き/日本語サポート対応（購入不安を解消）`,
  },
  {
    category: "食品・飲料向けテンプレート",
    content: `【こだわりの〇〇】

産地：〇〇県〇〇産
製法：〜〜〜〜〜〜

■ 味・風味の特徴
〜〜〜〜〜〜〜〜〜
〜〜〜〜〜〜〜〜〜

■ おすすめの食べ方・使い方
・〜〜〜
・〜〜〜
・〜〜〜

■ 原材料・アレルギー
原材料：〜〜〜
アレルギー：〜〜〜
内容量：〇〇g
賞味期限：製造から〇ヶ月

■ 保存方法
〜〜〜`,
  },
  {
    category: "アパレル・ファッション向けテンプレート",
    content: `【〇〇スタイルに合う△△】

■ デザインの特徴
〜〜〜〜〜〜〜〜〜

■ 素材・着心地
素材：〜〜〜
〜〜〜〜〜〜〜〜〜

■ サイズガイド
S：身長〇〇〜〇〇cm / 体重〇〇〜〇〇kg
M：身長〇〇〜〇〇cm / 体重〇〇〜〇〇kg
L：身長〇〇〜〇〇cm / 体重〇〇〜〇〇kg

※ モデル身長：〇〇cm　着用サイズ：〇

■ 洗濯・お手入れ
〜〜〜
〜〜〜`,
  },
];

export default function TemplatePage() {
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
        <div className="text-xs text-blue-600 font-medium mb-3">テンプレート集</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          商品説明文テンプレート集｜楽天・Amazon・ジャンル別にコピペで使える
        </h1>
        <p className="text-gray-500 text-sm mb-8">更新日: 2026年3月</p>

        <p className="text-gray-700 leading-relaxed mb-10">
          コピペして〇〇部分を埋めるだけで使えるテンプレートをジャンル別にまとめました。
          ただし、より効果的な商品説明文を作りたい場合は、AIを使った自動生成がおすすめです。
        </p>

        <div className="space-y-8">
          {TEMPLATES.map((t) => (
            <section key={t.category}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t.category}</h2>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
                {t.content}
              </pre>
            </section>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-2">
            テンプレートへの入力もAIに任せませんか？
          </p>
          <p className="text-sm text-gray-500 mb-4">
            商品名と特徴を入力するだけで、テンプレートを自動で埋めた説明文を30秒で生成します。
          </p>
          <Link
            href="/tool"
            className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            無料で試す（3回まで無料）
          </Link>
        </div>
      </article>
    </main>
  );
}
