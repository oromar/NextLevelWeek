import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'
import Success from './pages/Success'

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} exact />
      <Route path="/create-point" component={CreatePoint} />
      <Route path="/success" component={Success} />
    </BrowserRouter>
  )
}

export default Routes
