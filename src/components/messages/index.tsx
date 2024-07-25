  import { useLayoutEffect, useEffect, useState, useRef } from 'react'

  import TextField from '../text-field'
  import Message from '../message'
  import HintMessage from '../hint'

  import './styles.css'

  import sendIcon from '../../assets/send.svg'
  import sendDarkIcon from '../../assets/send-dark.svg'


  const Messages = ({
    suggestions,
    sending,
    dark,
    onSend,
    message,
    messages,
    setMessage,
    name,
    setUseModel,
    useModel
  }: any) => {
    const messagesRef: any = useRef(null)
    const [hint, setHint] = useState(false)

    useLayoutEffect(() => {
      if (messagesRef.current) {
        const elem: any = messagesRef.current
        elem.scrollTop = elem.scrollHeight
      }
    }, [messages, hint])


    useEffect(() => {
      if(messages.length === 1 && messages[0].user === 'ADMIN'){
        setTimeout(() => {
          setHint(true)
        }, 15000)
      }
      else {
        setHint(false)
      }
      //eslint-disable-next-line
    }, [messages])

    return (
      <div className="messages__wrapper">
        <div ref={messagesRef} className="messages__container">
          {messages.map(({ text, timestamp, user }: any, index: number) => (
            <Message
              key={index}
              user={user}
              text={text}
              name={name}
              timestamp={timestamp}
            />
          ))}
          {hint ? (
            <HintMessage
              text={"Hãy bắt đầu bằng vài câu hỏi phổ biến nè!"}
              setMessage={setMessage}
              onSend={onSend}
            />
          ) : null}
          {/* {JSON.stringify(messages.reverse())} */}
        </div>
        <TextField
          value={message}
          onIconClick={() => onSend()}
          placeholder={sending ? 'Solving...' : 'Type message here'}
          icon={dark ? sendDarkIcon : sendIcon}
          onChange={(value: string) => setMessage(value)}
          onKeyPress={(key: string) => (key === 'Enter' ? onSend() : null)}
          sending={sending}
          suggestions={suggestions}
          setUseModel={setUseModel}
          useModel={useModel}
        />
      </div>
    );
  }

  export default Messages
