/*global chrome*/
import React, {useState} from 'react';
import '../App.css';
import moment from 'moment';

const COLOR_VARIANTS = {
    PURPLE: {
        backgroundColor: "#9147ff",
        "&:hover": {
            background: "#772ce8"
        }
    },
    BLUE: {
        backgroundColor: "#476fff",
        "&:hover": {
            background: "#395ddd"
        }
    },
    RED: {
        backgroundColor: "#e94e4e",
        "&:hover": {
            background: "#d14141"
        }
    },
    GREEN: {
        backgroundColor: "#1c9d55",
        "&:hover": {
            background: "#168748"
        }
    }
}

function TopicLink({topic, onTopicClicked, colorVariant}) {

    const [hovered, setHovered] = useState(false);

    return (
        <div className="Pogchat-TopicLink"
             onClick={() => onTopicClicked(topic)}
             style={hovered ? COLOR_VARIANTS[colorVariant]['&:hover'] : COLOR_VARIANTS[colorVariant]}
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}
        >
            <div>
                <div className="Pogchat-TopicLink-Title"><span style={{whiteSpace: 'break-spaces'}}>{topic.title}</span></div>
                <div>
                    <div className="Pogchat-TopicLink-Author">{topic.user.lastKnownDisplayName}</div>
                    <div className="Pogchat-TopicLink-Date">{moment(topic.createdAt).fromNow()}</div>
                </div>
            </div>
        </div>
    )

}

export default TopicLink;