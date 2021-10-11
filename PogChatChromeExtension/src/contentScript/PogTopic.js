import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
import {getStreamInfo, useInterval} from "./utils";
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


    return (
        <div>

            <div className="Pogchat-Header">
                <FontAwesomeIcon className="Pogchat-BackButton" onClick={() => onClose()} icon="arrow-left" /> {topic.title}
            </div>

            <div style={{marginBottom: 8}}>
                <span className="Pogchat-StreamName">{topic.stream}</span> - <span className="Pogchat-Category">{topic.category}</span>
            </div>

            <div className="Pogchat-Message-Container">
                {messages.map((item) => {
                    return <PogMessage message={item} />
                })}
            </div>

            <div className="Pogchat-Chat-Input">
                <textarea data-a-target="chat-input" data-test-selector="chat-input" aria-label="Send a message"
                          className="ScInputBase-sc-1wz0osy-0 ScTextArea-sc-1ywwys8-0 kYJGMC InjectLayout-sc-588ddc-0 iZLAMf tw-textarea tw-textarea--no-resize"
                          autoComplete="pog-chat" maxLength="500" placeholder="Send a message" rows="1"
                          style={{
                              paddingRight: '6.5rem',
                              paddingLeft: '3.8rem',
                              width: 'calc(100% - 100px)',
                              display: 'inline'
                          }}
                          value={message}
                          onChange={(ev) => {
                              setMessage(ev.target.value)
                          }}
                />
                <button style={{padding: 16, float: 'right', marginRight: '16px'}} className={BUTTON_CLASSES} onClick={createMessage} >
                    Send
                </button>
            </div>


        </div>
    )

}

export default PogTopic;