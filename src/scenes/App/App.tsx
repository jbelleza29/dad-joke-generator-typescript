import React, { useState, useEffect } from 'react';

import Button from 'components/button/Button';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [beginnings, setBeginnings] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [markovData, setMarkovData] = useState<any[]>();
  const order = 1;

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
        train(consolidatedData);
      } catch (err) {
        throw(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAndTrain();
  }, [])

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

  const generate = (): void => {
    setJoke('sample joke');
  }

  const train = (data: any): void => {
    let firstWords: any[] = [];

    const trainedData = data.reduce((acc: any, curr: any) => {
      let words = curr.joke.split(/\s+/);

      firstWords.push(words.slice(0, order).join(' '));
      for(let i = 0; i < words.length - order; i++){
        let gram = words.slice(i, i + order).join(' ');
        let next = words[i + order]
        if(!acc[gram]){
          acc[gram] = []
        } 
        acc[gram].push(next)
      }
      return acc;
    }, {})

    setMarkovData(trainedData);
    setBeginnings(firstWords);
  }

  return (
    <div className="App">
      {joke ? <span>{joke}</span> : 'Press Generate button to receive Dad jokes!'}
      <Button text='Generate' disabled={loading} onClick={generate} />
    </div>
  );
}

export default App;
