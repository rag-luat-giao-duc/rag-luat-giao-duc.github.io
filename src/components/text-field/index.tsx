import './styles.css'

import { useState } from 'react';


const TextField = ({
  className = '',
  type,
  value,
  placeholder,
  icon = false,
  onIconClick,
  onKeyPress,
  onChange,
  sending,
  suggestions,
  setUseModel,
  useModel
}: any) => {
  const handler = (func: Function, value: any) => {
    if (value === ('#')) {
      setShowSuggestions(true);
      return;
    } else {
      setShowSuggestions(false);
    }
    if (func) {
      func(value)
    }
  }

  const onClickClearModel = () => () => {
    setUseModel('');
    setShowSuggestions(true);
  }

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion:string) => {
    setUseModel(suggestion);
    console.log(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`input__wrapper ${className}`.trim()}>
      {useModel && useModel.name && 
        <div className="input__use__model"  title={useModel.desc}>
          <div className="input__use__model__close" onClick={onClickClearModel()}>X</div>
          {useModel.name}
        </div>
      }

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onKeyPress={(event) => handler(onKeyPress, event.key)}
        onChange={({ target: { value } }) => handler(onChange, value)}
        className={`input ${icon ? 'input--shrunk' : ''}`.trim()}
        onClick={() => setShowSuggestions(false)}
        disabled={sending}
      />
      
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.length > 0 && suggestions.map((suggestion: any) => (
            
            <li key={suggestion.name} 
              onClick={() => {
                console.log(suggestion); 
                suggestion && handleSuggestionClick(suggestion);
              }}
              title={suggestion.desc}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      {icon && (
        <div
          className="input__send"
          onClick={(event) => handler(onIconClick, event)}
        >
          <img className="send_icon" src={icon} alt="send" />
        </div>
      )}
    </div>
  )
}

export default TextField