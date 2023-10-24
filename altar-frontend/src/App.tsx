import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [code, setCode] = useState<string>('');
  const [biasCharacter, setBiasCharacter] = useState<string>('');
  const [lastBiasInputTime, setLastBiasInputTime] = useState<number>(0);

  const fetchGrid = () => {
    fetch(`http://localhost:3001/generate-grid`) 
      .then((response) => response.json())
      .then((data) => {
        setGrid(data);
        calculateCode(data);
      });
  };

  const calculateCode = (gridData: string[][]) => {
    const now = new Date();
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    const gridChar1 = gridData[3][6];
    const gridChar2 = gridData[6][3];
  
    const gridCounts = countGridCharacters(gridData);
  
    const countV = gridCounts[gridChar1] || 0;
    const countC = gridCounts[gridChar2] || 0;
  
    let code = countV + countC;
    if (code > 9) {
      code = code % 10;
    }
  
    setCode(`${code}${seconds}`);
  };

  const countGridCharacters = (gridData: string[][]) => {
    const gridCounts: { [char: string]: number } = {};
    for (const row of gridData) {
      for (const char of row) {
        if (gridCounts[char]) {
          gridCounts[char]++;
        } else {
          gridCounts[char] = 1;
        }
      }
    }
    return gridCounts;
  };

  const setBias = (character: string) => {
    const currentTime = Date.now();

    if (character.match(/^[a-z]$/) && currentTime - lastBiasInputTime >= 4000) {
      fetch(`http://localhost:3001/set-bias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ character }),
      })
        .then((response) => response.json())
        .then(() => {
          setBiasCharacter(character);
          setLastBiasInputTime(currentTime);
          fetchGrid();
        });
    }
  };

  useEffect(() => {
    fetchGrid();

    const gridRefreshInterval = setInterval(fetchGrid, 1000);

    return () => {
      clearInterval(gridRefreshInterval);
    };
  }, []);

  return (
    <div className="App">
      <button onClick={fetchGrid}>Generate Grid</button>
      <div className="Grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="Row">
            {row.map((char, colIndex) => (
              <div key={colIndex} className="Cell">
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="Code">
        <h2>Your code:</h2>
        <p>{code}</p>
      </div>
      <div className="BiasInput">
        <input
          type="text"
          placeholder="Enter Bias Character (a-z)"
          onChange={(e) => setBiasCharacter(e.target.value)}
          value={biasCharacter}
        />
        <button onClick={() => setBias(biasCharacter)}>Set Bias</button>
      </div>
    </div>
  );
}

export default App;