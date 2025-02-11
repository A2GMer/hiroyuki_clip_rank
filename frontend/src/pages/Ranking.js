import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
`;

const VideoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const VideoItem = styled.li`
  background: #f9f9f9;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.3s;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const Thumbnail = styled.img`
  width: 120px;
  height: 90px;
  border-radius: 5px;
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const CutCount = styled.p`
  margin: 5px 0 0;
  font-weight: bold;
  color: #ff5733;
`;

const Ranking = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/ranking`)
      .then(response => {
        console.log("📡 API レスポンス:", response.data);
        setVideos(response.data);
      })
      .catch(error => console.error("❌ API エラー:", error));
  }, []);

  return (
    <Container>
      <Title>ひろゆき 切り抜きランキング</Title>
      {videos.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <VideoList>
          {videos.map(video => (
            <VideoItem key={video.video_id}>
              <Thumbnail 
                src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`} 
                alt={video.title}
              />
              <VideoInfo>
                <Link to={`/original/${video.video_id}`}>
                  <VideoTitle>{video.title}</VideoTitle>
                </Link>
                <CutCount>切り抜き回数: {video.cut_count} 回</CutCount>
              </VideoInfo>
            </VideoItem>
          ))}
        </VideoList>
      )}
    </Container>
  );
};

export default Ranking;
