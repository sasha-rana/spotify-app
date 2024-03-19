import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, Select,  Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { SongFilter, SongList } from './SongList';
import { useLocation } from 'react-router-dom';
import { getPlaylistDetails } from './SongLoader';
import { loadPlaylists } from './PlaylistLoader';

const HackedPlaylistList = () => { 
    return [
        { id: '1', name: 'Playlist 1' },
        { id: '2', name: 'Playlist 2' },
        { id: '3', name: 'Playlist 3' }
    ];
}

const NewPlayListDetails = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [playlistDetails, setPlaylistDetails] = useState();
    const [playlists, setPlaylists] = useState([]);

    const sdk = props.sdk;
    console.log("sdk in SongList:" + sdk);

    useEffect(() => {
        console.log(playlists);
        if (sdk !== undefined && playlists === undefined){
          async function fetchData() {
            // Load playlists when the component mounts          
            console.log("sdk present");
            console.log(sdk);
            let playlistArray = await loadPlaylists(sdk);
            setPlaylists(playlistArray);
            // Clear playlist details when selection is cleared or changed
            //setPlaylistDetails([]);
          }
          fetchData();
        }
      }, [sdk]);

  const location = useLocation();
  // SPOTIFY SDK GLUE - END

  // Example songs data
  const songsInExistingPlaylist = [
    { key: '1', name: 'Song 1', artist: 'Artist 1', genre: 'Genre 1' },
    { key: '2', name: 'Song 2 Reall long description', artist: 'Artist 1', genre: 'Genre 1' },
    // Add more song data here
  ];

  const songsInNewPlaylist = [
    { key: '1', name: 'Song 1', artist: 'Artist 1', genre: 'Genre 1' },
    { key: '2', name: 'Song 2 Reall long description', artist: 'Artist 1', genre: 'Genre 1' },
    // Add more song data here
  ];

  // Example criteria data
  const criteria = [
    { key: '1', label: 'Criteria 1' },
    // Add more criteria here
  ];

  // Handler for changing the selected playlist
  const handleSelectChange = async (event) => {
    const playlistId = event.target.value;
    setSelectedPlaylist(playlistId);
    
    setIsLoading(true);

    try {
        // Assuming getPlaylistDetails is an async function returning playlist details
        const details = await getPlaylistDetails(sdk,playlistId);
        setPlaylistDetails(details);
    } catch (error) {
        console.error("Failed to load playlist details:", error);
        // Handle error as needed
    } finally {
        setIsLoading(false);
    }
  };

  const handleCriteriaChange = (criterion) => {
    // Handle criteria change
  }

  return (
    <Flex height="100vh" width="100vw">
        <Modal isOpen={isLoading} onClose={() => {}} isCentered>
            <ModalOverlay />
            <Spinner size="xl" />
        </Modal>


      <Flex flex={1} borderRight="1px" borderColor="gray.200">
        <SongFilter criteria={criteria} onCriteriaChange={handleCriteriaChange} />

        <Select placeholder="Select Playlist" onChange={handleSelectChange} mb={4}>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
          ))}
        </Select>
        
        <Box flex={1} p={4}>
            <SongList title="Existing Playlist: Playlist 123" playlistDetails={playlistDetails} />
        </Box>
      </Flex>
      <Box flex={1}>
        <SongList title="New Playlist" sdk={sdk} />
      </Box>
    </Flex>
  );
};

export default NewPlayListDetails;
