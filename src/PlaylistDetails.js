import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


//helper function to store playlist to local storage 
const savePlaylistToLocalStorage = (playlistId, tracksAndArtists) => {
    console.log("savePlaylistToLocalStorage - id:" + playlistId);
    console.log(tracksAndArtists);
    const existingRecords = JSON.parse(localStorage.getItem('parentChildRecords')) || {};
    // Update the records for the given parentId
    existingRecords[playlistId] = tracksAndArtists;
    console.log(existingRecords);
    // Save back to local storage
    localStorage.setItem('parentChildRecords', JSON.stringify(existingRecords));
}

// helper function to get playlist from local storage 
const getPlaylistFromLocalStorage = (playlistId) => {
    console.log("getPlaylistFromLocalStorage");
    const records = JSON.parse(localStorage.getItem('parentChildRecords')) || {};
    console.log("getPlaylistFromLocalStorage returned:");
    console.log(records);
    return records[playlistId];
};
  
// load playlist details using spotify sdk
async function loadPlaylist(sdk,id) {
    let items = []; 
    const response = await sdk.playlists.getPlaylistItems(id,undefined, undefined,20,0);
    console.log("getPlaylistItems first call returned:");
    console.log(response);
    let offset = response.offset;
    const total_count = response.total;
    for (let i = 0; i< response.items.length; i++){
        items.push(response.items[i].track);
    }

    for (offset = response.items.length; offset< total_count; offset+=20){
        const response = await sdk.playlists.getPlaylistItems(id,undefined, undefined,20,offset);
        console.log("getPlaylistItems next call offset:" + offset + " returned:");
        console.log(response);
        for (let j= 0; j< response.items.length; j++){
            items.push(response.items[j].track);
        }
    }
    return items; 
}
// load artists from the spotify sdk 
async function loadArtists(sdk, tracks){
    const visitedArtists = new Set();
    const artists = [];
    for(var track of tracks){
        console.log("Processing Track");
        console.log(track);
        for(var artist of track.artists){
            //check to see if we have not already seen this artist 
            if(!visitedArtists.has(artist.id)){
                console.log("Fetching Artist:" + artist.name);
                const artistDetails = await sdk.artists.get(artist.id);
                console.log("Result:");
                console.log(artistDetails);
                artists.push(artistDetails);
                visitedArtists.add(artist.id);
            }
        }
    }
    return artists; 
}
//goes and replaces the partial artist objects in the track with the fully detailed objects we fetched
// so we can get the genre 
function replaceTrackArtistObjects(tracksAndArtists) {
    const { items, artists } = tracksAndArtists;

    // Iterate over each track
    for (var track of items) {
        // Iterate over each artist in the track
        for (let j = 0; j < track.artists.length; j++) {
            const trackArtist = track.artists[j];
            
            // Find the matching top-level artist by ID and replace it in the track's artists array
            for (var fullArtist of artists) {
                if (trackArtist.id === fullArtist.id) {
                    track.artists[j] = fullArtist;
                    break; // Stop searching once we find the matching artist
                }
            }
        }
    }
}

// actual react component that renders the playlist details
function PlaylistDetails(props){
    // setter and getter for the tracks and artists state 
    const [tracksAndArtists, setTracksAndArtists] = useState();
    // SPOTIFY SDK GLUE - BEGIN 
    let sdk = props.sdk;
    const location = useLocation();
    // SPOTIFY SDK GLUE - END

    // Use URLSearchParams to parse the query parameters
    const queryParams = new URLSearchParams(location.search);
    // get the playlist id from the query params 
    const id = queryParams.get('id');
    // useEffect is used to load the component's state, it takes a callback 
    useEffect( () => {
        if(sdk !== null){
            const fetchPlaylistDetails = async () => {
                //get the tracks and artists from local storage database
                let tracksAndArtists = getPlaylistFromLocalStorage(id);
                //if no record exists, fetch it using spotify api
                if(tracksAndArtists === undefined){
                    console.log("Fetching playlist using SDK")
                    //load tracks for playlist first
                    let tracks = await loadPlaylist(sdk, id);
                    console.log("Fetching Artist details")
                    //then load all artists in the given tracks
                    let artistsArray = await loadArtists(sdk, tracks);
                    //create a jscript object that contains both the tracks and the artists arrays
                    tracksAndArtists = { items: tracks, artists: artistsArray }
                    
                    console.log("Saving to Playlist");
                    //save the new object back to local database 
                    savePlaylistToLocalStorage(id, tracksAndArtists);

                }
                console.log(tracksAndArtists);
                // fix artists 
                replaceTrackArtistObjects(tracksAndArtists);
                setTracksAndArtists(tracksAndArtists);
            }
            fetchPlaylistDetails();
        }
    },[sdk]);
    //rerender different content if the component's state is not ready 
    let content = undefined

    if (tracksAndArtists === undefined){
        content = (<div>undefined</div>)
    }
    else{
        console.log(tracksAndArtists);
        //render each track (name and id), artists and genres in table format
        content = (
            <table>
              <thead>
                <tr>
                  <th>Track Name</th>
                  <th>Track ID</th>
                  <th>Artists (Genres)</th>
                </tr>
              </thead>
              <tbody>
                {tracksAndArtists.items.map((track) => (
                  <tr key={track.id}>
                    <td>{track.name}</td>
                    <td>{track.id}</td>
                    <td>
                      {track.artists.map((artist, index) => (
                        <span key={artist.id}>
                          {artist.name} ({artist.genres.join(', ')})
                          {index < track.artists.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );          
    }

    return (
        <div>{content}</div>
    );
}

export default PlaylistDetails;