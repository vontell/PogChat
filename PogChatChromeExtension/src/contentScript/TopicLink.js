/*global chrome*/
import React from 'react';
import '../App.css';
import moment from 'moment';

function TopicLink({topic, onTopicClicked}) {

    return (
        <div className="Pogchat-TopicLink" onClick={() => onTopicClicked(topic)}>
            <div>
                <div className="Pogchat-TopicLink-Title"><span style={{whiteSpace: 'break-spaces'}}>{topic.title}</span></div>
                <div>
                    <div className="Pogchat-TopicLink-Author">{topic.user.lastKnownDisplayName}</div>
                    <div className="Pogchat-TopicLink-Date">{moment(topic.created_at).fromNow()}</div>
                </div>
            </div>
        </div>
    )

}

export default TopicLink;