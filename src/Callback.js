import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyApi from './Spotify';

function Callback() {
  const navigate = useNavigate();
  const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);

  // Immediately attempt to extract the token before useEffect
  const hash = window.location.hash;
  const tokenMatch = hash.match(/access_token=([^&]*)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  useEffect(() => {
    if (token) {
      spotifyApi.setAccessToken(token);
      if (!isReadyToNavigate) {
        setIsReadyToNavigate(true); // Signal readiness to navigate
      }
    } else {
      console.error('Access token was not found.');
      navigate('/');
    }
  }, [navigate, token, isReadyToNavigate]);

  useEffect(() => {
    // Perform the navigation once everything is ready
    if (isReadyToNavigate) {
      navigate('/top-tracks');
    }
  }, [navigate, isReadyToNavigate]);

  return <div>Loading...</div>;
}

export default Callback;
