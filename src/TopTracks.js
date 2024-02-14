import React, { useEffect, useState } from 'react';
import spotifyApi from './Spotify';

function TopTracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    spotifyApi.getMyTopTracks()
      .then(response => {
        setTracks(response.items);
      });
  }, []);

  return (
    <div>
      <h1>Top Tracks</h1>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>{track.name} by {track.artists.map(artist => artist.name).join(", ")}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopTracks;
