/*global chrome*/
import React, { useState, useEffect } from 'react';
import PogTopicCreation from './PogTopicCreation';
import '../App.css';

const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 euIPFy";

function uuidv4() {
    const a = crypto.getRandomValues(new Uint16Array(8));
    let i = 0;
    return '00-0-4-1-000'.replace(/[^-]/g,
        s => (a[i++] + s * 0x10000 >> s).toString(16).padStart(4, '0')
    );
}

function Pogchat() {

    const [waitUUID, setWaitUUID] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [currentState, setCurrentState] = useState(null);

    // Determine if already logged in
    useEffect(() => {
        chrome.storage.sync.get("info", (data) => {
            setUserInfo(data.info)
        });
    }, [])

    // Wait for auth if auth started
    useEffect(() => {

        if (!waitUUID) {
            return;
        }

        // Poll for finishing
        function pollLogin(uuid) {
            fetch("http://localhost:8080/auth", {
                method: "POST",
                mode: "cors",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"accessToken": waitUUID})})
                .then(async (data) => {
                    let result = await data.json()
                    console.log(result)
                    if (result.ready) {
                        let info = {
                            "access_token": result.token,
                            "user": result.user
                        }
                        chrome.storage.sync.set({
                            "info": {
                                "access_token": result.token,
                                "user": result.user
                            }
                        });
                        setUserInfo(info)
                        setWaitUUID(null)
                        return;
                    }
                    setTimeout(function () {
                        pollLogin(uuid)
                    }, 1000)
                })
                .catch((err) => {

                })
        }
        pollLogin(waitUUID)
    }, [waitUUID])

    let onLoginClicked = () => {
        let uuid = uuidv4();
        const authLink = `https://id.twitch.tv/oauth2/authorize\n?client_id=mbiftzplnzsllgon3p5gqkbke8rkyy&redirect_uri=http://localhost:8080/auth&response_type=code&scope=user:read:email&state=${uuid}`
        setWaitUUID(uuid);
        window.open(authLink, '_blank').focus();
    }

    console.log(userInfo)
    console.log(currentState)

    return (
        <div style={{padding: 8}}>
            {!userInfo &&
                <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={onLoginClicked} >
                    Login with Twitch
                </button>
            }
            {userInfo && currentState == null &&
            <div>
                <div style={{fontWeight: 'bold', fontSize: 14}}>
                    Welcome to Pogchat, {userInfo.user.lastKnownDisplayName}!
                </div><br />
                <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={() => setCurrentState('create-topic')} >
                    Create Topic
                </button>
            </div>
            }
            {userInfo && currentState === 'create-topic' &&
                <PogTopicCreation />
            }

        </div>
    );
}

export default Pogchat;