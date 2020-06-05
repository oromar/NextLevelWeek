import React from 'react'
import { useHistory } from 'react-router'
import { FiCheckCircle } from 'react-icons/fi'
import './styles.css'

const Success = () => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/')
  }

  return (
    <div id="success" className="background" onClick={handleClick}>
      <FiCheckCircle className="icon" />
      <h1>Cadastro Concluído</h1>
    </div>
  )
}

export default Success
