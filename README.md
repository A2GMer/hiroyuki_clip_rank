# 🎥 ひろゆき切り抜きランキング

## 📌 概要
ひろゆきの元動画をもとに、切り抜き動画のランキングを作成するアプリです。
切り抜き動画の数や元動画の人気度に基づいてランキングを表示します。

---

## 🚀 機能
✅ **ランキング機能**：切り抜き動画の数に応じたランキングを表示  
✅ **詳細ページ**：元動画ごとの切り抜き動画リストを表示  
✅ **ソート機能**：最新動画順、古い動画順、切り抜き率順で並べ替え可能  
✅ **API エンドポイント**：ランキングデータを取得  

---

## 🛠️ 使用技術
### 🔹 フロントエンド（React）
- React 18
- styled-components
- axios
- React Router

### 🔹 バックエンド（Node.js & Express）
- Express.js
- better-sqlite3（SQLite）
- dotenv（環境変数管理）
- cors（CORS対応）
- axios（YouTube API 取得）

### 🔹 データベース（SQLite）
- `videos`：元動画情報を保存
- `cut_videos`：切り抜き動画情報を保存
- `cut_video_matches`：元動画と切り抜き動画の対応情報を保存

---

## 🔧 セットアップ & 実行方法

### 1️⃣ リポジトリをクローン
```sh
git clone https://github.com/your-username/hiroyuki-clip-rank.git
cd hiroyuki-clip-rank
```

### 2️⃣ バックエンドセットアップ
```sh
cd backend
npm install
cp .env.example .env  # 必要に応じて API キーを設定
node init_db.js  # データベースを初期化
node fetch_videos.js  # 元動画を取得
node fetch_cut_videos.js  # 切り抜き動画を取得
node match_videos.js  # 元動画と切り抜き動画をマッチング
npm start  # バックエンドサーバー起動（デフォルト: http://localhost:5000）
```

### 3️⃣ フロントエンドセットアップ
```sh
cd ../frontend
npm install
npm start  # フロントエンドサーバー起動（デフォルト: http://localhost:3000）
```

---

## 🌐 API エンドポイント
| メソッド | エンドポイント | 説明 |
|----------|---------------|------------------------------------------------|
| `GET` | `/api/ranking` | 切り抜き数が多い順のランキングを取得 |
| `GET` | `/api/ranking?sort=newest` | 最新の元動画順でランキングを取得 |
| `GET` | `/api/ranking?sort=oldest` | 古い元動画順でランキングを取得 |
| `GET` | `/api/ranking?sort=cut_rate` | 切り抜き率順でランキングを取得 |
| `GET` | `/api/original/:videoId` | 指定した元動画に関連する切り抜き動画を取得 |

---

## 🎯 今後の追加機能（予定）
- 📌 **検索機能**：元動画タイトルや切り抜き動画タイトルで検索可能にする
- 📌 **ユーザー登録**：切り抜き制作者がログインしてお気に入り登録できる機能
- 📌 **ランキング詳細**：詳細ページでより多くの分析情報を表示

---

## 📄 ライセンス
このプロジェクトは MIT ライセンスのもとで公開されています。

---

## 🙌 貢献
フィードバックや機能提案、大歓迎です！
Pull Request または Issue を通じてご協力お願いします！

✉️ お問い合わせ: a2gme1r@example.com

