import React, { useEffect, useState } from 'react';

function MyPlaylists(props){

    const [playlists, setPlaylists] = useState();
    
    let sdk = props.sdk;

    useEffect( () => {
        if(sdk !== null){
            const fetchPlaylists = async () => {
                const response = await sdk.currentUser.playlists.playlists();
                console.log(response);
                setPlaylists(response.items);
            }
            fetchPlaylists();
        }
    },[sdk]);

    let content = undefined

    if (playlists === undefined){
        content = (<div>undefined</div>)
    }
    else{
        let color='red';
        content = playlists.map( (x) => {
            if (color==='red') { 
                color = 'green';
            }
            else { 
                color = 'red';
            }
            return (
            <div>
                <a style={{'color':color}} href={"/details?id=" + x.id}>{x.name}</a>
            </div>)
        })
        console.log(content);
    }

    return (
        <div>{content}</div>
    );
}

export default MyPlaylists;