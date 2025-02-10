require('dotenv').config();
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('hiroyuki.db');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function matchVideos() {
    try {
        console.log("🔍 切り抜き動画の説明欄を解析中...");

        // 切り抜き動画リストを取得（まだマッチングされていないもの）
        const cutVideos = db.prepare("SELECT cut_video_id FROM cut_videos").all();

        if (cutVideos.length === 0) {
            console.log("✅ すでに全ての切り抜き動画に元動画が紐づけられています！");
            return;
        }

        const insertStmt = db.prepare("INSERT OR IGNORE INTO cut_video_matches (cut_video_id, original_video_id) VALUES (?, ?)");

        for (const cutVideo of cutVideos) {
            const videoId = cutVideo.cut_video_id;
            const url = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet`;

            try {
                const res = await axios.get(url);
                const videoData = res.data.items[0];

                if (videoData) {
                    const description = videoData.snippet.description;
                    // console.log(`🔍 ${videoId} の説明欄:`, description);

                    // 説明欄に含まれる全ての YouTube 動画URL を取得
                    const matches = description.match(/(?:https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([a-zA-Z0-9_-]+)/g);

                    if (matches) {
                        // 重複を除外して、全ての元動画を保存
                        const originalVideoIds = [...new Set(matches.map(url => url.split('v=')[1] || url.split('youtu.be/')[1]))];

                        originalVideoIds.forEach(originalVideoId => {
                            insertStmt.run(videoId, originalVideoId);
                            console.log(`🔗 ${videoId} → 元動画: ${originalVideoId}`);
                        });

                    } else {
                        console.log(`⚠ ${videoId} に元動画のURLが見つかりませんでした`);
                    }
                }
            } catch (error) {
                console.error(`❌ エラー: ${videoId} の説明欄取得に失敗しました -`, error.message);
            }
        }

        console.log("✅ 切り抜き動画と元動画のマッチング処理完了！");
    } catch (error) {
        console.error("❌ エラー発生:", error.message);
    }
}

matchVideos();
