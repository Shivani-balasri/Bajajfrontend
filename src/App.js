import React, { useState } from 'react';
import Select from 'react-select';

const API_URL = 'http://localhost:3000/bfhl'; // Replace with your actual API URL

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Invalid JSON input or API error');
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    selectedOptions.forEach(option => {
      if (response[option.value]) {
        filteredResponse[option.value] = response[option.value];
      }
    });

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div className="App">
      <h1>Your Roll Number</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON data (e.g., { "data": ["A","C","z"] })'
          rows={5}
          cols={50}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h2>Filter Response:</h2>
          <Select
            isMulti
            options={options}
            value={selectedOptions}
            onChange={setSelectedOptions}
          />
          <h2>Filtered Response:</h2>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;