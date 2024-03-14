import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, IconButton, Select, Table, Thead, Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { SongFilter, SongList } from './SongList';
import { useLocation } from 'react-router-dom';


const HackedPlaylistList = () => { 
    return [
        { id: '1', name: 'Playlist 1' },
        { id: '2', name: 'Playlist 2' },
        { id: '3', name: 'Playlist 3' }
    ];
}

const NewPlayListDetails = (props) => {

  // SPOTIFY SDK GLUE - BEGIN 
  const sdk = props.sdk;
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

  const handleCriteriaChange = (key) => {
    // Handle criteria selection change
  };

  return (
    <Flex height="100vh" width="100vw">
      <Flex flex={1} borderRight="1px" borderColor="gray.200">
        <SongFilter criteria={criteria} onCriteriaChange={handleCriteriaChange} />
        <Box flex={1} p={4}>
            <SongList title="Existing Playlist: Playlist 123" sdk={sdk} />
        </Box>
      </Flex>
      <Box flex={1}>
        <SongList title="New Playlist" playlists={[]}  songs={songsInNewPlaylist} />
      </Box>
    </Flex>
  );
};

export default NewPlayListDetails;
