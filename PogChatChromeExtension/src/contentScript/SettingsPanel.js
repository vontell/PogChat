import React, {useCallback, useState} from "react";
import '../App.css';
import {BUTTON_CLASSES} from './utils';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PogApi from "./api";
import { SwatchesPicker } from 'react-color';


function SettingsPanel({userInfo, closeCallback, logoutCallback}) {

    console.log(userInfo)

    const [color, setColor] = useState(userInfo.user.chatColor || '#fff');

    console.log(color)

    const saveSettings = useCallback((newColor) => {
        PogApi.updateUserColor(newColor).then(() => {
            userInfo['user']['chatColor'] = newColor;
        })
    }, [color])

    return (
        <div>

            <div className="Pogchat-Header">
                <FontAwesomeIcon className="Pogchat-BackButton" onClick={() => closeCallback()} icon="arrow-left" /> Settings
            </div>

            <div>
                <b style={{color: color, fontWeight: 700, marginBottom: 16, marginTop: 16}}>Chat Color</b><br />
                <SwatchesPicker
                    color={color}
                    onChangeComplete={(color, ev) => {
                        setColor(color.hex)
                        saveSettings(color.hex)
                    }}
                /><br />
            </div><br />

            <button style={{padding: 16, marginTop: 16}} className={BUTTON_CLASSES} onClick={logoutCallback} >
                Log Out
            </button>


        </div>
    )

}

export default SettingsPanel;