import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://ec-description-generator.vercel.app";
const TITLE = "AI商品説明文ジェネレーター | 楽天・Amazon・Yahoo!・メルカリ対応";
const DESC = "商品名と特徴を入力するだけで4プラットフォーム対応のSEO最適化商品説明文を一括生成。10商品を50分で完成。無料3回試せる。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "AI商品説明文ジェネレーター",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AI商品説明文ジェネレーター" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  metadataBase: new URL(SITE_URL),
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "EC説明文とは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EC説明文（商品説明文）とは、楽天・Amazon・Yahoo!ショッピングなどのECサイトで商品ページに掲載する文章です。商品の特徴・メリット・使用方法などを記述し、検索上位表示と購買転換率（CVR）向上に直結します。"
      }
    },
    {
      "@type": "Question",
      "name": "生成した説明文の著作権はどうなりますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "生成された説明文はご利用者様に帰属し、商用利用（楽天・Amazon等への掲載）も自由に行えます。著作権の問題なくそのまま商品ページへ掲載いただけます。"
      }
    },
    {
      "@type": "Question",
      "name": "楽天とAmazonで説明文の最適な文字数は違いますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、異なります。楽天市場は400〜800字の感情訴求型の長文が効果的です。Amazonは200〜400字の箇条書き・スペック重視が推奨されます。Yahoo!は150〜300字のシンプルな価格訴求型が適しています。このAIは選択したプラットフォームに合わせて自動最適化します。"
      }
    },
    {
      "@type": "Question",
      "name": "景表法・薬機法に違反しないか心配です",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "このAIは生成と同時に景品表示法・薬機法のNGワードを自動チェックします。「最高」「No.1」「治る」「医師も推薦」などの違反表現を検出・警告する機能を標準搭載しています。ただし最終確認は必ずご自身でも行ってください。"
      }
    },
    {
      "@type": "Question",
      "name": "無料で何回使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。それ以上使いたい場合はスタンダードプラン（¥980/月・50件）からご利用いただけます。"
      }
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
