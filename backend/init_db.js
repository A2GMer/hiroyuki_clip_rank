const Database = require('better-sqlite3');

// データベースファイルを作成（または既存のファイルを開く）
const db = new Database('hiroyuki.db');

// `videos` テーブル作成（元動画情報）
db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
        video_id TEXT PRIMARY KEY,
        title TEXT,
        channel_id TEXT,
        published_at TEXT,
        total_views INTEGER DEFAULT 0,
        cut_count INTEGER DEFAULT 0,
        total_cut_views INTEGER DEFAULT 0
    );
`);

// `cut_videos` テーブル作成（切り抜き動画情報）
db.exec(`
    CREATE TABLE IF NOT EXISTS cut_videos (
        cut_video_id TEXT PRIMARY KEY,
        original_video_id TEXT,
        title TEXT,
        channel_id TEXT,
        published_at TEXT,
        views INTEGER DEFAULT 0,
        FOREIGN KEY(original_video_id) REFERENCES videos(video_id)
    );
`);

// `timestamps` テーブル作成（コメントタイムスタンプ情報）
db.exec(`
    CREATE TABLE IF NOT EXISTS timestamps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        timestamp TEXT,
        count INTEGER DEFAULT 0,
        FOREIGN KEY(video_id) REFERENCES videos(video_id)
    );
`);

console.log("✅ SQLite データベースの初期化完了！");


db.exec(`
    CREATE TABLE IF NOT EXISTS cut_video_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cut_video_id TEXT,
        original_video_id TEXT,
        FOREIGN KEY(cut_video_id) REFERENCES cut_videos(cut_video_id),
        FOREIGN KEY(original_video_id) REFERENCES videos(video_id)
    );
`);

console.log("✅ データベース構造を更新しました！");
