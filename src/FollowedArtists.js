import React, { useEffect, useState } from 'react';

function FollowedArtists(props){

    const [artists, setArtists] = useState();
    let sdk = props.sdk;

    useEffect( () => {
        if(sdk !== null){
            const fetchArtists = async () => {
                const response = await sdk.currentUser.followedArtists("");
                console.log(response);
                setArtists(response.artists);
            }
            fetchArtists();
        }
    },[sdk]);

    let content = undefined

    if (artists === undefined){
        content = (<div>undefined</div>)
    }
    else{

        content = artists.items.map( (x) => {
            return (<div>{x.name}</div>)
        })
    }

    return (
        <div>{content}</div>
    );
}

export default FollowedArtists;