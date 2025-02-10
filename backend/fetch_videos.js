require('dotenv').config();
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('hiroyuki.db');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC0yQ2h4gQXmVUFWZSqlMVOA';  // ひろゆきの公式YouTubeチャンネルID
const MAX_RESULTS = 50; // 1回のリクエストで取得する動画数（最大50件）

async function fetchLiveArchives() {
    try {
        console.log("🎥 YouTube API からライブ配信のアーカイブを取得中...");

        let nextPageToken = "";
        let totalFetched = 0;
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO videos (video_id, title, channel_id, published_at)
            VALUES (?, ?, ?, ?)
        `);

        do {
            // APIリクエストURL
            const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&eventType=completed&maxResults=${MAX_RESULTS}&pageToken=${nextPageToken}`;

            const res = await axios.get(url);
            if (res.status !== 200) {
                throw new Error(`HTTPエラー: ${res.status} - ${res.statusText}`);
            }

            const videos = res.data.items;
            if (!videos || videos.length === 0) {
                throw new Error("取得したライブ動画のアーカイブデータが空です。APIキーまたはチャンネルIDを確認してください。");
            }

            videos.forEach(video => {
                stmt.run(
                    video.id.videoId,
                    video.snippet.title,
                    CHANNEL_ID,
                    video.snippet.publishedAt
                );
            });

            totalFetched += videos.length;
            console.log(`✅ ${totalFetched} 件のライブアーカイブを取得！`);

            nextPageToken = res.data.nextPageToken || "";
        } while (nextPageToken); // `nextPageToken` がある限り繰り返す

        console.log("✅ YouTube API からのライブアーカイブ取得 & SQLite 保存完了！");
    } catch (error) {
        console.error("❌ エラー発生:", error.response ? error.response.data : error.message);
    }
}

fetchLiveArchives();
