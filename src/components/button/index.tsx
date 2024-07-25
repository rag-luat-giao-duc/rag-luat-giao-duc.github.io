import './styles.css'

interface ButtonProps {
  children: React.ReactNode;
  block?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string; 
}

const Button = ({ children, block = false, onClick, color }: ButtonProps) => {
  return (
    <button
      onClick={(event) => onClick && onClick(event)}
      className={`message__text__hint button ${block ? 'button--block' : ''}`.trim()}
      style={{ backgroundColor: color }} 
    >
      {children}
    </button>
  )
}

export default Button
