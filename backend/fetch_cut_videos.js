require('dotenv').config();
const axios = require('axios');
const Database = require('better-sqlite3');
const path = require('path');

const API_KEY = process.env.YOUTUBE_API_KEY;
const SEARCH_QUERY = "ひろゆき 切り抜き";
const dbPath = path.join(__dirname, 'hiroyuki.db');
const db = new Database(dbPath);

console.log("📡 YouTube API から切り抜き動画を取得中...");

// 🔹 `cut_videos` テーブルがなければ作成
db.exec(`
    CREATE TABLE IF NOT EXISTS cut_videos (
        cut_video_id TEXT PRIMARY KEY,
        title TEXT NOT NULL
    );
`);

async function fetchCutVideos(pageToken = "") {
    let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(SEARCH_QUERY)}&part=snippet&type=video&maxResults=50&order=date`;
    if (pageToken) url += `&pageToken=${pageToken}`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;
        const nextPageToken = response.data.nextPageToken;

        if (items.length > 0) {
            console.log(`✅ ${items.length} 件の切り抜き動画を取得！`);

            const insert = db.prepare("INSERT OR IGNORE INTO cut_videos (cut_video_id, title) VALUES (?, ?)");
            const insertMany = db.transaction((videos) => {
                for (const video of videos) {
                    insert.run(video.id.videoId, video.snippet.title);
                }
            });

            insertMany(items);
        }

        if (nextPageToken) {
            console.log(`🔄 次のページを取得中...`);
            await fetchCutVideos(nextPageToken);
        } else {
            console.log("🚀 すべての切り抜き動画を取得完了！");
        }

    } catch (error) {
        console.error("❌ YouTube API エラー:", error.response ? error.response.data : error.message);
    }
}

// 📌 実行
fetchCutVideos();
