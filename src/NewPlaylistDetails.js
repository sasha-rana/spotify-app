import React, { useMemo } from 'react';
import { Box, Flex, IconButton, Table, Thead, Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';
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

  
  const SongList = ({ title, songs }) => {
    return (
      <Box flex={1} p={4} overflowY="auto">
        <Text fontSize="lg" fontWeight="bold" mb={4}>{title}</Text>
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
  

const NewPlayListDetails = () => {
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

  const handleCriteriaChange = (key) => {
    // Handle criteria selection change
  };

  return (
    <Flex height="100vh" width="100vw">
      <Flex flex={1} borderRight="1px" borderColor="gray.200">
        <SongFilter criteria={criteria} onCriteriaChange={handleCriteriaChange} />
        <Box flex={1} p={4}>
            <SongList title="Existing Playlist: Playlist 123" songs={songsInExistingPlaylist} />
        </Box>
      </Flex>
      <Box flex={1}>
        <SongList title="New Playlist" songs={songsInNewPlaylist} />
      </Box>
    </Flex>
  );
};

export default NewPlayListDetails;
