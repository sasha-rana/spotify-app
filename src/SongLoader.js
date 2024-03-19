
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

// Helper function to split an array into chunks
const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
  
// Function to fetch metadata for multiple artists
const fetchArtistsByIds = async (artistIds, sdk) => {
    try {
        // chunk the artist ids array into sub arrays of 10 each
        const artistChunks = chunkArray(artistIds, 3);
        const allArtists = [];
      

        for (const chunk of artistChunks) {
            // Map each ID to a fetch promise
            const fetchPromises = chunk.map(id => sdk.artists.get(id));
            console.log("Fetching " + chunk.length + " artists");
            // Use Promise.all to wait for all promises to resolve
            const artists = await Promise.all(fetchPromises);
            console.log("Fetched " + chunk.length + " artists");
            // store artists in the local storage
            for (var artist of artists){
                localStorage.setItem('artist-' + artist.id, JSON.stringify(artist));
            }
            allArtists.push(artists);
        }  
        // artists will be an array of results from each promise
        return allArtists;
    } catch (error) {
      console.error("Failed to fetch artists:", error);
      throw error; // Rethrow or handle error as appropriate
    }
  };
  

// load artists from the spotify sdk give the tracks list  
async function loadArtists(sdk, tracks){
    const visitedArtists = new Set();
    let artists = [];
    let artistIds = [];
    let fetchedArtists = [];
    // collect artist ids for tracks 
    for(var track of tracks){
        for(var artist of track.artists){
            if (!visitedArtists.has(artist.id)){
                // if we don't have this artist cached 
                if (localStorage.getItem('artist-' + artist.id) === null) {
                    console.log("Artist not in local storage:" + artist.name);
                    artistIds.push(artist.id);
                }
                else { 
                    console.log("Artist already in local storage:" + artist.name);
                    const artistDetails = JSON.parse(localStorage.getItem('artist-' + artist.id));
                    artists.push(artistDetails);
                }
                visitedArtists.add(artist.id);
            }
        }
    }

    // fetch artists by their IDs
    fetchedArtists = await fetchArtistsByIds(artistIds, sdk);
    // merge the two arrays
    artists = artists.concat(fetchedArtists.flat());

    return artists;
}

export {getPlaylistDetails};
