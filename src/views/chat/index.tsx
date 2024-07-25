import { useState, useEffect } from 'react'

import { Button, Messages } from '../../components'

import './styles.css'
import sun from '../../assets/sun.svg'
import moon from '../../assets/moon.svg'
import menu from '../../assets/menu.svg'
import menuDark from '../../assets/menu-dark.svg'

import Cookies from 'js-cookie';  
import check from '../../api/checkconnection';

const Chat = ({
  dark,
  username,
  sending,
  message,
  messages,
  setMessage,
  onTheme,
  onSend,
  suggestions,
  setUseModel,
  useModel
}: any) => {
  const [showUsers, setShowUsers] = useState<boolean>(false)
  const [connectionOpen, setConnection] = useState<boolean>(false)

  const Signout = () => {
    Cookies.remove('apiKey');
    window.location.reload();
  }

  useEffect(() => {
    let retryCount = 0;

    const fetchData = async () => {
      try {
        let response = await check();

        if(response && response.status === 200 && response.data)
        {
          if(response.data.Data)
          {
            setConnection(true);
          }
          else 
          {
            setTimeout(() => {
              fetchData();
            }, 15000);
            
            retryCount++;
          }
        }
      } catch {
        setConnection(false);

        if (retryCount < 3) {
          setTimeout(() => {
            fetchData();
          }, 15000);
          retryCount++;
        }
        else {
          console.log("Connection failed, wait a moment and try again.");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chat__wrapper">
      <div className="chat__container">
        <div className="chat__header">
          <div className="chat__menu" onClick={() => setShowUsers(!showUsers)}>
            <img src={dark ? menuDark : menu} alt="menu" />
          </div>
          <div className={`${connectionOpen ? 'chat__connection-open' : 'chat__connection-close'}`} title={connectionOpen ? 'Ready to use' : 'Wait for connection start'}>
          </div>
          <div title={username} className="chat__name">
            Chatapp
          </div>
          <div style={{ flexGrow: 1 }}></div>
          <div className="chat__actions">
            <div
              className="chat__theme"
              onClick={() => onTheme && onTheme(!dark)}
            >
              <img src={dark ? sun : moon} alt="theme" />
            </div>
            <Button onClick={Signout}>LEAVE</Button>
          </div>
        </div>
        <div className="chat__body">
          <div className="chat__messages">
            <Messages
              dark={dark}
              name={username}
              onSend={onSend}
              message={message}
              messages={messages}
              setMessage={setMessage}
              sending={sending}
              suggestions={suggestions}
              setUseModel={setUseModel}
              useModel={useModel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
