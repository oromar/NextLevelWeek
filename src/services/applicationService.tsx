import React from 'react'
import axios from 'axios'

const applicationService = axios.create({
  baseURL: 'http://192.168.1.65:3333/api',
})

export default applicationService
