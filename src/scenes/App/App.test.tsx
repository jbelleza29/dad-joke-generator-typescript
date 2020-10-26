import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import { act, getByRole } from 'react-dom/test-utils';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      results: [
        { id: 1, joke: "My dog used to chase people on a bike a lot. It got so bad I had to take his bike away.", status: 200 },
        { id: 2, joke: "What kind of magic do cows believe in? MOODOO.", status: 200 },
        { id: 3, joke: "Did you hear the one about the guy with the broken hearing aid? Neither did he.", status: 200 },
      ]}),
  })
);

beforeEach(() => {
  global.fetch.mockClear();
});

test('initial render', async () => {
  const { getByText } = render(<App />);
  const defaultText = getByText(/Press Generate/i);

  expect(getByText(/Generate/i, { selector: 'button' })).toBeDisabled();

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(getByText(/Generate/i, { selector: 'button' })).toBeEnabled();
  expect(defaultText).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('https://icanhazdadjoke.com/search?term=&limit=30&page=0', {'headers': {'Accept': 'application/json'}, 'method': 'get'});  
});

test('change joke on button press', async () => {
  const { getByText, getByRole } = render(<App />);
  const defaultText = getByText(/Press Generate/i);
  const generateButton = getByText(/Generate/i, { selector: 'button' });

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(generateButton).not.toBeDisabled();
  expect(defaultText).toBeInTheDocument();

  act(() => {
    fireEvent.click(generateButton);
  });

  expect(getByRole('heading')).toBeTruthy();
})
