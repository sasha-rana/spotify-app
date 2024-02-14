import React, { useEffect, useState } from 'react';

function LogOut(props) {

    let sdk = props.sdk;
    if (sdk !== null) {
        sdk.logOut();
    }
    return (
        <div>
            <h1>Logged Out</h1>
        </div>
    );
}

export default LogOut;
