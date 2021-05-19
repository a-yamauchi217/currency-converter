import "./App.css";
import React, { useState } from "react";
import currencyList from "./currencyList";

function App() {
  const [sourceCurrency, setSourceCurrency] = useState("EUR");
  const [sourceAmount, setSourceAmount] = useState(0);
  const [targetCurrency, setTargetCurrency] = useState("GBP");
  const [targetAmount, setTargetAmount] = useState(0);
  const [enteringSource, setEnteringSource] = useState(true); //for activating input tag

  const onSelectSourceCurrency = (_sourceCurrency) => {
    setEnteringSource(true);
    setSourceCurrency(_sourceCurrency);
    fetch(`https://api.ratesapi.io/api/latest?base=${sourceCurrency}`)
      .then((res) => res.json())
      .then((response) => {
        const rate = response.rates[targetCurrency];
        const result = rate * sourceAmount;
        setTargetAmount(result.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onSelectTargetCurrency = (_targetCurrency) => {
    setEnteringSource(false);
    setTargetCurrency(_targetCurrency);
    fetch(`https://api.ratesapi.io/api/latest?base=${_targetCurrency}`)
      .then((res) => res.json())
      .then((response) => {
        const rate = response.rates[sourceCurrency];
        const result = rate * targetAmount;
        typeof result === "number" && setSourceAmount(result.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onInputSourceAmount = (inputAmount) => {
    validate(inputAmount.replace(",", "").replace(".", ""));
    const _sourceAmount = inputAmount.replace(",", ".");
    setSourceAmount(_sourceAmount);
    fetch(`https://api.ratesapi.io/api/latest?base=${sourceCurrency}`)
      .then((res) => res.json())
      .then((response) => {
        const rate = response.rates[targetCurrency];
        const result = rate * sourceAmount;
        setTargetAmount(result.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onInputTargetAmount = (inputAmount) => {
    validate(inputAmount.replace(",", "").replace(".", ""));
    const _targetAmount = inputAmount.replace(",", ".");
    setTargetAmount(_targetAmount);
    fetch(`https://api.ratesapi.io/api/latest?base=${targetCurrency}`)
      .then((res) => res.json())
      .then((response) => {
        const rate = response.rates[sourceCurrency];
        const result = rate * _targetAmount;
        typeof result === "number" && setSourceAmount(result.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const validate = (i) => {
    //matches empty string or number
    const number = new RegExp("^$|^[0-9]+$");
    if (!number.test(i)) {
      return alert("You can only enter numbers.");
    }
  };

  const onClickSource = () => {
    setEnteringSource(true);
    setTargetAmount(0);
  };

  const onClickTarget = () => {
    setEnteringSource(false);
    setSourceAmount(0);
  };

  return (
    <div className="App">
      <div className="title">Currency Converter</div>
      <div className="container">
        <div className="row">
          {enteringSource ? (
            <input
              onChange={(e) => setSourceAmount(e.target.value)}
              onKeyUp={(e) => onInputSourceAmount(e.target.value)}
              value={sourceAmount}
            />
          ) : (
            <div onClick={() => onClickSource()} className="amountContainer">
              {sourceAmount}
            </div>
          )}
          <select
            onChange={(e) => onSelectSourceCurrency(e.target.value)}
            value={sourceCurrency}
          >
            {currencyList.map((i, idx) => (
              <option key={idx} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        ↓
        <div className="row">
          {enteringSource === false ? (
            <input
              onChange={(e) => setTargetAmount(e.target.value)}
              onKeyUp={(e) => onInputTargetAmount(e.target.value)}
              value={targetAmount}
            />
          ) : (
            <div onClick={() => onClickTarget()} className="amountContainer">
              {targetAmount}
            </div>
          )}
          <select
            onChange={(e) => onSelectTargetCurrency(e.target.value)}
            value={targetCurrency}
          >
            {currencyList.map((i, idx) => (
              <option key={idx} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
