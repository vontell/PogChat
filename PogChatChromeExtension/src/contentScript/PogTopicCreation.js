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

            <b>Stream:</b> {streamName}<br/>
            <b>StreamID:</b> {streamId}<br/>
            <b>Category:</b> {category}
        </div>
    )

}

export default PogTopicCreation;