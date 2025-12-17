## 就活エージェントマッチング MVP

React(TypeScript) + PHP + MySQL で動くスワイプ式アンケート → 連絡先登録のMVPです。XAMPP 上でのローカル開発と、Xserver へのそのままの配置を想定しています。

### ディレクトリ構成
- `frontend/` Vite + React + TypeScript（UI/ビルド）
- `backend/` 素の PHP API
  - `api/questions.php` 質問取得
  - `api/submit.php` 回答/連絡先保存
  - `config.php` DB接続と共通ヘルパ
- `database/schema.sql` テーブル定義

### 機能概要
- LP で説明 →「はじめる」で質問へ遷移
- スワイプ or タップで1問ずつ回答（進捗表示、スキップは任意質問のみ）
- 連絡先入力（名前/学校必須、電話orメールのどちらか必須、同意チェック必須）
- 完了画面に指定文言を表示
- 回答と連絡先を DB 保存（leads / lead_answers）。マッチング処理は未実装で、管理者がDBを参照して連絡する運用を想定。

### 事前準備
- XAMPP: Apache + MySQL(MariaDB)
- Node.js (v18 目安)

### DBセットアップ
1. MySQL を起動（XAMPPのMySQL）
2. データベースを作成（例: `jobmatch`）
3. `database/schema.sql` を適用  
   例: `mysql -u root -p jobmatch < database/schema.sql`

### backend設定
1. `backend/config.php` の DB 接続値を環境に合わせて変更（`DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASS` 環境変数でも可）
2. 開発で Vite(5173)→Apache(80) のクロスオリジンになる場合は、Apache 側のドメインを `CORS_ALLOW_ORIGIN` に設定（例: `http://localhost:5173`）。同ファイルの `apply_cors()` が自動でヘッダ付与。

### ローカル開発手順（例: XAMPP の htdocs に配置した場合）
1. XAMPP で Apache と MySQL を起動
2. プロジェクトを `htdocs/match_agent/` に置くと、PHP は `http://localhost/match_agent/backend/api/` でアクセス可
3. フロントエンド
   ```bash
   cd frontend
   npm install
   # Vite から PHP にプロキシする場合（例）
   echo VITE_DEV_API_TARGET=http://localhost/match_agent >> .env.development
   npm run dev
   ```
   - API ベースURLは `/api` （同一ドメイン想定）。必要なら `.env` に `VITE_API_BASE` を指定。
4. PHP API は Apache でそのまま動作（追加のビルド不要）

### ワンコマンド開発環境（PHPビルトイン + Vite）
XAMPPの代わりにPHPビルトインサーバーで手早く開発する場合:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-dev.ps1
```
- やること: DB作成＆schema適用 / frontend依存インストール / PHPビルトイン(:8000) / Vite(:5173, proxy)
- 事前に `mysql` と `php` がパスにあること。必要なら環境変数で上書き: `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASS`, `PHP_BIN`, `MYSQL_BIN`
- 本番・本検証は必ず Apache + HTTPS で行ってください（ビルトインサーバーは開発用途限定）

### 本番デプロイ（Xserver）
1. `frontend` をビルド
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   生成された `frontend/dist` の中身を `public_html/` 直下へ配置
2. `backend` ディレクトリを `public_html/api/` など同一ドメイン配下に配置  
   - `config.php` の DB 設定を本番用に変更
3. MySQL に `database/schema.sql` を適用し、本番DBを準備
4. HTTPS を必ず有効化（個人情報入力があるため）

### API 仕様
- GET `/api/questions.php`  
  レスポンス: `{ "questions": [ { id, title, type, options, required }, ... ] }`
- POST `/api/submit.php` (`Content-Type: application/json`)  
  ```json
  {
    "answers": { "grad_year": "2026卒", ... },
    "contact": { "name": "...", "school": "...", "phone": "", "email": "..." },
    "consent": true
  }
  ```
  - name, school 必須 / phone or email どちらか必須 / consent=true 必須
  - 成功: `{ "ok": true, "lead_id": 123 }`

### セキュリティ/運用メモ
- PDO + Prepared Statement で SQL Injection 対策済み
- 個人情報を扱うため、本番は必ず HTTPS 化し、DB へのアクセス権限を最小化してください
- CORS は本番不要（同一オリジン）。開発で分離する場合のみ `CORS_ALLOW_ORIGIN` を設定

### よく使うコマンド
- 開発サーバ: `cd frontend && npm run dev`
- 本番ビルド: `cd frontend && npm run build`
- DB適用: `mysql -u <user> -p <db> < database/schema.sql`

### 備考
- マッチングロジックはMVPでは未実装です（DBを元に管理者連絡運用）。将来的な `agents` / `matches` 拡張を見据え、`lead_answers` に質問ID/回答を保存しています。
