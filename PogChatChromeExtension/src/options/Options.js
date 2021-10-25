import logo from '../logo.png';
import './Options.css';

function Options() {
  return (
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" style={{borderRadius: '64px', width: '128px', height: '128px'}} />
              <p>
                  Go to <a href="https://twitch.tv" style={{color: 'plum'}} target="_blank">twitch.tv</a> to use <b>PogChat</b>!
                  <br /><br />
                  <b>Share <a href="http://www.pogchat.gg" style={{color: 'plum'}} target="_blank">pogchat.gg</a></b>
                  <br /><br />
                  <a href="https://nyk5y8vq03a.typeform.com/to/EduPcPhC" style={{color: 'plum', fontSize: 12}} target="_blank">Feedback</a>
              </p>
          </header>
      </div>
  );
}

export default Options;
