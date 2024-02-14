import React from 'react';

const CLIENT_ID = '78693347ac844291b855dc7f41b0feb7';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=user-top-read`;

function Login() {
  return (
    <div>
      <a href={AUTH_URL}>Login to Spotify</a>
    </div>
  );
}

export default Login;
