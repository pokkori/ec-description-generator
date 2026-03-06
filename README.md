# AI商品説明文ジェネレーター

> 商品名と特徴を入力するだけで、楽天・Amazon向けのSEO最適化された商品説明文を瞬時に生成するSaaSサービス

**本番URL**: https://ec-description-generator.vercel.app

---

## サービス概要

楽天市場・Amazon出品者向けに、商品説明文をClaude Haiku AIが30秒で自動生成。
SEOキーワード自動抽出・キャッチコピー・詳細説明文・箇条書き特徴が一括出力。

## 料金プラン

| プラン | 価格 | 制限 |
|--------|------|------|
| お試し | 無料 | 3回まで |
| スタンダード | ¥980/月 | 50件/月 |
| ビジネス | ¥2,980/月 | 500件/月 |
| エンタープライズ | ¥9,800/月 | 無制限 |

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **AI**: Anthropic Claude Haiku (claude-haiku-4-5-20251001)
- **デプロイ**: Vercel
- **決済**: Stripe（サブスクリプション）
- **アナリティクス**: Vercel Analytics

## ディレクトリ構成

```
ec-description-generator/
├── app/
│   ├── page.tsx          # LP（ランディングページ）
│   ├── layout.tsx        # レイアウト・メタデータ
│   ├── tool/
│   │   └── page.tsx      # 生成画面（フォーム・結果表示・Paywall）
│   ├── success/
│   │   └── page.tsx      # 決済完了ページ
│   └── api/
│       ├── generate/
│       │   └── route.ts  # Claude API呼び出し・レート制限・Cookie管理
│       └── stripe/
│           ├── checkout/
│           │   └── route.ts  # Stripeセッション作成
│           └── verify/
│               └── route.ts  # 決済完了確認・Cookie付与
├── .env.local            # 環境変数（Vercelに設定済み）
└── package.json
```

## セキュリティ・制限

- **使用制限**: Cookieベースでサーバー側管理（3回まで無料）
- **レート制限**: 1分間10リクエストまで/IP
- **エラーハンドリング**: API障害・タイムアウト対応済み

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `STRIPE_SECRET_KEY` | Stripe シークレットキー |
| `STRIPE_PRICE_STD` | スタンダードプランの Price ID |
| `STRIPE_PRICE_BIZ` | ビジネスプランの Price ID |
| `STRIPE_PRICE_ENT` | エンタープライズプランの Price ID |

## ローカル起動

```bash
npm install
echo "ANTHROPIC_API_KEY=your_key" > .env.local
npm run dev
```

## デプロイ

```bash
npx vercel --prod
```
