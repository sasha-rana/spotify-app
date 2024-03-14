
async function getPlaylistDetails(sdk,playlistId) {
    // we first get the list of tracks from local storage
    let tracks = JSON.parse(localStorage.getItem('playlistTracks-' + playlistId)) || [];
    console.log(tracks);
    // if tracks are zero, then we need to load this playlist via the sdk 
    if (tracks.length === 0) {
        // get the first 20 tracks 
        const response = await sdk.playlists.getPlaylistItems(playlistId,undefined, undefined,20,0);
        console.log("getPlaylistItems first call returned:");
        console.log(response);
        let offset = response.offset;
        const total_count = response.total;
        for (let i = 0; i< response.items.length; i++){
            tracks.push(response.items[i].track);
        }
        // now page through the rest of the tracks
        for (offset = response.items.length; offset< total_count; offset+=20){
            const response = await sdk.playlists.getPlaylistItems(playlistId,undefined, undefined,20,offset);
            console.log("getPlaylistItems next call offset:" + offset + " returned:");
            console.log(response);
            for (let j= 0; j< response.items.length; j++){
                tracks.push(response.items[j].track);
            }
        }

        // now that we have the tracks, we need to store each track to local storage individually 
        console.log("Writing tracks for playlist:" + playlistId + " to local storage");
        localStorage.setItem('playlistTracks-' + playlistId, JSON.stringify(tracks));
    }
    // now load artists for the tracks 
    let artists = await loadArtists(sdk, tracks);
    
    return {tracks, artists};
}

// load artists from the spotify sdk give the tracks list  
async function loadArtists(sdk, tracks){
    const visitedArtists = new Set();
    const artists = [];
    for(var track of tracks){
        console.log("Processing Track");
        console.log(track);
        for(var artist of track.artists){
            //check to see if we have not already seen this artist 
            if(!visitedArtists.has(artist.id)){
                // check if the artist is in the local storage 
                if (localStorage.getItem('artist-' + artist.id) === null) {
                    console.log("Fetching Artist:" + artist.name);
                    const artistDetails = await sdk.artists.get(artist.id);
                    console.log("Result:");
                    console.log(artistDetails);
                    artists.push(artistDetails);
                    visitedArtists.add(artist.id);
                    localStorage.setItem('artist-' + artist.id, JSON.stringify(artistDetails));
                }
                else {
                    const artistDetails = JSON.parse(localStorage.getItem('artist-' + artist.id));
                    artists.push(artistDetails);
                    visitedArtists.add(artist.id);
                }
            }
        }
    }
}

export {getPlaylistDetails};
