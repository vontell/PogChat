/*global chrome*/
import React, { useState, useEffect } from 'react';
import '../App.css';
import moment from 'moment';

function PogMessage({message}) {

    return (
        <div className="Pogchat-Message">
            <b style={{fontWeight: 700}}>{message.user.lastKnownDisplayName}: </b>{message.content}
        </div>
    )

}

export default PogMessage;