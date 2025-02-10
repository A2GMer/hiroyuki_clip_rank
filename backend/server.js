require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');  // または require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SQLite データベースのセットアップ
const db = new Database('hiroyuki.db');  // SQLiteデータベースファイルを作成

// サーバーテスト用エンドポイント
app.get('/', (req, res) => {
    res.send('ひろゆきランキングAPI 動作中');
});

// ポート設定
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// 📌 ランキングデータを取得するAPI
app.get('/api/ranking', (req, res) => {
    try {
        console.log("📡 /api/ranking にリクエストが来た！");

        const sort = req.query.sort || "cut_count"; // デフォルトは切り抜き回数順

        let orderBy = "COUNT(cvm.cut_video_id) DESC";
        if (sort === "newest") orderBy = "v.published_at DESC";
        if (sort === "oldest") orderBy = "v.published_at ASC";
        if (sort === "cut_rate") orderBy = "(COUNT(cvm.cut_video_id) / (JULIANDAY('now') - JULIANDAY(v.published_at))) DESC";

        const ranking = db.prepare(`
            SELECT v.video_id, v.title, COUNT(cvm.cut_video_id) AS cut_count, v.published_at
            FROM videos v
            LEFT JOIN cut_video_matches cvm ON v.video_id = cvm.original_video_id
            GROUP BY v.video_id
            ORDER BY ${orderBy}
            LIMIT 10
        `).all();

        console.log("✅ クエリ結果:", ranking);
        res.json(ranking);
    } catch (error) {
        console.error("❌ データ取得エラー:", error);
        res.status(500).json({ error: "データ取得エラー", details: error.message });
    }
});



// 📌 特定の元動画に紐づく切り抜き動画を取得
app.get('/api/original/:videoId', (req, res) => {
    try {
        const { videoId } = req.params;
        const cutVideos = db.prepare(`
            SELECT cv.cut_video_id, cv.title
            FROM cut_videos cv
            INNER JOIN cut_video_matches cvm ON cv.cut_video_id = cvm.cut_video_id
            WHERE cvm.original_video_id = ?
        `).all(videoId);

        res.json(cutVideos);
    } catch (error) {
        res.status(500).json({ error: "データ取得エラー" });
    }
});
