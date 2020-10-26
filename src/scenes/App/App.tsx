import React, { useState, useEffect } from 'react';

import Button from 'components/button/Button';
import './App.css';

interface MarkovData {
  [dataName: string]: any;
}

function App() {
  const [joke, setJoke] = useState('');
  const [beginnings, setBeginnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [markovData, setMarkovData] = useState<MarkovData>({});
  const [search, setSearch] = useState('');
  const order = 1;
  const maxPerFetch = 30;

  const train = (data: any): void => {
    let firstWords: any[] = [];

    let oldData = markovData;

    const trainedData = data.reduce((acc: any, curr: any) => {
      let words = curr.joke.split(/\s+/);

      firstWords.push(words.slice(0, order).join(' '));
      for(let i = 0; i < words.length - order; i++){
        let gram = words.slice(i, i + order).join(' ');
        let next = words[i + order]
        if(oldData[gram]){
          acc[gram] = [...oldData[gram], next];
          console.log([...oldData[gram], next], gram, next, 'insta');
          continue;
        }

        if(!acc[gram]){
          acc[gram] = []
        } 
        acc[gram].push(next)
      }
      return acc;
    }, {})

    setMarkovData({ ...trainedData, ...oldData });
    setBeginnings(beginnings => ([ ...beginnings, ...firstWords ]));
  }

  const fetchAndTrain = async (searchString = ''): Promise<void> => {
    try {
      setLoading(true);
      const numOfFetches = 5;
      var consolidatedData: any[] = [];
      for(let i = 0; i < numOfFetches; i++){
        const data = await fetchData(i, searchString);
        consolidatedData.push(...data.results);
        if(maxPerFetch !== data.results.length){
          break;
        }
      }
      train(consolidatedData);
    } catch (err) {
      throw(err);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAndTrain();
  }, [])

  const fetchData = async (page: number, searchString: string): Promise<any> => {
    try {
      let res = await fetch(`https://icanhazdadjoke.com/search?term=${searchString}&limit=${maxPerFetch}&page=${page}`, {
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

  const getRandom = (data: any[]): any => {
    return data[Math.floor(Math.random() * data.length)]
  }

  const generate = (): string => {
    const limit = 50;
    let generatedJoke = [];
    let currentWord = getRandom(beginnings);

    generatedJoke = currentWord.split(/\s+/);

    for(let i = 0; i <= limit; i++){
      let nextPossibilities = markovData[currentWord];
      if(!nextPossibilities)
        break;
      let nextWord = getRandom(nextPossibilities);
      generatedJoke.push(nextWord);
      currentWord = generatedJoke.slice(generatedJoke.length - order, generatedJoke.length).join(' ');
    }
    return generatedJoke.join(' ');
  }

  const generateJoke = (): void => {
    console.log(markovData);
    setJoke(generate());
  }

  const resetData = () => {
    setMarkovData({});
  }

  const trainBySearch = () => {
    fetchAndTrain(search);
  }

  const onChangeInput = (e: React.SyntheticEvent<EventTarget>) => {
    const target = e.target as HTMLTextAreaElement;
    setSearch(target.value);
  }

  return (
    <div className="App">
      <input onChange={onChangeInput} value={search} placeholder='Give a keyword'/>
      <Button text='Use keyword' disabled={loading || !search} onClick={trainBySearch} />
      <h3>{joke ? joke : 'Press Generate button to receive Dad jokes!'}</h3>
      <Button text='Generate' disabled={loading} onClick={generateJoke} />
    </div>
  );
}

export default App;
