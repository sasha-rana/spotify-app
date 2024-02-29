import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


/*
{ '1234' : [{},{}}] ,
  '3444' : [{},{}]
}
*/
const savePlaylistToLocalStorage = (playlistId, childRecords) => {
    console.log("savePlaylistToLocalStorage - id:" + playlistId);
    console.log(childRecords);
    const existingRecords = JSON.parse(localStorage.getItem('parentChildRecords')) || {};
    // Update the records for the given parentId
    existingRecords[playlistId] = childRecords;
    // Save back to local storage
    localStorage.setItem('parentChildRecords', JSON.stringify(existingRecords));
}


const getPlaylistFromLocalStorage = (playlistId) => {
    console.log("getPlaylistFromLocalStorage");
    const records = JSON.parse(localStorage.getItem('parentChildRecords')) || {};
    console.log(records);
    return records[playlistId];
};
  

  

async function loadPlaylist(sdk,id) {
    let items = []; 
    const response = await sdk.playlists.getPlaylistItems(id,undefined, undefined,20,0);
    console.log("getPlaylistItems first call returned:");
    console.log(response);
    let offset = response.offset;
    const total_count = response.total;
    for (let i = 0; i< response.items.length; i++){
        items.push(response.items[i]);
    }

    for (offset = response.items.length; offset< total_count; offset+=20){
        const response = await sdk.playlists.getPlaylistItems(id,undefined, undefined,20,offset);
        console.log("getPlaylistItems next call offset:" + offset + " returned:");
        console.log(response);
        for (let j= 0; j< response.items.length; j++){
            items.push(response.items[j]);
        }
    }
    console.log("Saving to Playlist");
    savePlaylistToLocalStorage(id, items);
    return items; 
}

function PlaylistDetails(props){

    const [tracks, setTracks] = useState();
    let sdk = props.sdk;
    const location = useLocation();

    // Use URLSearchParams to parse the query parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
  
    useEffect( () => {
        if(sdk !== null){
            const fetchPlaylistDetails = async () => {
                let tracks = getPlaylistFromLocalStorage(id);
                if(tracks === undefined){
                    tracks = await loadPlaylist(sdk, id);
                }
                console.log(tracks);
                setTracks(tracks);
            }
            fetchPlaylistDetails();
        }
    },[sdk]);

    let content = undefined

    if (tracks === undefined){
        content = (<div>undefined</div>)
    }
    else{
        console.log(tracks);
        content = tracks.map( (x) => {
            return (<div>{x.track.name} - {x.track.id} </div>)
        })

    }

    return (
        <div>{content}</div>
    );
}

export default PlaylistDetails;