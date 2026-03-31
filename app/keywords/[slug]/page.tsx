import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossSell } from "@/components/CrossSell";

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  lastUpdated: string;
}

export const KEYWORDS: Record<string, KeywordData> = {
  "ec-shohin-setsumei-kakikata": {
    title: "EC 商品説明 書き方｜SEO対応の文章をAIが30秒で自動生成",
    h1: "EC 商品説明 書き方",
    description: "ECサイトの商品説明文をAIが30秒で自動生成。SEO対応・購買率UPの文章をコピペで即使用可能。登録不要・無料3回。",
    features: [
      { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "SEOキーワード自動挿入", text: "商品名・カテゴリに合わせたSEOキーワードを自然な形で挿入。検索上位を狙えるEC説明文を自動生成します。" },
      { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: "購買率を上げる表現", text: "「商品の特徴」だけでなく「買うとどう良くなるか（ベネフィット）」を強調した購買促進型の説明文を生成。" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Amazon・楽天・Yahoo形式対応", text: "各ECプラットフォームのフォーマット（タイトル・箇条書き・詳細説明）に合わせた説明文を生成します。" },
    ],
    faqs: [
      { q: "商品説明文でSEOを意識するにはどうすればいいですか？", a: "商品名・素材・用途・ベネフィットを含むキーワードを自然な文体で盛り込むことが重要です。EC説明文生成AIが自動的にSEO最適化された説明文を生成します。" },
      { q: "商品説明文の適切な文字数は？", a: "Amazonは500〜2000字、楽天は1000〜3000字が目安です。EC説明文生成AIでプラットフォーム別に最適な文字数で生成できます。" },
      { q: "無料で何回使えますか？", a: "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "amazon-listing-sakusei": {
    title: "Amazon 商品ページ 作成｜タイトル・箇条書きをAIが自動生成",
    h1: "Amazon 商品ページ 作成",
    description: "AmazonのSEO対応商品タイトル・箇条書き・詳細説明をAIが自動生成。A9アルゴリズムを意識した最適化済み文章を30秒で作成。",
    features: [
      { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", title: "Amazonタイトル最適化", text: "ブランド名・型番・主要キーワードを含む200字以内のAmazon SEO最適化タイトルを自動生成。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "5箇条書きを自動生成", text: "Amazonの商品仕様欄（5箇条書き）を特徴・素材・サイズ・対象・差別化ポイントで構成して自動生成。" },
      { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "A9アルゴリズム対応", text: "Amazonの検索アルゴリズム（A9）が評価する要素をカバーした商品説明で検索順位向上を狙えます。" },
    ],
    faqs: [
      { q: "Amazonの商品タイトルの文字数制限は？", a: "Amazon.co.jpでは商品タイトルは200バイト以内が推奨です。EC説明文生成AIが文字数制限内で最適化されたタイトルを生成します。" },
      { q: "Amazonのキーワード（検索ワード）はどう設定すればいいですか？", a: "商品名・素材・用途・サイズ・対象者などの検索キーワードを盛り込みます。EC説明文生成AIが主要キーワードを自動抽出して説明文に反映します。" },
      { q: "Amazonと楽天で説明文を使い回せますか？", a: "プラットフォームごとにフォーマットや表現が異なるため、個別生成が推奨です。EC説明文生成AIでAmazon・楽天・Yahoo専用の説明文をそれぞれ生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "rakuten-shohin-setsumeibun": {
    title: "楽天 商品説明文 テンプレート｜購買率UPの文章をAIが自動生成",
    h1: "楽天 商品説明文 テンプレート",
    description: "楽天市場の商品説明文テンプレートをAIが自動生成。HTML対応・画像挿入位置付きの購買率UPする説明文を30秒で作成。",
    features: [
      { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", title: "楽天形式で生成", text: "楽天市場のLPスタイル（ヘッダー・特徴・使い方・Q&A・CTA）に合わせた説明文を自動生成。コピペでそのまま使えます。" },
      { icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", title: "レビュー活用表現", text: "「口コミ評価4.8★」「累計10万個販売」などの社会的証明を活用した購買率UPの表現を提案。" },
      { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "楽天SEO対応", text: "楽天市場の検索アルゴリズムに対応したキーワード配置で商品の露出度を高めます。" },
    ],
    faqs: [
      { q: "楽天市場の商品説明文はどのくらいの長さが適切ですか？", a: "楽天市場では1000〜5000文字程度が目安です。商品の複雑さ・競合の説明文量に応じて調整が必要です。EC説明文生成AIで適切な長さの説明文を生成できます。" },
      { q: "楽天のレビューを商品説明に引用してもいいですか？", a: "実際のレビュー文言の引用は著作権上の問題があります。「高評価多数」「リピーター続出」など評価を示す表現を用いましょう。EC説明文生成AIが適切な表現を生成します。" },
      { q: "楽天市場とAmazonで商品説明文は使い回せますか？", a: "楽天はLP型・長文が有効で、AmazonはSEOキーワード重視で方向性が異なります。EC説明文生成AIでプラットフォーム別に最適化した説明文を個別生成することを推奨します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "yahoo-shopping-shohin-kiji": {
    title: "Yahoo ショッピング 商品ページ 作り方｜AIが自動生成",
    h1: "Yahoo ショッピング 商品ページ 作り方",
    description: "Yahoo!ショッピングの商品ページ（タイトル・説明文・キーワード）をAIが自動生成。PayPayモール対応形式で30秒で作成。",
    features: [
      { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Yahoo!SEO対応", text: "Yahoo!ショッピング・PayPayモールの検索アルゴリズムに対応したキーワード設定・説明文を自動生成。" },
      { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "PayPayポイント訴求", text: "PayPayポイント還元・キャンペーンを活用した購買促進表現を商品説明に組み込みます。" },
      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "形式自動チェック", text: "Yahoo!ショッピングの商品登録フォームに合わせた文字数・形式で説明文を生成します。" },
    ],
    faqs: [
      { q: "Yahoo!ショッピングとPayPayモールの違いは？", a: "PayPayモールはYahoo!ショッピングの中でも審査に通った優良ストアが出店できるモールです。EC説明文生成AIでどちらにも対応した商品説明文を生成できます。" },
      { q: "Yahoo!ショッピングで売れる商品説明文の特徴は？", a: "キーワードの自然な盛り込み・ベネフィット訴求・信頼性向上（実績・保証）が重要です。EC説明文生成AIが購買率を高める説明文を自動生成します。" },
      { q: "複数のECサイトに同じ商品を出品する場合、説明文はどうすればいいですか？", a: "プラットフォーム毎にフォーマット・アルゴリズムが異なるため、最適化した説明文を個別に作成することを推奨します。EC説明文生成AIでまとめて生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "cosmetics-shohin-setsumeibun": {
    title: "コスメ 化粧品 商品説明文 例文｜薬機法対応でAIが自動生成",
    h1: "コスメ 化粧品 商品説明文 例文",
    description: "コスメ・化粧品のEC商品説明文を薬機法に準拠した形でAIが自動生成。「治る」「改善する」などNGワードを自動回避。登録不要。",
    features: [
      { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "薬機法NGワード自動回避", text: "「治る・改善・効果」などの医薬品的表現を自動的に「整う・うるおう・なめらか」などの適切な化粧品表現に変換。" },
      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "成分・テクスチャーを訴求", text: "保湿成分・香り・テクスチャー・使用感など美容特有の表現を自動生成。購買欲を高める説明文に仕上げます。" },
      { icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", title: "ターゲット別訴求", text: "「乾燥肌向け」「敏感肌対応」「20代女性向け」などターゲットに合わせた訴求文を生成。" },
    ],
    faqs: [
      { q: "化粧品の商品説明で絶対に使ってはいけない表現は？", a: "「ニキビが治る」「シワが消える」「美白効果がある」などの医薬品的効能を標榜する表現は薬機法違反になります。EC説明文生成AIが自動的にNGワードを回避した説明文を生成します。" },
      { q: "化粧品の「医薬部外品」と「化粧品」で説明文は変える必要がありますか？", a: "医薬部外品は承認された効能効果を記載できます。化粧品は化粧品としての効能の範囲内で記載する必要があります。EC説明文生成AIで区分に応じた説明文を生成します。" },
      { q: "インフルエンサーの口コミをEC説明文に使う際の注意点は？", a: "景表法に基づき「PR・広告」の明示が必要です。また薬機法のNGワードが含まれていないか確認が必要です。EC説明文生成AIで法令準拠の説明文を作成することを推奨します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "food-shohin-setsumeibun": {
    title: "食品 商品説明文 書き方｜食欲をそそる文章をAIが自動生成",
    h1: "食品 商品説明文 書き方",
    description: "食品・飲料・グルメのEC商品説明文をAIが自動生成。食欲をそそる「五感訴求」の表現で購買率UP。食品表示法対応。登録不要。",
    features: [
      { icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "五感訴求の文章", text: "「サクサク・ふわふわ・とろける」など食感、「芳醇な香り・コク深い味わい」など嗅覚・味覚を呼び起こす表現を自動生成。" },
      { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "食品表示法対応", text: "アレルギー表示・原産地・製造方法など食品表示法に必要な情報を盛り込んだ説明文を生成します。" },
      { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "産地・製法ストーリー", text: "産地・生産者・製造方法のストーリーを盛り込み、商品の付加価値と信頼性を高める説明文を生成。" },
    ],
    faqs: [
      { q: "食品のEC説明文で必ず記載すべき事項は何ですか？", a: "食品表示法により名称・原材料名・内容量・賞味期限・保存方法・製造者情報が必要です。アレルギー表示も義務事項です。EC説明文生成AIが必要事項を含む説明文を生成します。" },
      { q: "「健康に良い・ダイエット効果」などの食品への表現は使えますか？", a: "機能性表示食品・特定保健用食品（トクホ）は承認された範囲で記載可能ですが、一般食品での健康効果の標榜は薬機法・健康増進法違反になる可能性があります。適切な表現をAIが提案します。" },
      { q: "ギフト・贈答品の食品説明文はどう書けばいいですか？", a: "「大切な方へ」「特別な日に」などギフトシーンを想起させる表現が効果的です。EC説明文生成AIでギフト用の説明文を生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "fashion-shohin-copy": {
    title: "ファッション 商品 コピーライティング｜スタイル訴求でAIが自動生成",
    h1: "ファッション 商品 コピーライティング",
    description: "ファッション・アパレルのEC商品説明をAIが自動生成。サイズ感・素材感・コーデ提案を盛り込んだスタイル訴求文を30秒で作成。",
    features: [
      { icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z", title: "サイズ感の表現", text: "「ゆったりめ・スリムフィット・オーバーサイズ」など着用感・サイズ感を正確に伝える表現を自動生成。返品率低下に貢献。" },
      { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "コーデ提案付き", text: "「シンプルなデニムと合わせるだけ」など具体的なコーディネート提案を含んだ説明文で購買イメージを高めます。" },
      { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "トレンド訴求", text: "2026年トレンドを反映した表現・スタイル訴求を自動生成。季節感・流行感のある説明文に仕上げます。" },
    ],
    faqs: [
      { q: "アパレルのEC説明文で返品率を下げるにはどうすればいいですか？", a: "サイズ表記（身長・体重での着用感）・素材（厚み・伸縮性）・色合い（実物との差）を詳細に記載することが重要です。EC説明文生成AIが詳細な商品情報を盛り込んだ説明文を生成します。" },
      { q: "ファッションEC説明文に色の表現で気をつけることは？", a: "「ネイビー」より「深みのあるネイビーブルー」など具体的な表現が効果的です。モニターによる色の見え方の差異について注意書きを入れることも推奨です。" },
      { q: "季節を問わないオールシーズン商品の書き方は？", a: "「春秋に活躍」「一年中使えるベーシックアイテム」など年間を通じた使いやすさをアピールする表現が有効です。EC説明文生成AIが最適な訴求文を生成します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "seo-shohin-bun-keyword": {
    title: "SEO 商品説明 キーワード 入れ方｜検索上位を狙うAI生成",
    h1: "SEO 商品説明 キーワード 入れ方",
    description: "EC商品説明文にSEOキーワードを自然に盛り込む方法をAIが実践。検索順位UPを狙える最適化済み商品説明を30秒で自動生成。",
    features: [
      { icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14", title: "キーワード密度の最適化", text: "検索エンジンが評価するキーワード密度（1〜3%）を保ちながら、読みやすい自然な商品説明文を生成します。" },
      { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "ロングテールキーワード対応", text: "「商品名＋素材＋用途＋特徴」を組み合わせたロングテールキーワードで競合が少ない検索クエリを狙います。" },
      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "メタデータも同時生成", text: "商品説明文と同時に、SEO最適化されたメタタイトル・メタディスクリプションも生成します。" },
    ],
    faqs: [
      { q: "EC商品説明でSEO的に最も重要な箇所はどこですか？", a: "商品タイトル・冒頭の200文字・見出し（h2・h3）・alt属性が特に重要です。EC説明文生成AIがこれらを含む形で最適化した商品説明を生成します。" },
      { q: "キーワードを入れすぎると逆効果になりますか？", a: "キーワードの詰め込み（キーワードスタッフィング）は検索エンジンに低品質と判断される場合があります。EC説明文生成AIが自然な密度でキーワードを盛り込みます。" },
      { q: "商品説明のSEO効果はどのくらいで出ますか？", a: "一般的に1〜3ヶ月でインデックスされ、3〜6ヶ月で順位変動が見られることが多いです。品質の高い説明文をEC説明文生成AIで継続的に作成することが重要です。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "shopify-shohin-setsumeibun": {
    title: "Shopify 商品説明 AI 自動生成｜SEO対応のコピーを30秒で作成",
    h1: "Shopify 商品説明 AI 自動生成",
    description: "ShopifyのEC商品説明文をAIが自動生成。SEO対応・購買率UPのコピーライティングを30秒で完成。日本語・英語両対応。登録不要。",
    features: [
      { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Shopify形式で生成", text: "ShopifyのRichTextフォーマットに対応した商品説明（H2・H3・箇条書き・太字）を自動生成します。" },
      { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "海外向け英語説明も対応", text: "越境EC・海外販売向けに英語の商品説明文も生成。日本語と英語を同時に作成できます。" },
      { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "コンバージョン最適化", text: "CTAボタン周辺の訴求文・保証・レビュー表現など、コンバージョン率を高める要素を自動で盛り込みます。" },
    ],
    faqs: [
      { q: "ShopifyのSEO対策で商品説明文はどれくらい重要ですか？", a: "商品説明文はShopifyのSEOにおいて非常に重要です。ユニークなコンテンツ・適切なキーワード・豊富な情報量が検索順位向上に直結します。EC説明文生成AIで最適化した説明文を生成できます。" },
      { q: "ShopifyでAIが生成した商品説明をそのまま使っていいですか？", a: "AIが生成した説明文は品質が高いですが、商品の実際のスペック・価格・在庫情報は必ず確認・修正してください。法令に関わる表記（薬機法・景表法等）は特に慎重に確認を。" },
      { q: "Shopifyで販売する商品のSEOにメタデータは重要ですか？", a: "はい、Shopifyのメタタイトル・メタディスクリプションは検索順位とCTRに直接影響します。EC説明文生成AIで商品説明文と同時にメタデータも生成できます。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "denshi-commerce-product-copy": {
    title: "電子商取引 商品ページ 書き方｜購買率UPのコピーをAIが生成",
    h1: "電子商取引 商品ページ 書き方",
    description: "電子商取引の商品ページ作成にAIを活用。購買率を上げるコピーライティングの基本から実践まで、30秒でプロ品質の商品説明を生成。",
    features: [
      { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: "コンバージョン率UPの構成", text: "AIDA（注意→興味→欲求→行動）の法則に基づいた購買率を最大化する商品ページ構成を自動生成。" },
      { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "信頼性を高める要素", text: "保証・返金ポリシー・実績数値・受賞歴など信頼性を高める要素を盛り込んだ説明文を生成します。" },
      { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "FAQ・Q&A自動生成", text: "商品に関するよくある質問と回答を自動生成。購入前の不安を解消し、購買率を高めます。" },
    ],
    faqs: [
      { q: "電子商取引で商品説明文が購買率に与える影響はどのくらいですか？", a: "商品説明文の質は購買率（CVR）に直接影響します。適切なキーワード・ベネフィット訴求・信頼要素で CVR を2〜5倍に改善できたケースもあります。EC説明文生成AIで最適化した説明文を作成しましょう。" },
      { q: "商品画像と説明文、どちらが重要ですか？", a: "両方が重要で相互補完の関係にあります。画像でビジュアルに訴求し、説明文でキーワード・詳細情報・SEOを担当します。EC説明文生成AIで高品質な説明文を素早く作成できます。" },
      { q: "競合他社と似た商品でも差別化できますか？", a: "製造元・素材・品質基準・サービス（保証・サポート）・ブランドストーリーを軸に差別化訴求が可能です。EC説明文生成AIが競合優位性を強調した説明文を生成します。" },
    ],
    lastUpdated: "2026-03-31",
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

const SITE_URL = "https://ec-description-generator.vercel.app";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const kw = KEYWORDS[params.slug];
  if (!kw) return {};
  return {
    title: kw.title,
    description: kw.description,
    other: { "article:modified_time": kw.lastUpdated },
    openGraph: {
      title: kw.title,
      description: kw.description,
      url: `${SITE_URL}/keywords/${params.slug}`,
      siteName: "EC説明文生成AI｜商品説明文を30秒で自動生成",
      locale: "ja_JP",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: kw.h1 }],
    },
    twitter: { card: "summary_large_image", title: kw.title, description: kw.description, images: ["/og.png"] },
    alternates: { canonical: `${SITE_URL}/keywords/${params.slug}` },
  };
}

function FeatureIcon({ d }: { d: string }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 shrink-0">
      <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </div>
  );
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const kw = KEYWORDS[params.slug];
  if (!kw) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "dateModified": kw.lastUpdated,
    mainEntity: kw.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.10) 0%, transparent 50%), #0B0F1E" }}>
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <p className="text-amber-400 text-sm font-medium tracking-wider mb-4">EC説明文生成AI｜商品説明文を30秒で自動生成</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #FDE68A, #FFFFFF, #FCD34D)" }}>{kw.h1}</h1>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(253,230,138,0.8)" }}>{kw.description}</p>
          <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            無料で商品説明文を生成する
          </Link>
          <p className="text-xs mt-3" style={{ color: "rgba(253,230,138,0.5)" }}>登録不要・クレジットカード不要・無料3回</p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">特長</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {kw.features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                <FeatureIcon d={f.icon} />
                <h3 className="font-bold mt-4 mb-2 text-white/90">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(253,230,138,0.7)" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">よくある質問</h2>
          <div className="space-y-4">
            {kw.faqs.map((f, i) => (
              <details key={i} className="rounded-2xl border border-white/10 backdrop-blur-sm group" style={{ background: "rgba(255,255,255,0.03)" }}>
                <summary className="cursor-pointer px-6 py-4 font-medium text-white/90 flex items-center justify-between list-none">
                  {f.q}
                  <svg className="w-5 h-5 text-amber-400 transition-transform group-open:rotate-180 shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "rgba(253,230,138,0.7)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <div className="rounded-2xl p-8 border border-amber-500/20" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(249,115,22,0.05))" }}>
            <h2 className="text-xl font-bold mb-3 text-white/90">今すぐ商品説明文を生成</h2>
            <p className="text-sm mb-6" style={{ color: "rgba(253,230,138,0.7)" }}>商品名・特徴を入力するだけ。SEO対応・購買率UPの商品説明文を30秒で自動生成します。</p>
            <Link href="/tool" className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              無料でEC説明文生成AIを使う
            </Link>
          </div>
        </section>

        <p className="text-center text-xs text-white/40 mt-8 pb-8">最終更新: 2026年3月31日</p>

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <CrossSell currentService="EC説明文生成AI" />
        </section>
      </main>
    </>
  );
}
