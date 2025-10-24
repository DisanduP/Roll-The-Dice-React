import React, { useState, useRef, useEffect } from 'react';
import './Dice.sass';

const diceDots = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅'
};

export default function Dice() {
  const [diceChar, setDiceChar] = useState(diceDots[1]);
  const [totalRolls, setTotalRolls] = useState(0);
  const [lastRoll, setLastRoll] = useState(null);
  const [highest, setHighest] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [resultText, setResultText] = useState('');

  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function finishRoll() {
    setTimeout(() => {
      const finalNumber = Math.floor(Math.random() * 6) + 1;
      setDiceChar(diceDots[finalNumber]);
      setRolling(false);

      setTotalRolls(prev => prev + 1);
      setLastRoll(finalNumber);
      setHighest(prev => (prev === null || finalNumber > prev ? finalNumber : prev));

      if (finalNumber === 6) setResultText('Perfect roll!');
      else if (finalNumber === 1) setResultText('Try again');
      else setResultText(`You rolled ${finalNumber}`);
    }, 100);
  }

  function rollDice() {
    if (rolling) return;
    setRolling(true);
    setResultText('');

    let counter = 0;
    intervalRef.current = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 6) + 1;
      setDiceChar(diceDots[randomNum]);
      counter++;

      if (counter >= 8) {
        clearInterval(intervalRef.current);
        finishRoll();
      }
    }, 60);
  }

  return (
    <div className="container">
      <h1>Roll the Dice</h1>

      <div className="dice-container">
        <div className={`dice ${rolling ? 'rolling' : ''}`} id="dice">
          <span className="dice-dot">{diceChar}</span>
        </div>
      </div>

      <button
        className="roll-btn"
        id="rollBtn"
        onClick={rollDice}
        disabled={rolling}
      >
        Roll
      </button>

      <div className="result" id="result" aria-live="polite">{resultText}</div>

      <div className="stats">
        <div className="stat-box">
          <div className="stat-label">Rolls</div>
          <div className="stat-value" id="totalRolls">{totalRolls}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Last</div>
          <div className="stat-value" id="lastRoll">{lastRoll === null ? '—' : lastRoll}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Best</div>
          <div className="stat-value" id="highest">{highest === null ? '—' : highest}</div>
        </div>
      </div>
    </div>
  );
}
