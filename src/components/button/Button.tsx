import React, { ReactElement } from 'react'

interface BtnProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

export default function Button({ text, onClick, disabled }: BtnProps): ReactElement {
  return (
    <div className='btn'>
      <button onClick={onClick} disabled={disabled}>{text}</button>
    </div>
  )
}
