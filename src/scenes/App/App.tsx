import React, { useState } from 'react';

import Button from 'components/button/Button';
import './App.css';

interface Joke {
  id: string;
  joke: string;
  status: number;
}

function App() {
  const [joke, setJoke] = useState<Joke>();

  const generateDadJoke = (): void => {
    fetch('https://icanhazdadjoke.com/', {
        method: 'get', 
        headers: {
          'Accept': 'application/json'
        },
      })
      .then(res => res.json())
      .then(data => { console.log(data); setJoke(data) })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="App">
      {joke ? <span>{joke.joke}</span> : 'Press Generate button to receive Dad jokes!'}
      <Button text='Generate Dad Joke' onClick={generateDadJoke} />
    </div>
  );
}

export default App;
