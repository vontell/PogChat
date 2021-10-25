import React, {useRef, useState} from "react";
import TopicLink from "./TopicLink";

function scrollSidewaysWhenWheel(e, ref) {
    if (Math.abs(e.deltaX) <= 2) {
        ref.current.scrollLeft += e.deltaY;
    }
}

function TopicList({topicList, title, emptyImage, emptyAlt, emptyText, onTopicClicked, colorVariant}) {

    const scrollerRef = useRef()

    return (
        <div>
            <div className="Pogchat-TopicLink-Header">
                {title}
            </div>
            {topicList.length === 0 &&
            <div className="Pogchat-Empty-Topic">
                {/* TODO: ADD CORRECT PICTURE HERE! */}
                <img style={{height: '64px'}} src={emptyImage} alt={emptyAlt}/>
                <p>{emptyText}</p>
            </div>
            }
            <div className="Pogchat-TopicLink-Container hide-scrollbar" ref={scrollerRef} onWheel={(e) => scrollSidewaysWhenWheel(e, scrollerRef)}>
                {topicList && topicList.map((item) => {
                    return (<TopicLink topic={item} onTopicClicked={onTopicClicked} colorVariant={colorVariant}/>)
                })}
            </div>
        </div>
    )

}

export default TopicList;