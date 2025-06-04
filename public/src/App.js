import React, { useState, useEffect } from "react";

function Casino() {
  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem("balance")) || 1000;
  });
  const [betAmount, setBetAmount] = useState(0);
  const [betNumber, setBetNumber] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("balance", balance);
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  function spinRoulette() {
    if (betAmount <= 0 || betAmount > balance) {
      setMessage("Valor da aposta inválido!");
      return;
    }
    if (betNumber === null || betNumber < 0 || betNumber > 36) {
      setMessage("Escolha um número entre 0 e 36!");
      return;
    }

    const winningNumber = Math.floor(Math.random() * 37);
    setResult(winningNumber);

    if (winningNumber === betNumber) {
      const winAmount = betAmount * 35;
      setBalance(balance + winAmount);
      setMessage(`Parabéns! Você ganhou ${winAmount} moedas!`);
      setHistory([{ type: "Win", bet: betAmount, number: betNumber, won: winAmount }, ...history]);
    } else {
      setBalance(balance - betAmount);
      setMessage(`Você perdeu! O número sorteado foi ${winningNumber}.`);
      setHistory([{ type: "Lose", bet: betAmount, number: betNumber, lost: betAmount }, ...history]);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto", fontFamily: "Arial" }}>
      <h2>Mini Cassino Suzibet (Beta)</h2>
      <p>Saldo: {balance} moedas</p>
      <div>
        <input
          type="number"
          placeholder="Valor da aposta"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          min={0}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Número (0-36)"
          value={betNumber !== null ? betNumber : ""}
          onChange={(e) => setBetNumber(Number(e.target.value))}
          min={0}
          max={36}
        />
      </div>
      <button onClick={spinRoulette}>Girar Roleta</button>
      <p>{message}</p>
      {result !== null && <p>Número sorteado: {result}</p>}
      <h3>Histórico de apostas</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i}>
            {item.type} - Apostou {item.bet} no número {item.number} -{" "}
            {item.type === "Win" ? `Ganhou ${item.won}` : `Perdeu ${item.lost}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Casino;
