// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
import ReactDOM from "react-dom";
import React from "react";
import Pogchat from "./Pogchat";

const CHAT_CONTAINER_SEL = "section[data-test-selector='chat-room-component-layout']";
const CHAT_HEADER_SEL = "h4[data-test-selector='chat-room-header-label']";
const BUTTON_CLASSES = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 jGqsfG ksFrFH";

waitToAttachPogchat();

// Waits until the Twitch page loads, and then attaches the PogChat
export function waitToAttachPogchat() {

  let chatContainer = document.body.querySelector(CHAT_CONTAINER_SEL);
  if (!chatContainer) {
    setTimeout(waitToAttachPogchat, 1000)
  } else {
    attachButtonSwitchers()
    mountReactPogger()
  }

}

export function attachButtonSwitchers() {
  // First, we grab the "STREAM CHAT" header
  let chatHeader = document.body.querySelector(CHAT_HEADER_SEL)
  let chatContainer = document.body.querySelector(CHAT_CONTAINER_SEL)
  const originalChatDisplay = chatContainer.style.display

  // Create the container for the pogchat, but hide it
  const pogChatContainer = document.createElement("div")
  pogChatContainer.id = 'pogchat-container';
  chatContainer.parentNode.appendChild(pogChatContainer);
  const originalPogChatDisplay = pogChatContainer.style.display;
  pogChatContainer.style.setProperty('display', 'none', 'important');
  pogChatContainer.style.setProperty('height', '100%');
  pogChatContainer.id = "pogchat-container";

  // Construct the normal chat button
  const chatButton = document.createElement("button")
  chatButton.className = BUTTON_CLASSES;
  chatButton.innerHTML = "Twitch Chat";
  chatButton.style.padding = '16px';

  // Construct the Pog Chat button
  const pogButton = document.createElement("button")
  pogButton.className = BUTTON_CLASSES;
  pogButton.innerHTML = "PogChat";
  pogButton.style.padding = '16px';
  pogButton.style.backgroundColor = '#ED2938';
  pogButton.style.marginLeft = '12px';
  pogButton.onmouseenter = () => {
    pogButton.style.backgroundColor = '#c22a37';
  }
  pogButton.onmouseleave = () => {
    pogButton.style.backgroundColor = '#ED2938';
  }
  pogButton.onclick = () => {
    console.log("PRO CHAT CLICKED")
    chatContainer.style.setProperty('display', 'none', 'important');
    pogChatContainer.style.display = originalPogChatDisplay;
  }
  chatButton.onclick = () => {
    console.log("NORMAL CHAT CLICKED")
    pogChatContainer.style.setProperty('display', 'none', 'important');
    chatContainer.style.display = originalChatDisplay;
  }

  // Construct the Div to hold the two
  const buttonContainer = document.createElement("div")
  buttonContainer.style.display = 'inline'
  buttonContainer.appendChild(chatButton);
  buttonContainer.appendChild(pogButton);

  chatHeader.parentNode.replaceChild(buttonContainer, chatHeader)
}

export function mountReactPogger() {
  ReactDOM.render(
      <React.StrictMode>
        <Pogchat />
      </React.StrictMode>,
      document.getElementById("pogchat-container")
  );
}

export function attachLogout() {

}


