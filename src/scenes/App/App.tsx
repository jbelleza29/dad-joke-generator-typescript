import React, { useState, useEffect } from 'react';

import Button from 'components/button/Button';
import './App.css';

function App() {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAndTrain() {
      try {
        setLoading(true);
        const numOfFetches = 5;
        var consolidatedData: any[] = [];
        for(let i = 0; i < numOfFetches; i++){
          const data = await fetchData(i);
          consolidatedData.push(...data.results);
        }
        // add train here
      } catch (err) {
        throw(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndTrain();
  }, [])

  const generate = (): void => {
    setJoke('sample joke');
  }

  const fetchData = async (page: number): Promise<any> => {
    try {
      let res = await fetch(`https://icanhazdadjoke.com/search?limit=30&page=${page}`, {
        method: 'get', 
        headers: {
          'Accept': 'application/json'
        },
      });
      let data = res.json();
      return data;
    } catch (err) {
      throw(err);
    }
  }

  return (
    <div className="App">
      {joke ? <span>{joke}</span> : 'Press Generate button to receive Dad jokes!'}
      <Button text='Generate' disabled={loading} onClick={generate} />
    </div>
  );
}

export default App;
