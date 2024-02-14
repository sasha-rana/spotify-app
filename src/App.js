import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Callback from './Callback';
import TopTracks from './TopTracks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/top-tracks" element={<TopTracks />} />
      </Routes>
    </Router>
  );
}

export default App;
