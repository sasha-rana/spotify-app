import React, { useEffect, useState } from 'react';
// react component which gets my epotify api and then renders to generate HTML
//overall this is a setup to iterate on my ui
function TopTracks(props) {

  console.log("sdk props", props.sdk);
  let sdk = props.sdk;
  console.log("sdk var is:", sdk);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    //allows me to hook dependencies into my react componenet
      if (sdk !== null) {
        console.log("SDK Not NULL")
        //outputs this message to the console
        const fetchTopTracks = async () => {
          try {
            console.log("inside effect:" + sdk);
            //object code that allows me to talk to my spotify api
            const response = await sdk.currentUser.topItems("tracks");
            // takes response from SDK and stores it in the tracks variable
            
            setTracks(response.items);
          } catch (error) {
            console.error("Error fetching top tracks:", error);
            // Handles token expiration or other errors, e.g., redirect to login
          }
        };

        fetchTopTracks();
      }
    }, [sdk]);
    //special syntax that will render my react component kind of like html
    

    return (
      //takes the tracks states variable which is an array and calls map on it which runs the function on each item of the array. 
      //=>defines an inline function on jscript/ why i can see my track list line by line
      <div>
        <h1><span onClick={() => alert(document) } style={{'border':"5px double lightblue"}}>Top</span> Tracks</h1>
        <ul>
      
          {tracks.map((track) => (
            <li key={track.id}>{track.name} by {track.artists.map((artist) => artist.name).join(", ")}</li>
          ))}
        </ul>
      </div>
    );
  
}
//css adds/ connects to this code by allowing me to take my html tag objects like div and li and add different styles to them 
// on the left you can see my top tracks list that came as a result of this code
export default TopTracks;
