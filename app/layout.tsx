import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

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
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "AI商品説明文ジェネレーター" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  metadataBase: new URL(SITE_URL),
  other: { "theme-color": "#0F0F1A" },
};

const APP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI商品説明文ジェネレーター",
  "description": DESC,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": SITE_URL,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "無料3回・スタンダード¥980/月" },
  "inLanguage": "ja",
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
    },
    {
      "@type": "Question",
      "name": "競合他社の商品説明文と差別化するにはどうすればいいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "競合差別化には、(1)独自のベネフィット（なぜこの商品が選ばれるか）を冒頭に明記、(2)数字・データを活用（「3年連続リピート率90%」等）、(3)購買者のターゲット像を絞り込んだ語りかけが効果的です。本AIは商品情報と競合ポイントを入力することで差別化訴求文を自動生成します。"
      }
    },
    {
      "@type": "Question",
      "name": "複数商品を一括生成できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "スタンダードプラン（¥980/月・50件）以上でCSV一括インポートに対応しています。商品名・特徴・ターゲットを列挙したCSVをアップロードするだけで、複数商品の説明文を自動生成・一括ダウンロードできます。50商品の作業が1時間から約10分に短縮されます。"
      }
    },
    {
      "@type": "Question",
      "name": "SEO対策済みの説明文が生成されますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい。楽天・Amazon・Yahoo!の各プラットフォームの検索アルゴリズムを考慮した、キーワード配置・見出し構成・文字数に最適化した説明文を生成します。商品名に関連する検索ボリュームの高いキーワードを自然な形で組み込みます。"
      }
    },
    {
      "@type": "Question",
      "name": "メルカリ・ラクマなどのフリマアプリにも対応していますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい。メルカリ・ラクマ・PayPayフリマなどのCtoC向け説明文にも対応しています。フリマアプリは個人出品者向けに「手作り感・親しみやすさ」を意識したトーンで生成します。"
      }
    },
    {
      "@type": "Question",
      "name": "食品・化粧品・医療機器など規制が厳しいカテゴリにも対応していますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい。食品表示法・薬機法・景品表示法の規制を考慮した生成モードに対応しています。「効果・効能の断定表現」「比較広告のルール」「健康食品の機能性表示」などのリスク判定も行います。ただし最終的な法令確認は専門家にご依頼ください。"
      }
    },
    {
      "@type": "Question",
      "name": "生成した説明文の品質を上げるコツはありますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "入力情報が詳しいほど品質が上がります。(1)ターゲット購買者像（年齢・性別・悩み）、(2)他社比較での優位点、(3)使用シーン・Before/Afterの具体例、(4)数字・スペック（重さ・サイズ・成分濃度等）を入力することで、コンバージョン率が高い説明文が生成されます。"
      }
    },
    {
      "@type": "Question",
      "name": "英語・中国語など多言語対応はありますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "現時点では日本語のみ対応しています。英語・中国語対応は今後のアップデートで対応予定です。越境EC（Amazon.com・Tmall等）向けの多言語生成機能はビジネスプランでの提供を検討中です。"
      }
    },
    {
      "@type": "Question",
      "name": "生成結果をそのままコピー・ペーストしていいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、生成結果はそのまま各プラットフォームの商品管理画面に貼り付けてご利用いただけます。ただし、商品情報の正確性・薬機法・景表法への適合は最終的にご自身でご確認ください。特に医薬品・健康食品・化粧品は専門家確認を推奨します。"
      }
    },
    {
      "@type": "Question",
      "name": "AIが生成した説明文はGoogleのスパム判定を受けますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "本AIは自然な日本語で商品の実情を正確に伝える説明文を生成するため、スパム判定リスクは低いです。Googleは「ユーザーへの価値提供」を重視しており、商品の特徴や使用感を正確に伝える説明文はむしろSEO評価が向上します。キーワードを不自然に詰め込む「キーワードスタッフィング」は行いません。"
      }
    },
    {
      "@type": "Question",
      "name": "1商品あたりの生成にかかる時間はどのくらいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "通常10〜30秒で1商品の説明文が生成されます。4プラットフォーム（楽天・Amazon・Yahoo!・メルカリ）分を同時生成するため、手書きの場合と比較して約90%の作業時間を削減できます。"
      }
    },
    {
      "@type": "Question",
      "name": "解約はいつでもできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "マイページから次回更新日前にいつでも解約できます。解約後も当月末まで全機能をご利用いただけます。違約金・解約手数料は一切かかりません。"
      }
    },
    {
      "@type": "Question",
      "name": "請求書・領収書の発行はできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい。マイページの「請求管理」から電子領収書のPDFをダウンロードいただけます。法人のお客様向けに請求書払いにも対応しています（ビジネスプランのみ）。"
      }
    },
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`dark ${inter.variable} ${notoSansJP.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
        />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
        <InstallPrompt />
        <Analytics />
        <SpeedInsights />
        <GoogleAdScript />
        {process.env.NEXT_PUBLIC_CLARITY_ID && process.env.NODE_ENV === 'production' && (
          <Script
            id="clarity-init"
            strategy="afterInteractive"
          >
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
