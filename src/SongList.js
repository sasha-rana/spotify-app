import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, IconButton, Select, Table, Thead, Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

const isSelected = (key) => {
    // Your logic to determine if the item is selected
    // Return true if selected, false otherwise
  };

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
  
  const SongList = ({ playlists, songs }) => {
      const [selectedPlaylist, setSelectedPlaylist] = useState('');
    
      const handleSelectChange = (event) => {
        setSelectedPlaylist(event.target.value);
      };
    
      return (
        <Box flex={1} p={4} overflowY="auto">
          {/* Display selected playlist */}
          <Select placeholder="Select Playlist" onChange={handleSelectChange} mb={4}>
          {playlists.map((playlist) => (   
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
            <Tbody>
              {songs.map((song) => (
                <Tr key={song.key}>
                  <Td>
                    <IconButton
                      aria-label={isSelected(song.key) ? "Deselect" : "Select"}
                      icon={isSelected(song.key) ? <CloseIcon /> : <AddIcon />}
                      onClick={() => {/* toggleSelection(song.key) */}}
                      isRound={true}
                      size="sm"
                    />
                  </Td>
                  <Td>{song.name}</Td>
                  <Td>{song.artist}</Td>
                  <Td>{song.genre}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      );
    };
  // export both components 
export { SongFilter, SongList, SongRow };