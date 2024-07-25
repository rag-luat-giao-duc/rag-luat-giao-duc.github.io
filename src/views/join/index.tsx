import { useState } from 'react'

import { Button, TextField } from '../../components'

import './styles.css'

const Join = ({ onJoin }: any) => {
  const [username, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && JSON.stringify(event).includes('Enter')) {
      onJoin && onJoin({ username, password });
    }
  }

  return (
    <div className="join__wrapper">
      <div className="join__container">
        <TextField
          type="text"
          placeholder="Username"
          onChange={(value: string) => setName(value)}
        />
        <div style={{ height: '24px' }}></div>
        <TextField
          type="password"
          placeholder="Password"
          onChange={(value: string) => setPassword(value)}
          onKeyPress={handleKeyPress}
        />
        <div style={{ height: '36px' }}></div>
        <Button block onClick={() => onJoin && onJoin({ username, password })}>
          GO!
        </Button>
        <div className="join__info">i</div>
        <div className="join__description">
          Join a private own beta chat bot!
        </div>
      </div>
    </div>
  );
}

export default Join
