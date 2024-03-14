async function loadPlaylists(sdk) { 
    console.log("Fetching Playlists sdk:" + sdk);
    if (sdk !== null) {
        const response = await sdk.currentUser.playlists.playlists();
        console.log(response);
        return response.items;
    }
}

export { loadPlaylists }