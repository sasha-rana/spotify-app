import React, { useState, useEffect } from 'react';

const FilterList = ({ playlistArtists, playlistGenres, callback }) => {
    const [filterType, setFilterType] = useState('Artist');
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState(new Set());
    const [selectedGenres, setSelectedGenres] = useState(new Set());

    useEffect(() => {
        setArtists(playlistArtists);
        setGenres(playlistGenres);
        setSelectedArtists(new Set(Array.from(playlistArtists).map(a => a.id)));
        setSelectedGenres(new Set(Array.from(playlistGenres).map(a => a.name)));
    }, [playlistArtists, playlistGenres]);

    useEffect(() => {
        // Whenever the selection changes, call the callback with the current selection
        callback(Array.from(selectedArtists),Array.from(selectedGenres),filterType);
    }, [selectedArtists, selectedGenres, filterType]);

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    };

    const handleCheckboxChange = (id, type) => {
        const updateSelection = (selectedSet) => {
        const newSelection = new Set(selectedSet);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        return newSelection;
        };

        if (type === 'Artist') {
        setSelectedArtists(prev => updateSelection(prev));
        } else if (type === 'Genre') {
        setSelectedGenres(prev => updateSelection(prev));
        }
    };

    return (
        <div>
        <select value={filterType} onChange={handleFilterTypeChange}>
            <option value="Artist">Artist</option>
            <option value="Genre">Genre</option>
        </select>
        <div>
            {filterType === 'Artist' && artists.map(artist => (
            <div key={artist.id}>
                <input
                type="checkbox"
                checked={selectedArtists.has(artist.id)}
                onChange={() => handleCheckboxChange(artist.id, 'Artist')}
                />
                {artist.name}
            </div>
            ))}
            {filterType === 'Genre' && genres.map(genre => (
            <div key={genre.id}>
                <input
                type="checkbox"
                checked={selectedGenres.has(genre.name)}
                onChange={() => handleCheckboxChange(genre.name, 'Genre')}
                />
                {genre.name}
            </div>
            ))}
        </div>
        </div>
    );
};

export default FilterList;
