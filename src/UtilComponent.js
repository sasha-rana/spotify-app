import React, { useEffect, useState } from 'react';

function executeCommand(selectedOption){
    // if purge is selected then purge local storage
    if(selectedOption === "purge"){
        console.log("Purging Local Storage");
        localStorage.clear();
    }
}

function UtilComponent(props){

    // render a combo box with the given different utility functions to execute 
    // set default value to purge local storage
    const [selectedOption, setSelectedOption] = useState("purge");
    const [options, setOptions] = useState();
    let sdk = props.sdk;
    useEffect( () => {
        if(sdk !== null){
        }
    },[sdk]);

    console.log("Hello");
    // render a combo box with the given different utility functions to execute
    // on selection execute the selection function 
    return (
            <><select id="util" onChange={(e) => {setSelectedOption(e.target.value); console.log("here");}}>
                <option value={"purge"}>Purge Local Storage</option>
                <option value={"something"}>Do Something</option>
            </select><button onClick={() => executeCommand(selectedOption)}>Execute</button></>
        )
}

export default UtilComponent;