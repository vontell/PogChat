import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
import {getStreamInfo, typeAndSwitchToChat, useInterval} from "./utils";
import PogApi from "./api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PogMessage from "./PogMessage";

library.add(faArrowLeft);

const CHAT_REFRESH_RATE = 2500

const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jGqsfG ksFrFH";

function PogTopic({topic, onClose}) {

    const [message, setMessage] = useState(null);
    const [messages, setMessages] = useState([])
    const [inputHovered, setInputHovered] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    let createMessage = useCallback(() => {
        PogApi.createMessage(topic.id, message)
            .then((resp) => {
                setMessage(null);
                setMessages(messages.concat(resp.data));

            })
            .catch(() => {
                setMessage(null)
            })
    }, [message])


    useEffect(() => {
        PogApi.getMessages(topic.id)
            .then((resp) => {
                setMessages(resp.data)
            })
    }, [])

    // Increment view count
    useEffect(() => {
        PogApi.viewTopic(topic.id)
    }, [])

    useInterval(() => {
        PogApi.getMessages(topic.id)
            .then((resp) => {
                setMessages(resp.data)
            })
    }, CHAT_REFRESH_RATE)

    let inputIsActive = inputFocused || inputHovered;

    return (
        <div style={{height: '100%'}}>

            <div className="Pogchat-Header">
                <FontAwesomeIcon className="Pogchat-BackButton" onClick={() => onClose()} icon="arrow-left" /> {topic.title}
            </div>

            <div>
                <span className="Pogchat-StreamName">{topic.stream}</span> - <span className="Pogchat-Category">{topic.category}</span>  ({topic.viewCount} views)
            </div>

            <div>
                <p style={{fontStyle: 'italic', marginBottom: 16, cursor: 'pointer'}}
                   onClick={() => typeAndSwitchToChat(`Hey, I'm chatting about "${topic.title}" in PogChat, check it out at pogchat.gg (chat about strats, metas, teams, and more right in Twitch chat)`)}>Share this topic in Twitch Chat</p>
            </div>

            <div className="Pogchat-Message-Container">
                {messages.map((item) => {
                    return <PogMessage message={item} />
                })}
            </div>

            <div onFocus={() => setInputFocused(true)}
                 onBlur={() => setInputFocused(false)}
                 onMouseEnter={() => setInputHovered(true)}
                 onMouseLeave={() => setInputHovered(true)}
                 style={{
                     display: 'inline',
                     backgroundColor: '#dbdbdb',
                     border: inputIsActive ? '2px solid #afafaf' : '2px solid #dbdbdb',
                     borderRadius: 6,
                     transition: 'border 0.2 ease-in',
                 }}
            >
                <textarea aria-label="Send a message"
                          autoComplete="pog-chat" maxLength="500" placeholder="Send a message" rows="1"
                          style={{
                              color: 'black',
                              border: 'none',
                              overflow: 'auto',
                              outline: 'none',
                              resize: 'none',
                              backgroundColor: 'transparent',
                              padding: 4
                          }}
                          value={message}
                          onChange={(ev) => {
                              setMessage(ev.target.value)
                          }}
                />
            </div>
            <button style={{padding: 16, float: 'right', marginRight: '16px'}} className={BUTTON_CLASSES} onClick={createMessage} >
                Send
            </button>

        </div>
    )

}

export default PogTopic;