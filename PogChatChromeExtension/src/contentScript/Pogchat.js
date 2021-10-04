/*global chrome*/
import React, {useState, useEffect, useCallback} from 'react';
import PogTopicCreation from './PogTopicCreation';
import TopicLink from "./TopicLink";
import '../App.css';
import {getStreamInfo} from "./utils";
import PogApi from "./api";
import PogTopic from "./PogTopic";

const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jGqsfG ksFrFH";

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
    const [streamInfo, setStreamInfo] = useState(null);
    const [streamTopics, setStreamTopics] = useState([]);
    const [categoryTopics, setCategoryTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);

    // Determine if already logged in
    useEffect(() => {
        chrome.storage.sync.get("info", (data) => {
            setUserInfo(data.info)
        });
    }, [])

    useEffect(() => {
        async function fetchStreamInfo() {
            setStreamInfo(await getStreamInfo());
        }
        fetchStreamInfo()
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

    // Populate initial topic information for STREAM
    useEffect(() => {
        async function fetchData() {
            if (!userInfo || ! streamInfo) {
                return;
            }
            console.log("GETTING TOPICS")
            const {streamId, category} = streamInfo;
            console.log(`CONTEXT: ${streamId} - ${category}`)
            PogApi.getTopics(streamId, category)
                .then((data) => {
                    let topics = data.data;
                    console.log(topics);
                    setStreamTopics(topics);
                })
        }
        fetchData()
    }, [userInfo, streamInfo])

    // Populate initial topic information for GAME
    useEffect(() => {
        async function fetchData() {
            if (!userInfo || ! streamInfo) {
                return;
            }
            const {streamId, category} = streamInfo;
            PogApi.getTopics(null, category)
                .then((data) => {
                    let topics = data.data;
                    console.log(topics);
                    setCategoryTopics(topics);
                })
        }
        fetchData()
    }, [userInfo, streamInfo])

    let downloadTopics = useCallback(() => {
        async function fetchData(streamOnly) {
            if (!userInfo || ! streamInfo) {
                return;
            }
            const {streamId, category} = streamInfo;
            if (streamOnly) {
                PogApi.getTopics(streamId, category)
                    .then((data) => {
                        let topics = data.data;
                        console.log(topics);
                        setStreamTopics(topics);
                    })
            } else {
                PogApi.getTopics(null, category)
                    .then((data) => {
                        let topics = data.data;
                        console.log(topics);
                        setCategoryTopics(topics);
                    })
            }

        }
        fetchData(true)
        fetchData(false)
    }, [userInfo, streamInfo])

    let onLoginClicked = () => {
        let uuid = uuidv4();
        const authLink = `https://id.twitch.tv/oauth2/authorize\n?client_id=mbiftzplnzsllgon3p5gqkbke8rkyy&redirect_uri=http://localhost:8080/auth&response_type=code&scope=user:read:email&state=${uuid}`
        setWaitUUID(uuid);
        window.open(authLink, '_blank').focus();
    }

    let onTopicClicked = useCallback((topic) => {
        setCurrentState('viewing-topic')
        setSelectedTopic(topic)
    }, [])

    let onTopicClosed = useCallback(() => {
        setCurrentState(null)
        setSelectedTopic(null)
    }, [])

    console.log(userInfo)
    console.log(currentState)

    return (
        <div style={{padding: 16, height: '100%'}}>
            {!userInfo &&
                <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={onLoginClicked} >
                    Login with Twitch
                </button>
            }
            {userInfo && currentState == null &&
            <div style={{height: '100%'}}>
                <div style={{fontWeight: 'bold', fontSize: 14}}>
                    Welcome to Pogchat, {userInfo.user.lastKnownDisplayName}!
                </div><br />
                {streamInfo &&
                    <div>
                        <div className="Pogchat-TopicLink-Header">
                            Recent topics in <span className="Pogchat-StreamName">{streamInfo.streamName}</span>
                        </div>
                        {streamTopics.length === 0 &&
                            <div className="Pogchat-Empty-Topic">
                                <img style={{height: '64px'}} src="https://www.streamscheme.com/wp-content/uploads/2020/04/resident-sleeper.png" alt="Resident sleeper: no topics created yet"/>
                                <p>No topics created :( add one below!</p>
                            </div>
                        }
                        <div className="Pogchat-TopicLink-Container">
                            {streamTopics && streamTopics.map((item) => {
                                return (<TopicLink topic={item} onTopicClicked={onTopicClicked}/>)
                            })}
                        </div>
                    </div>
                }
                {streamInfo &&
                <div>
                    <div className="Pogchat-TopicLink-Header">
                        Recent topics in <span className="Pogchat-Category">{streamInfo.category}</span>
                    </div>
                    { categoryTopics.length === 0 &&
                        <div className="Pogchat-Empty-Topic">
                            <img style={{height: '64px'}} src="https://www.pngkey.com/png/full/66-661421_jackie-chan-wtf-meme-jackie-chan.png" alt="Jackie chan what: no topics created yet"/>
                            <p>No topics created :( add one below!</p>
                        </div>
                    }
                    <div className="Pogchat-TopicLink-Container">
                        {categoryTopics && categoryTopics.map((item) => {
                            return (<TopicLink topic={item} onTopicClicked={onTopicClicked}/>)
                        })}
                    </div>
                </div>
                }
                <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={() => setCurrentState('create-topic')} >
                    Create Topic
                </button>
                <div className="Pogchat-Bottom-Buttons">
                    <button style={{padding: 16, marginRight: '8px'}} className={BUTTON_CLASSES} >
                        Share PogChat!
                    </button>
                    <button style={{padding: 16}} className={BUTTON_CLASSES} >
                        Settings
                    </button>
                </div>
            </div>
            }
            {userInfo && currentState === 'create-topic' &&
                <PogTopicCreation closeCallback={(shouldRefresh) => {
                    if (shouldRefresh) {
                        downloadTopics()
                    }
                    setCurrentState(null)
                }}/>
            }
            {userInfo && currentState === 'viewing-topic' && selectedTopic &&
                <PogTopic topic={selectedTopic} onClose={onTopicClosed}/>
            }

        </div>
    );
}

export default Pogchat;