import React, { useMemo, useEffect, useState } from 'react';
import { Box, Flex, IconButton, Select, Table, Thead, Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack, Text, Spinner } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';


const isSelected = (id,selectedSongSet) => {
  return selectedSongSet.has(id);
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
  
  function artistsString(artists){
    // create a string of artist names separated by commas
    return artists.map((artist) => artist.name).join(", ");
  }
  function genresString(artists,artistDict){
    // create a set of genres for all artists
    let genres = new Set();
    for (let artist of artists){
      let fullArtist = artistDict[artist.id];
      for (let genre of fullArtist.genres){
        genres.add(genre);
      }
    }
    return Array.from(genres).join(", ");
  }

    
  const SongList = ({playlistDetails,selectedArtists,selectedGenres,selectionMode,selectedSongs,selectionCallback}) => {
    console.log("Selected Songs");
    console.log(selectedSongs);
      if (playlistDetails === undefined || selectedArtists === undefined || selectedGenres === undefined) {
        return (
          <Box flex={1} p={4} overflowY="auto">
            <Spinner />
          </Box>
        );
      }
      // create a set of selected song ids 
      let selectedSongIds = new Set();
      for (let song of selectedSongs){
        selectedSongIds.add(song.id);
      }

      let tracks = playlistDetails.tracks;
      // take artists and create a dictionary by artist id for quick lookup
      let artistDict = {};
      for (let artist of playlistDetails.artists){
        artistDict[artist.id] = artist;
      }
      console.log(selectedArtists);
      // filter the playlist details based on the selected artists and genres
      tracks = tracks.filter((track) => {
        
        let isValidSelection = false;
        for (let artist of track.artists){
          if (selectionMode === "Artist" && selectedArtists.has(artist.id)){
            isValidSelection = true;
          }
          else if (selectionMode === "Genre"){
            let fullArtist = artistDict[artist.id];
            for (let genre of fullArtist.genres){
              if (selectedGenres.has(genre)){
                isValidSelection = true;
              }
            }
          }
        }

        return isValidSelection;
      });

      return (
        <Box flex={1} p={4} overflowY="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th> {/* For the select/deselect buttons */}
                <Th>Song</Th>
                <Th>Artist</Th>
                <Th>Genres</Th>
              </Tr>
            </Thead>
            <Tbody> {
              tracks.map((track) => (
                    <Tr key={track.id}>
                    <Td>
                        <IconButton
                        aria-label={isSelected(track.id,selectedSongIds) ? "Deselect" : "Select"}
                        icon={isSelected(track.id,selectedSongIds) ? <CloseIcon /> : <AddIcon />}
                        onClick={() => { 
                          selectionCallback(track.id,
                          {id: track.id, name: track.name, artists: artistsString(track.artists), genres: genresString(track.artists,artistDict)},
                          !isSelected(track.id,selectedSongIds))}}
                        isRound={true}
                        size="sm"
                        />
                    </Td>
                    <Td>{track.name}</Td>
                    <Td>{artistsString(track.artists)}</Td>
                    <Td>{genresString(track.artists,artistDict)}</Td>
                    </Tr>
                ))
            }
            </Tbody>
          </Table>
        </Box>
      );
    };

    const SelectedSongList = ({selectedSongs}) => {
        if (selectedSongs === undefined) {
          return (
            <Box flex={1} p={4} overflowY="auto">
            </Box>
          );
        }
        return (
          <Box flex={1} p={4} overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Song</Th>
                  <Th>Artist</Th>
                  <Th>Genres</Th>
                </Tr>
              </Thead>
              <Tbody> {
                selectedSongs.map((track) => (
                      <Tr key={track.id}>
                      <Td>{track.name}</Td>
                      <Td>{track.artists}</Td>
                      <Td>{track.artists}</Td>
                      </Tr>
                  ))
              }
              </Tbody>
            </Table>
          </Box>
        );
      };
  

  // export both components 
export { SongFilter, SongList,SelectedSongList };