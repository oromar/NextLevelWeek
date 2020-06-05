import axios from 'axios'

export interface State {
  id: number
  UF: string
  name: string
}

export interface City {
  id: number
  name: string
}

const api = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
})

const getStates = async (): Promise<Array<State>> => {
  const response = await api.get('?orderBy=nome')
  return response.data.map((state: any) => ({
    id: state.id,
    name: state.nome,
    UF: state.sigla,
  }))
}

const getCities = async (UF: string): Promise<Array<City>> => {
  const response = await api.get(`/${UF}/municipios?orderBy=nome`)
  return response.data.map((city: any) => ({
    id: city.id,
    name: city.nome,
  }))
}

const locationService = {
  getStates,
  getCities,
}

export default locationService
