import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, IconButton, Select, Table, Thead, Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack, Text, Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { getPlaylistDetails } from './SongLoader';
import { loadPlaylists } from './PlaylistLoader';

//importing statements from chakra ui library 
//utility function to determine if a particular song (identified by its key) is selected (placeholder function)
const isSelected = (key) => {
    // Your logic to determine if the item is selected
    // Return true if selected, false otherwise
  };
//functional component that represents a single row in the song table. It takes a `song` object as a prop.
//The `song` object contains the song's details such as name, artist, and genre.
const SongRow = ({ song }) => {
const selected = isSelected(song.key);
return (
    <Tr>
    <Td>
        <IconButton
        aria-label={selected ? "Deselect" : "Select"}
        icon={selected ? <CloseIcon /> : <AddIcon />}
        onClick={() => {/* Your selection toggle function here */}}
        isRound={true}
        size="sm"
        />
    </Td>
    <Td>{song.name}</Td>
    <Td>{song.artist}</Td>
    <Td>{song.genre}</Td>
    </Tr>
);
};
  
  // dropdown component that allows users to select a playlist
const SongFilter = ({ criteria, onCriteriaChange }) => {
    return (
      <Box p={4} border="1px" borderColor="gray.300" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Filter Criteria</Text>
        <CheckboxGroup colorScheme="blue">
          <Stack>
            {criteria.map((criterion) => (
              <Checkbox key={criterion.key} value={criterion.key} onChange={() => onCriteriaChange(criterion.key)}>
                {criterion.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>
    );
  };
  
  const SongList = (props) => {
      const [selectedPlaylist, setSelectedPlaylist] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [playlistDetails, setPlaylistDetails] = useState();
      const [playlists, setPlaylists] = useState(undefined);

      let sdk = props.sdk;
      console.log("sdk in SongList:" + sdk);
    
      const handleSelectChange = async (event) => {
        const playlistId = event.target.value;
        setSelectedPlaylist(playlistId);
    
        if (!playlistId) return;
    
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
      }, [selectedPlaylist,sdk]);
            
      return (
        <Box flex={1} p={4} overflowY="auto">
            
          {/* Modal for Loading State */}
          <Modal isOpen={isLoading} onClose={() => {}} isCentered>
                <ModalOverlay />
                <Spinner size="xl" />
          </Modal>


          {/* Display selected playlist */}
          <Select placeholder="Select Playlist" onChange={handleSelectChange} mb={4}>
        {playlists !== undefined && playlists.map((playlist) => (   
            <option value={playlist.id}>{playlist.name}</option>
          ))}
          </Select>
    
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th> {/* For the select/deselect buttons */}
                <Th>Song</Th>
                <Th>Artists</Th>
                <Th>Genres</Th>
              </Tr>
            </Thead>
            <Tbody> {
              playlistDetails !== undefined && 
                playlistDetails.tracks.map((track) => (
                    <Tr key={track.id}>
                    <Td>
                        <IconButton
                        aria-label={isSelected(track.id) ? "Deselect" : "Select"}
                        icon={isSelected(track.id) ? <CloseIcon /> : <AddIcon />}
                        onClick={() => {/* toggleSelection(song.key) */}}
                        isRound={true}
                        size="sm"
                        />
                    </Td>
                    <Td>{track.name}</Td>
                    <Td></Td>
                    <Td>{track.album.name}</Td>
                    </Tr>
                ))
            }
            </Tbody>
          </Table>
        </Box>
      );
    };
  // export both components 
export { SongFilter, SongList, SongRow };