/*global chrome*/
import React, { useState, useEffect } from 'react';
import '../App.css';
import moment from 'moment';

function PogMessage({message}) {

    let colorStyle = {}
    if (message.user.chatColor) {
        colorStyle = {'color': message.user.chatColor}
    }

    return (
        <div className="Pogchat-Message">
            <b style={{fontWeight: 700, ...colorStyle}}>{message.user.lastKnownDisplayName}: </b>{message.content}
        </div>
    )

}

export default PogMessage;