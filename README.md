# チケラーくんが行く！

アメリカの日本人向け治験(健康な方向けの謝礼つき治験)を、公式サイト・Instagramから
AIが集約し、リアルタイムで一覧表示するサイトです。Next.js + Supabase + Cloudflare Pages
の構成で作られています。

このプロジェクトは、チャットでの設計をもとに Claude が下書きしたコードです。
**このチャットの環境にはインターネット接続がなく、`npm install` や動作確認ができていません。**
お手元の環境(またはClaude Code)で以下の手順を実行してください。

## 1. Supabaseプロジェクトを作る

1. https://supabase.com でアカウント作成、新規プロジェクトを作成(無料プランでOK)
2. ダッシュボードの「SQL Editor」を開き、`supabase/schema.sql` の中身を貼り付けて実行
   → これでテーブル一式(companies, trials, users, ...)と初期4社データが作られます
3. 「Project Settings」→「API」から `Project URL` と `anon public key` をコピー

## 2. ローカルで動かす

```bash
npm install
cp .env.local.example .env.local
# .env.local に、手順1でコピーしたURLとキーを貼り付ける
npm run dev
```

`http://localhost:3000` でホーム画面が開きます(最初はSupabaseにまだtrialsのデータが
無いので一覧は空です。SQL Editorから手動で1件INSERTするか、後述のAI巡回バッチを
作って試してください)。

## 3. Cloudflare Pagesにデプロイする

1. https://dash.cloudflare.com でCloudflareアカウントを作成
2. `npx wrangler login` でCLIからログイン
3. Cloudflareダッシュボードの Pages プロジェクト設定で、環境変数に
   `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
4. デプロイ:
   ```bash
   npm run deploy
   ```

## できていること / まだのこと

**できていること**
- DBスキーマ一式(`supabase/schema.sql`)
- ホーム画面(公開済みの治験を取得し、企業フィルター・並び替えが動く)
- 治験詳細ページ
- 各ページの雛形(マイページ・登録・通知設定・チケラー掲示板)

**まだTODOのこと(各ファイルにもコメントで記載しています)**
- Supabase Authでのログイン状態管理(パスワードレス・magic link)
- マイページの実データ接続(累計報酬額・次回参加可能日の計算)
- 参加履歴の追加フォーム(検索して選ぶ/手動入力の2パターン)
- 通知設定の保存処理
- チケラー掲示板への投稿・返信・「参考になった」・通報機能
- LINE公式アカウント(ユーザー向け通知Bot・運営向けレビューBot)のWebhook実装
- AIによる4社の公式サイト/Instagram巡回バッチ(Supabase Edge Functions想定)
- 外部応募リンクのトラッキングパラメータの実運用

## 参考ドキュメント

同じ会話の中で作成した以下のファイルに、設計の背景や意思決定の経緯がまとまっています。

- `db_schema_design.md` — DB設計の変遷(v0.1〜v0.12)
- `prototype/index.html` — 動くフロントエンドプロトタイプ(モックデータ版)
