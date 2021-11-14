import React, {useState, useEffect, useCallback, useRef} from 'react';
import '../App.css';
import {getStreamInfo, typeAndSwitchToChat, useInterval} from "./utils";
import PogApi from "./api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PogMessage from "./PogMessage";
import PacmanLoader from "react-spinners/PacmanLoader";

library.add(faArrowLeft);

const CHAT_REFRESH_RATE = 2500

const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jGqsfG ksFrFH";

function PogTopic({topic, onClose}) {

    const [message, setMessage] = useState(null);
    const [messages, setMessages] = useState([])
    const [inputHovered, setInputHovered] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [isFreeScrolling, setIsFreeScrolling] = useState(false);
    const [isLoadingInitially, setIsLoadingInitially] = useState(true);

    const messagesContainer = useRef();

    let createMessage = useCallback(() => {
        let originalMessage = message;
        setMessage('');
        PogApi.createMessage(topic.id, message)
            .then((resp) => {
                setMessages(messages.concat(resp.data));
            })
            .catch(() => {
                setMessage(originalMessage);
            })
    }, [message])


    useEffect(() => {
        PogApi.getMessages(topic.id)
            .then((resp) => {
                setIsLoadingInitially(false)
                setMessages(resp.data)
                if (!isFreeScrolling) {
                    messagesContainer.current.scrollTop =
                        messagesContainer.current.scrollHeight - messagesContainer.current.clientHeight;
                }
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
                if (!isFreeScrolling) {
                    messagesContainer.current.scrollTop =
                        messagesContainer.current.scrollHeight - messagesContainer.current.clientHeight;
                }
            })
    }, CHAT_REFRESH_RATE)

    let handleMessagesScroll = useCallback((ev) => {
        let element = ev.target;
        // If scrolled to bottom...
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            setIsFreeScrolling(false);
        } else {
            setIsFreeScrolling(true);
        }
    }, [])

    let inputIsActive = inputFocused || inputHovered;

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>

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

            {isLoadingInitially &&
                <div style={{marginTop: 64}}>
                    <div style={{marginLeft: 100}}>
                        <PacmanLoader color={'#9147ff'} loading={true} />
                    </div><br />
                    <div style={{textAlign: 'center', fontStyle: 'italic', marginTop: 48}}>
                        Loading messages...
                    </div>
                </div>
            }

            <div style={{marginBottom: 16, flexGrow: 1}}>
                <div className="Pogchat-Message-Container" ref={messagesContainer} onScroll={handleMessagesScroll}>
                    {messages.map((item) => {
                        return <PogMessage message={item} />
                    })}
                </div>
            </div>

            <div className="Pogchat-Input-Container">
                <div className="Pogchat-Input-TextArea-Container"
                     onFocus={() => setInputFocused(true)}
                     onBlur={() => setInputFocused(false)}
                     onMouseEnter={() => setInputHovered(true)}
                     onMouseLeave={() => setInputHovered(true)}
                     style={{border: inputIsActive ? '2px solid #afafaf' : '2px solid #dbdbdb'}}>
                    <textarea aria-label="Send a message"
                              autoComplete="pog-chat" maxLength="500" placeholder="Send a message" rows="1"
                              style={{
                                  color: 'black',
                                  border: 'none',
                                  overflow: 'auto',
                                  outline: 'none',
                                  resize: 'none',
                                  backgroundColor: 'transparent',
                                  padding: 4,
                                  height: '100%',
                                  width: '100%',
                                  fontFamily: 'inherit'
                              }}
                              value={message}
                              onChange={(ev) => {
                                  setMessage(ev.target.value)
                              }}
                              onKeyDown={(e) => {
                                  if (e.code === "Enter") {
                                      e.preventDefault();
                                      createMessage();
                                  }
                              }}
                    />
                </div>
                <div className="Pogchat-Button-Container">
                    <button style={{padding: 16, float: 'right', height: "100%"}} className={BUTTON_CLASSES} onClick={createMessage} >
                        Send
                    </button>
                </div>
            </div>

        </div>
    )

}

export default PogTopic;