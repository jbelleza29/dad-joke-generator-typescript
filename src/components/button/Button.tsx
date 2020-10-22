import React, { ReactElement } from 'react'

interface BtnProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ text, onClick }: BtnProps): ReactElement {
  return (
    <div className='btn'>
      <button onClick={onClick}>{text}</button>
    </div>
  )
}
