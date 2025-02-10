import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OriginalVideo = () => {
  const { videoId } = useParams();
  const [cutVideos, setCutVideos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/original/${videoId}`)
      .then(response => setCutVideos(response.data))
      .catch(error => console.error("エラー:", error));
  }, [videoId]);

  return (
    <div>
      <h1>元動画の切り抜きリスト</h1>
      <ul>
        {cutVideos.map(video => (
          <li key={video.cut_video_id}>
            <a href={`https://www.youtube.com/watch?v=${video.cut_video_id}`} target="_blank" rel="noopener noreferrer">
              {video.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OriginalVideo;
