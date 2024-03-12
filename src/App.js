import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopTracks from './TopTracks';
import FollowedArtists from './FollowedArtists.js';
import MyPlaylists from './MyPlaylists.js';
import PlaylistDetails from './PlaylistDetails.js';
import NewPlayListDetails from './NewPlaylistDetails.js';
import LogOut from './LogOut';
import UtilComponent from './UtilComponent';
import { useSpotify } from './useSpotify.ts'
import { Scopes, SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { ChakraProvider } from '@chakra-ui/react'

function App() {

  const sdk = useSpotify(
    "78693347ac844291b855dc7f41b0feb7", 
    "http://localhost:3000", 
    Scopes.all
  );
  console.log("sdk", sdk);
  console.log(document.location);
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TopTracks sdk={sdk} />} />
          <Route path="/F" element={<FollowedArtists sdk={sdk} />} />
          <Route path="/logout" element={<LogOut sdk={sdk} />} />
          <Route path="/playlists" element={<MyPlaylists sdk={sdk} />} />
          <Route path="/details" element={<PlaylistDetails sdk={sdk} />} />
          <Route path="/details2" element={<NewPlayListDetails sdk={sdk} />} />
          <Route path="/util" element={<UtilComponent sdk={sdk} />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
