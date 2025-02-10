import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Ranking from "./pages/Ranking";
import OriginalVideo from "./pages/OriginalVideo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ranking />} />
        <Route path="/original/:videoId" element={<OriginalVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
