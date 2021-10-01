import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
import {getStreamInfo} from "./utils";
import PogApi from "./api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowLeft);

const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jGqsfG ksFrFH";

function PogTopicCreation({closeCallback}) {

    const [streamName, setStreamName] = useState(null)
    const [streamId, setStreamId] = useState(null)
    const [category, setCategory] = useState(null)
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)

    useEffect(() => {
        // On initial load, populate the topic and stream
        async function fetchStreamInfo() {
            const {streamName, streamId, category} = await getStreamInfo()
            setStreamName(streamName)
            setStreamId((streamId))
            setCategory(category)
        }
        fetchStreamInfo()
    }, [])

    const createTopic = useCallback(() => {
        PogApi.createTopic(
            title, description, category, streamId
        ).then(() => {
            closeCallback(true)
        })
    }, [title, description, category, streamId])

    return (
        <div>

            <div className="Pogchat-Header">
                <FontAwesomeIcon className="Pogchat-BackButton" onClick={() => closeCallback()} icon="arrow-left" /> Create New Topic
            </div>

            <div style={{marginBottom: 8}}>
                Creating inside of <span className="Pogchat-StreamName">{streamName}</span> and <span className="Pogchat-Category">{category}</span>
            </div>

            <div className="Pogchat-TextInput-Label">Title</div>
            <input className="Pogchat-TextInput" style={{width: "100%"}} onChange={(e) => setTitle(e.target.value)}/><br />

            <div className="Pogchat-TextInput-Label">Description</div>
            <textarea className="Pogchat-TextInput" style={{width: "100%", height: 300}} onChange={(e) => setDescription(e.target.value)}/>

            <div>
                <button style={{padding: 16, float: 'right'}} className={BUTTON_CLASSES} onClick={() => createTopic()}>
                    Create Topic
                </button>
            </div>


        </div>
    )

}

export default PogTopicCreation;