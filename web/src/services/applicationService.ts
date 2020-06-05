import axios from 'axios'

const BASE_URL = 'http://localhost:3333/api'

const applicationService = axios.create({
  baseURL: BASE_URL,
})

export default applicationService
