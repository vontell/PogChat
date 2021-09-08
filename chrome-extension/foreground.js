
console.log("EXECUTING FOREGROUND")
const chatHeaderSelector = "h5[data-test-selector='chat-room-header-label']";
const chatContainerSelector = "section[data-test-selector='chat-room-component-layout']";
const buttonClasses = "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 euIPFy";

let roomHeader = document.body.querySelector(chatHeaderSelector)
let chatContainer = document.body.querySelector(chatContainerSelector)
const originalChatDisplay = chatContainer.style.display

// Construct the pro chat UI
const proChatContainer = document.createElement("div")
const loginButton = document.createElement("button")
loginButton.className = buttonClasses;
loginButton.innerHTML = "Login with Twitch";
loginButton.style.padding = '16px';
proChatContainer.appendChild(loginButton);
chatContainer.parentNode.appendChild(proChatContainer);
const originalProChatDisplay = proChatContainer.style.display;
chatContainer.style.setProperty('display', 'none', 'important');
proChatContainer.style.textAlign = 'center';
loginButton.style.marginTop = '200px';

// Construct the normal chat button
const button = document.createElement("button")
button.className = buttonClasses;
button.innerHTML = "Twitch Chat";
button.style.padding = '16px';

// Construct the Pro Chat button
const proButton = document.createElement("button")
proButton.className = buttonClasses;
proButton.innerHTML = "Pro Chat";
proButton.style.padding = '16px';
proButton.style.backgroundColor = '#ED2938';
proButton.style.marginLeft = '12px';
proButton.onmouseenter = () => {
  proButton.style.backgroundColor = '#c22a37';
}
proButton.onmouseleave = () => {
  proButton.style.backgroundColor = '#ED2938';
}

proButton.onclick = () => {
  console.log("PRO CHAT CLICKED")
  chatContainer.style.setProperty('display', 'none', 'important');
  proChatContainer.style.display = originalProChatDisplay;
}

button.onclick = () => {
  console.log("NORMAL CHAT CLICKED")
  proChatContainer.style.setProperty('display', 'none', 'important');
  chatContainer.style.display = originalChatDisplay;
}

// Construct the Div to hold the two
const buttonContainer = document.createElement("div")
buttonContainer.style.display = 'inline'
buttonContainer.appendChild(button);
buttonContainer.appendChild(proButton);

roomHeader.parentNode.replaceChild(buttonContainer, roomHeader)