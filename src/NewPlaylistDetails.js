import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, Select,  Modal, ModalOverlay, Spinner, VStack, Input, Button } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { SongList, SelectedSongList } from './SongList';
import { useLocation } from 'react-router-dom';
import { getPlaylistDetails } from './SongLoader';
import { loadPlaylists } from './PlaylistLoader';
import  FilterList  from './FilterList';

const NewPlayListDetails = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [playlistDetails, setPlaylistDetails] = useState();
    const [playlists, setPlaylists] = useState([]);
    const [playlistArtists, setPlaylistArtists] = useState([]);
    const [playlistGenres, setPlaylistGenres] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState(new Set());
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [filterType, setFilterType] = useState("Artist");
    const [selectedSongs, setSelectedSongs] = useState([])
    const [playlistName, setPlaylistName] = useState('');


    const sdk = props.sdk;
    console.log("sdk in SongList:" + sdk);

    useEffect(() => {
        console.log(playlists);
        if (sdk !== undefined){
          async function fetchData() {
            // Load playlists when the component mounts          
            console.log("sdk present");
            console.log(sdk);
            let playlistArray = await loadPlaylists(sdk);
            setPlaylists(playlistArray);
          }
          fetchData();
        }
      }, [sdk]);

  const location = useLocation();
  // SPOTIFY SDK GLUE - END

  // Handler for changing the selected playlist
  const handleSelectChange = async (event) => {
    const playlistId = event.target.value;
    setSelectedPlaylist(playlistId);
    
    setIsLoading(true);

    try {
        // Assuming getPlaylistDetails is an async function returning playlist details
        const details = await getPlaylistDetails(sdk,playlistId);
        setPlaylistDetails(details);
        // now get artists and genre set 
        let artists = new Array();
        let genres = new Array();
        let artistSet = new Set();
        let genreSet = new Set();
        let genreId = 0;
        
        for (let artist of details.artists){
            if (!artistSet.has(artist.id)){
              // add artist to the array
              artists.push({name: artist.name, id: artist.id});
              artistSet.add(artist.id);
              // print the artists genres for debugging
              console.log(artist.name);
              console.log(artist.genres);
              for (let genre of artist.genres){
                if (!genreSet.has(genre)){
                  genres.push({name: genre, id: genreId++});
                  genreSet.add(genre);
                }
              }
            }
        }
        setPlaylistArtists(artists);
        setPlaylistGenres(genres);
        console.log("Setting selected artists and genres");
        console.log(artistSet);
        console.log(genreSet);
        setSelectedArtists(artistSet);
        setSelectedGenres(genreSet);        
    } catch (error) {
        console.error("Failed to load playlist details:", error);
        // Handle error as needed
    } finally {
        setIsLoading(false);
    }
  };

  const selectDeselectSong = (songId,songDetails,selected) => {
    console.log("Selecting song:" + songId + " selected:" + selected);
    // clone the selected songs array
    let currentSelectedSongs = [...selectedSongs];
    if (selected){
      const exists = currentSelectedSongs.find((song) => song.id === songId);
      if (!exists){
        currentSelectedSongs.push(songDetails);
      }
    }
    else {
      currentSelectedSongs = currentSelectedSongs.filter((song) => song.id !== songId);
    }
    console.log("Current Selected Songs");
    console.log(currentSelectedSongs);
    setSelectedSongs(currentSelectedSongs);
  }

  const handleCriteriaChange = (selectedArtists,selectedGenres,filterType) => {
    setSelectedArtists(selectedArtists);
    setSelectedGenres(selectedGenres);
    setFilterType(filterType);
  }

  const createPlaylist = async () => {
    console.log("Creating Playlist");
    
    const createPlaylistRequest = {
      name: playlistName,
      public: true, // This is optional
      collaborative: false, // This is also optional
      description: "New Playlist", // Optional as well
    };

    let profile = await sdk.currentUser.profile();
    console.log(profile);
    let playlist = await sdk.playlists.createPlaylist(profile.id,createPlaylistRequest);
    
    
    let uris = selectedSongs.map((song) => "spotify:track:" + song.id);
    // make them comma separated
    //uris = uris.join(",");

    await sdk.playlists.addItemsToPlaylist(playlist.id,uris);

    setSelectedSongs([]);
    
  }

  return (
    <Flex height="100vh" width="100vw">
        <Modal isOpen={isLoading} onClose={() => {}} isCentered>
            <ModalOverlay />
            <Spinner size="xl" />
        </Modal>
        <Box flex={0.3} borderWidth="1px" borderColor="gray.200" p={4}>
          {/* Assuming FilterList is a component that you will implement */}
          <FilterList playlistArtists={playlistArtists} playlistGenres={playlistGenres} callback={handleCriteriaChange} />
        </Box>

        <Flex direction="column" flex={0.7} borderRight="1px" borderColor="gray.200" p={4}>
          <VStack width="100%" spacing={4}>
            <Select placeholder="Select Playlist" onChange={handleSelectChange} mb={4} width="100%">
              {playlists !== undefined && playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
              ))}
            </Select>
      
          <Box width="100%">
              <SongList title="Existing Playlist: Playlist 123" 
                playlistDetails={playlistDetails} 
                selectedArtists={new Set(selectedArtists)} 
                selectedGenres={new Set(selectedGenres)} 
                selectionMode={filterType}
                selectedSongs={selectedSongs}
                selectionCallback={selectDeselectSong}
                />
          </Box>
        </VStack>
      </Flex>
      <Flex direction="column" flex={0.7} borderRight="1px" borderColor="gray.200" p={4}>
        <VStack width="100%" spacing={4}>
          <Flex width="100%">
            <Input flex="1" placeholder="New Playlist Name" onChange={(event)=> { setPlaylistName(event.target.value); }}/>
            <Button ml={2} isDisabled={selectedSongs.length === 0 || playlistName.length === 0} onClick={createPlaylist}>Create</Button>
          </Flex>

          <SelectedSongList selectedSongs={selectedSongs} />
        </VStack>
      </Flex>
    </Flex>
  );
};

export default NewPlayListDetails;
