import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopTracks from './TopTracks';
import LogOut from './LogOut';
import { useSpotify } from './useSpotify.ts'
import { Scopes, SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk';

function App() {

  const sdk = useSpotify(
    "78693347ac844291b855dc7f41b0feb7", 
    "http://localhost:3000", 
    Scopes.all
  );
  console.log("sdk", sdk);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopTracks sdk={sdk} />} />
        <Route path="/logout" element={<LogOut sdk={sdk} />} />
      </Routes>
    </Router>
  );
}

export default App;
