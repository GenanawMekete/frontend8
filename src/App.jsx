import React, { useEffect, useState } from 'react';
import Countdown from './components/Countdown';
import CardPicker from './components/CardPicker';
import Board from './components/Board';
const tg = window.Telegram.WebApp;
tg.ready();

const user = tg.initDataUnsafe?.user;
const telegramId = user?.id;

const API = 'http://localhost:4000'; // change in production

export default function App() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [seconds, setSeconds] = useState(30);

  // Fetch bingo cards
  useEffect(() => {
    fetch(`${API}/api/cards`)
      .then(res => res.json())
      .then(data => setCards(data.cards || []))
      .catch(() => {});
  }, []);

  // Countdown logic
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="app">
      <div className="header">
        <Countdown value={seconds} />
        <div>
          <h2>Bingo</h2>
          <p className="subtitle">
            {seconds > 0
              ? 'Choose your card before time runs out'
              : 'Game started'}
          </p>
        </div>
      </div>

      {seconds > 0 ? (
        <CardPicker
          cards={cards}
          selected={selectedCard}
          onSelect={setSelectedCard}
        />
      ) : (
        <Board card={selectedCard} />
      )}
    </div>
  );
}
