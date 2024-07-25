import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import login from '../api/login';
import check from '../api/checkApiValid';
import getmessages from '../api/getListMessage';
import sendMessageFn from '../api/sendMessage';
import { Join, Chat } from '../views';
import { Alert } from '../components';
import {
  darkCSSVariables,
  lightCSSVariables,
  overrideThemeVariables,
} from '../util';
import Cookies from 'js-cookie';

import './styles.css';
import axios from 'axios';

const alert = require('../assets/alert.wav');
const audio = new Audio(alert.default);

const URL = '/';
let socket = io(URL, { transports: ['websocket'] });

const App = () => {
  const [username, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [dark, setDark] = useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [useModel, setUseModel] = useState<any>([]);

  const suggestions = [
    {
      "name":"llama", 
      "desc":"là model gốc từ nhà phát triển Ollama model này chứa 7B tham số bao gồm tiếng Việt"
    },
    {
      "name":"custom llama", 
      "desc":"dựa trên model llama nhưng được fine-tune trên dữ liệu tiếng Việt với 120k câu liên quan đến luật nói chung"
    },
    {
      "name":"open text generater", 
      "desc":"sử dụng model Gemini của Google nhưng được tuned lại để phù hợp với ngữ cảnh câu hỏi"
    }
  ];

  const Login = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      if (response.data.StatusCode === 200) {
        if(
          !response.data.Data["APIKey"] ||
          !response.data.Data["ExpiredTime"]
        ) {
          setAlertMessage('Login failed. Please check your credentials and try again.');
          setShowAlert(true);
          return;
        }
        else if (response.data.Data["ExpiredTime"] < new Date().getTime()) {
          setAlertMessage('Login failed. Your API key has expired.');
          setShowAlert(true);
          return;
        } else {
          Cookies.set('apiKey', response.data.Data["APIKey"], { expires: 1 });
          setJoined(true);
          setAlertMessage('Login successful.');
          setShowAlert(true);
          return
        }
        
      } else if(response.data.Message.toLowerCase().includes('sql')) {
        setAlertMessage('Database be loading... Try again later!');
        setShowAlert(true);
        reset();
        return;
      } else {
        setAlertMessage('Login failed. Please check your credentials and try again.');
        setShowAlert(true);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data);
        setAlertMessage('Login failed. Please check your credentials and try again.');
      } else {
        console.error('An unexpected error occurred:', error);
        setAlertMessage('An unexpected error occurred. Please try again.');
      }
      setShowAlert(true);
      reset();
      return;
    }
  };

  useEffect(() => {
    const Check = async () => {
      try {
        const response = await check();

        if (response && response.status === 200) {
          if(response.data.StatusCode === 200) {
            setJoined(true);
            setName(response.data.Data.UserName || '');
          }
          else if(response.data.StatusCode === -99) {
            setAlertMessage('API key not found');
            setShowAlert(true);
          }
          
        }
        else {
          setAlertMessage('API key is invalid. Please login again.');
          setShowAlert(true);
          reset();
        }
      } catch{
        reset();
      }
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);

        const now = new Date();
    
    
        // Extract time
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
    
        // Calculate the difference in days
        const timeDifference = now.getTime() - date.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference === 0) {
            return timeString;
        } else if (daysDifference === 1) {
            return `Yesterday, ${timeString}`;
        } else if (daysDifference >= 2 && daysDifference <= 7) {
            return `${daysDifference} days ago, ${timeString}`;
        } else {
            const weeksDifference = Math.floor(daysDifference / 7);
            const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'long' });
            return `${dayOfWeek}, ${weeksDifference} weeks ago, ${timeString}`;
        }
    };

    const transformMessage = (message: any) => ({
      text: message.Message,
      timestamp: formatDate(message.CreatedAt),
      user: message.Sender.toLowerCase() === "system" ? "system" : message.Sender
    });

    const GetMessages = async () => {
      try {
        const response = await getmessages();
    
        if (response.status === 200 && response.data.Data !== null) {
          const transformedMessages = response.data.Data.map(transformMessage);
          setMessages(transformedMessages);
        } 
        else if(
                  response.status === 200 && response.data.StatusCode === -99 && 
                  response.data.Message === "Not exist data"
        ) {

          setTimeout(() => {
            setMessages([{ 
              text: 'Send a first message 👇👇👇', 
              timestamp:'Welcome to chat app', 
              user: 'ADMIN'
            }]);

          }, 2000);

        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if(joined===false){
      Check();
    } else {
      GetMessages();
    }

    socket.on('leave', ({ error, devMessage }) => {
      console.error({ error, devMessage });
      reset();
    });

    handleTheme(localStorage.getItem('dark') === 'true');

  }, [joined]);

  const reset = () => {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach(cookie => {
      Cookies.remove(cookie);
    });
    setAlertMessage('');
    setShowAlert(false);
    setJoined(false);
    setMessages([]);
    setMessage('');
    setApiKey('');
    setName('');
    setPassword('');
  };

  const handleTheme = (value: boolean) => {
    localStorage.setItem('dark', String(value));
    setDark(value);
    overrideThemeVariables(value ? darkCSSVariables : lightCSSVariables);
  };

  const sendMessage = async (event: any) => {
    if (event) {
      event.preventDefault();
    }
    if (message) {
      try {
        let myMessage = {
          text: message,
          timestamp: new Date().toTimeString().slice(0, 5),
          user: username
        }

        if(messages.length === 1 && messages[0].user === 'ADMIN') {
          setMessages([myMessage]);
        }
        else {
          setMessages((messages) => [...messages, myMessage]);
        }

        setMessage('');

        setSending(true);

        const response = await sendMessageFn(myMessage.text, useModel.name);

        setSending(false);

        if (response.status === 200) {

          let newMessage = response.data.Data;

          audio.play();

          if(newMessage) {
            newMessage = {
              text: newMessage.Message,
              timestamp: new Date(newMessage.CreatedAt).getTime(),
              user: newMessage.Sender
            }
            
            setMessages((messages) => [...messages, newMessage]);
          }
        } else {
          setAlertMessage('Error sending message. Please try again.');
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }


  const onJoin = ({ username, password }: any) => {
    setName(username);
    setPassword(password);
    Login(username, password);
    socket.emit('join', { username, password }, (error: any) => {
      if (error) {
        setAlertMessage(error);
        setShowAlert(true);
        return;
      }
      setJoined(true);
    });
  };

  return (
    <div className="app">
      <Alert
        dark={dark}
        show={showAlert}
        message={alertMessage}
        onChange={(value: boolean) => setShowAlert(value)}
      />
      {joined ? (
        <Chat
          dark={dark}
          username={username}
          password={password}
          apiKey={apiKey}
          message={message}
          messages={messages}
          onSend={sendMessage}
          onTheme={handleTheme}
          setMessage={setMessage}
          sending={sending}
          suggestions={suggestions}
          useModel={useModel}
          setUseModel={setUseModel}
        />
      ) : (
        <Join onJoin={onJoin} />
      )}
    </div>
  );
};

export default App;
