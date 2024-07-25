import Avatar from '../avatar'

import './styles.css'

const Message = ({ name, text, timestamp, user }: any) => {
  const isCurrentUser = () => user.toLowerCase() === name.toLowerCase()

  const isBot = () => user.toLowerCase() === 'bot' || user.toLowerCase() === 'system'

  const time = () => {
    // const date = new Date(timestamp)

    // const normalizeDigit = (digit: number) => `${digit < 10 ? '0' : ''}${digit}`

    return timestamp
  }

  //formatting text base on text format
  const formatText = (text:string) => {
    let result = '';
    let stack = [];
    let i = 0;

    while (i < text.length) {
      if (text[i] === '*' && text[i + 1] === '*') {
        if (stack.length > 0 && stack[stack.length - 1] === '**') {
          result += '</b>';
          stack.pop();
          i += 2;
        } else {
          result += '<b>';
          stack.push('**');
          i += 2;
        }
      } else if (text[i] === '*') {
        if (stack.length > 0 && stack[stack.length - 1] === '*') {
          result += '</i>';
          stack.pop();
          i += 1;
        } else {
          result += '<i>';
          stack.push('*');
          i += 1;
        }
      } else {
        result += text[i];
        i += 1;
    }
  }
  while (stack.length > 0) {
    const tag = stack.pop();
    result += tag === '**' ? '</b>' : '</i>';
  }

  return result;
};

  return (
    <div
      className={`message__wrapper ${
        isCurrentUser() ? 'message__wrapper--right' : 'message__wrapper--left'
      }`.trim()}
    >
      {isBot() ? (
        <div className="message__bot"  dangerouslySetInnerHTML={{ __html: formatText(text) }}/>
      ) : (
        <>
          {!isCurrentUser() && (
            <>
              <Avatar name={user} />
              <div style={{ width: '8px' }}></div>
            </>
          )}
          <div
            className={`message__container ${
              isCurrentUser() ? 'message__container--right' : ''
            }`.trim()}
          >
            <div className="message__text">{text}</div>
            <div
              className={`message__timestamp ${
                isCurrentUser() ? 'message__timestamp--right' : ''
              }`.trim()}
            >
              {time()}
            </div>
          </div>
          {isCurrentUser() && (
            <>
              <div style={{ width: '8px' }}></div>
              <Avatar name={user} />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Message
