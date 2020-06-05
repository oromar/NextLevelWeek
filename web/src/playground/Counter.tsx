import React, { useState } from 'react'
import '../App.css'
import Header from './Header'

const Counter = () => {
  const [counter, setCounter] = useState(0)
  const increment = () => setCounter(counter + 1)
  const reset = () => setCounter(0)
  const decrement = () => setCounter(counter - 1)

  return (
    <div>
      <Header title={`Contador: ${counter}`} />
      <h1>Conteúdo da app</h1>
      <button type="button" onClick={decrement}>
        DEC
      </button>
      <button type="button" onClick={increment}>
        INC
      </button>
      <button type="button" onClick={reset}>
        RESET
      </button>
    </div>
  )
}

export default Counter
