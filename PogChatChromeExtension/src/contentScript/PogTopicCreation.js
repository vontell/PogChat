import React, { useState, useEffect } from 'react';
import '../App.css';

function PogTopicCreation() {

    const [streamName, setStreamName] = useState(null)
    const [streamId, setStreamId] = useState(null)
    const [category, setCategory] = useState(null)

    useEffect(() => {
        // On initial load, populate the topic and stream
        let streamName = document.querySelector('.channel-info-content h1').innerText;
        let path = window.location.pathname;
        let parts = path.split('/');
        let streamId = parts.pop() || parts.pop();  // handle potential trailing slash
        let category = document.querySelector('[data-a-target=stream-game-link]').innerText;
        setStreamName(streamName)
        setStreamId((streamId))
        setCategory(category)
    }, [])

    return (
        <div>
            <div className="Pogchat-Header">
                Create New Topic
            </div><br/>

            <div>
                Creating inside of <span style={{color: "#9307cc"}}>{streamName}</span> and <span style={{color: "#ff5300"}}>{category}</span>
            </div><br />

            <div className="Pogchat-TextInput-Label">Title</div>
            <input className="Pogchat-TextInput" style={{width: "100%"}}/><br />

            <div className="Pogchat-TextInput-Label">Description</div>
            <textarea className="Pogchat-TextInput" style={{width: "100%", height: 300}}/>

        </div>
    )

}

export default PogTopicCreation;