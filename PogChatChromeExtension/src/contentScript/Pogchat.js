/*global chrome*/
import React, {useState, useEffect, useCallback} from 'react';
import PogTopicCreation from './PogTopicCreation';
import TopicList from "./PogTopicList";
import TopicLink from "./TopicLink";
import '../App.css';
import {getStreamInfo} from "./utils";
import PogApi from "./api";
import {BASE_URL} from "./api";
import PogTopic from "./PogTopic";
import SettingsPanel from "./SettingsPanel";
import { typeAndSwitchToChat } from "./utils"
import PacmanLoader from "react-spinners/PacmanLoader";

import logo from '../logo.png';
import PogTopicList from "./PogTopicList";

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
    const [popularTopics, setPopularTopics] = useState([]);
    const [participatingTopics, setParticipatingTopics] = useState([]);

    const [selectedTopic, setSelectedTopic] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

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
            fetch(`${BASE_URL}/auth`, {
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

    let downloadTopics = useCallback(() => {
        setIsLoading(true);
        async function fetchData(streamOnly) {
            if (!userInfo || ! streamInfo) {
                return;
            }
            console.log("GETTING TOPICS")
            const {streamId, category} = streamInfo;
            console.log(`CONTEXT: ${streamId} - ${category}`)
            PogApi.getStartingTopics(streamId, category)
                .then((data) => {
                    let topics = data.data;
                    console.log("STARTUP TOPICS")
                    console.log(topics);
                    setStreamTopics(topics.streamTopics);
                    setParticipatingTopics(topics.participantTopics)
                    setCategoryTopics(topics.categoryTopics)
                    setPopularTopics(topics.popularTopics)
                }).finally(() => {
                    setIsLoading(false);
            })
        }
        fetchData()
    }, [userInfo, streamInfo])

    // Fetch startup topics
    useEffect(() => {
        downloadTopics()
    }, [userInfo, streamInfo])

    let logout = useCallback(() => {
        chrome.storage.sync.clear(() => {setUserInfo(null)})
    }, [])

    let onLoginClicked = () => {
        let uuid = uuidv4();
        const authLink = `https://id.twitch.tv/oauth2/authorize\n?client_id=mbiftzplnzsllgon3p5gqkbke8rkyy&redirect_uri=${BASE_URL}/auth&response_type=code&scope=user:read:email&state=${uuid}`
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
        <div style={{padding: 16, height: '100%'}} className="hide-scrollbar">
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
                {isLoading &&
                    <div style={{marginTop: 64}}>
                        <div style={{marginLeft: 100}}>
                            <PacmanLoader color={'#9147ff'} loading={true} />
                        </div><br />
                        <div style={{textAlign: 'center', fontStyle: 'italic', marginTop: 48}}>
                            Loading some cool stuff
                        </div>
                    </div>
                }
                {!isLoading &&
                    <div>
                        {streamInfo &&
                        <TopicList
                            topicList={streamTopics}
                            title={(<div>Recent topics in <span className="Pogchat-StreamName">{streamInfo.streamName}</span></div>)}
                            emptyImage="https://www.streamscheme.com/wp-content/uploads/2020/04/resident-sleeper.png"
                            emptyAlt="Resident sleeper: no topics created yet"
                            emptyText="No topics created :( add one below!"
                            onTopicClicked={onTopicClicked}
                            colorVariant="PURPLE"
                        />
                        }
                        {streamInfo &&
                        <TopicList
                            topicList={categoryTopics}
                            title={(<div>Recent topics in <span className="Pogchat-Category">{streamInfo.category}</span></div>)}
                            emptyImage="https://www.pngkey.com/png/full/66-661421_jackie-chan-wtf-meme-jackie-chan.png"
                            emptyAlt="Jackie chan what: no topics created yet"
                            emptyText="No topics created :( add one below!"
                            onTopicClicked={onTopicClicked}
                            colorVariant="GREEN"
                        />
                        }
                        {streamInfo &&
                        <TopicList
                            topicList={popularTopics}
                            title="Popular Topics on Twitch"
                            emptyImage="https://www.pngkey.com/png/full/66-661421_jackie-chan-wtf-meme-jackie-chan.png"
                            emptyAlt="Jackie chan what: no topics created yet"
                            emptyText="No topics created :( add one below!"
                            onTopicClicked={onTopicClicked}
                            colorVariant="BLUE"
                        />
                        }
                        {streamInfo &&
                        <TopicList
                            topicList={participatingTopics}
                            title="Topics You're Participating In"
                            emptyImage={logo}
                            emptyAlt="The PogChat logo"
                            emptyText="You have no topics or messages! Post a message."
                            onTopicClicked={onTopicClicked}
                            colorVariant="RED"
                        />
                        }
                        <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={() => setCurrentState('create-topic')} >
                            Create Topic
                        </button>
                        <div className="Pogchat-Bottom-Buttons">
                            <button style={{padding: 16, marginRight: '8px'}} className={BUTTON_CLASSES} onClick={() => typeAndSwitchToChat("Chat about meta, teams, and more right in Twitch chat using PogChat. Download at pogchat.gg")}>
                                Share PogChat!
                            </button>
                            <button style={{padding: 16}} className={BUTTON_CLASSES} onClick={() => setCurrentState('settings')} >
                                Settings
                            </button>
                        </div>
                    </div>
                }
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
            {userInfo && currentState === 'settings' &&
                <SettingsPanel closeCallback={() => setCurrentState(null)} userInfo={userInfo} logoutCallback={logout}/>
            }

        </div>
    );
}

export default Pogchat;