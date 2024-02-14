import React, { useEffect, useState } from 'react';


function TopTracks(props) {

  console.log("sdk props", props.sdk);
  let sdk = props.sdk;
  console.log("sdk var is:", sdk);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
      if (sdk !== null) {
        console.log("SDK Not NULL")
        const fetchTopTracks = async () => {
          try {
            console.log("inside effect:" + sdk);
            const response = await sdk.currentUser.topItems("tracks");
            
            setTracks(response.items);
          } catch (error) {
            console.error("Error fetching top tracks:", error);
            // Handle token expiration or other errors, e.g., redirect to login
          }
        };

        fetchTopTracks();
      }
    }, [sdk]);
    

    return (
      <div>
        <h1>Top Tracks</h1>
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>{track.name} by {track.artists.map((artist) => artist.name).join(", ")}</li>
          ))}
        </ul>
      </div>
    );
  
}

export default TopTracks;
