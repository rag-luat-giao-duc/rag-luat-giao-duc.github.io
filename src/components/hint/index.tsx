import Avatar from '../avatar'
import { Button } from '../../components'

import './styles.css'

const HintMessage = ({ setMessage, onSend,  text }: any) => {

  const hintData = [
    {
      text: 'Luật giáo dục do ai ban hành',
      color: '#6B5B95'
    },
    {
      text: 'Bạn có thể làm được gì',
      color: '#92A8D1'
    },
    {
      text: 'Học bổng được quy định thế nào',
      color: '#B565A7'
    },
    {
      text: 'Giảng viên là ai',
      color: '#5B5EA6'
    },
    {
      text: 'Có bao nhiêu điều trong luật giáo dục',
      color: '#98B4D4'
    }

  ]

  return (
    <div
      className={`message__wrapper 'message__wrapper--left'
      }`.trim()}
    >
        <>
         <>
            <div style={{ width: '8px' }}></div>
            <Avatar name={"Admin"} />
          </>
          <div
            className={`message__container`.trim()}
          >
            <div className="message__text">{text} 
              <br />
              <br />

              {
                hintData.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setMessage(item.text)
                      onSend()
                    }}
                    color={item.color}
                  >
                    {item.text}
                  </Button>
                ))
              
              }
            </div>
            <div
              className={`message__timestamp`.trim()}
            >
            </div>
          </div>
        </>
    </div>
  )
}

export default HintMessage
