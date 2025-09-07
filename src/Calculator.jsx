import React, { useState } from 'react';

const Calculator = () => {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    if (value === 'c') {
      setInput('');
    } else if (value === '=') {
      try {
        // eval is fine for a small project/demo (avoid in production)
        setInput(eval(input).toString());
      } catch {
        setInput('Error');
      }
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="calculator">
      <div className="display">{input || '0'}</div>
      <div className="btns">
        <button onClick={() => handleClick('c')}>c</button>
        <button onClick={() => handleClick('/')}>/</button>
        <button onClick={() => handleClick('*')}>*</button>
        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('-')}>-</button>
        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('+')}>+</button>
        <button onClick={() => handleClick('0')}>0</button>
        <button onClick={() => handleClick('00')}>00</button>
        <button onClick={() => handleClick('.')}>.</button>
        <button onClick={() => handleClick('=')}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
