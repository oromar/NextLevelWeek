import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import applicationService from '../../services/applicationService'
import locationService, { State, City } from '../../services/locationService'
import logo from '../../assets/logo.svg'
import './styles.css'

interface Item {
  id: number
  title: string
  imageURL: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [data, setData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ])

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSelectedPosition([position.coords.latitude, position.coords.longitude])
    })
  }, [])

  useEffect(() => {
    const doAsync = async () => {
      const response = await applicationService.get('items')
      setItems(response.data)
    }
    doAsync()
  }, [])

  useEffect(() => {
    const doAsync = async () => {
      const data = await locationService.getStates()
      setStates(data)
    }
    doAsync()
  }, [])

  useEffect(() => {
    const doAsync = async () => {
      const data = await locationService.getCities(selectedState)
      setCities(data)
    }
    const selectCity = document.querySelector('#city') || new Element()
    selectCity.setAttribute('disabled', 'true')
    if (selectedState) {
      doAsync()
      selectCity.removeAttribute('disabled')
    }
  }, [selectedState])

  const onSubmit = async () => {
    const payload: any = {
      ...data,
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      city: selectedCity,
      uf: selectedState,
      items: selectedItems,
    }
    for (let property in payload)
      if (!payload[property]) {
        alert('Todos os campos são obrigatórios')
        return
      }

    await applicationService.post('/points', payload)
    history.push('/success')
  }

  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target
    setData({ ...data, [name]: value })
  }

  const handleChangeState = (evt: any) => {
    setSelectedState(evt.target.value)
  }

  const handleChangeCity = (evt: any) => {
    setSelectedCity(evt.target.value)
  }

  const handleItemClick = (id: number) => {
    if (!selectedItems.includes(id)) setSelectedItems([...selectedItems, id])
    else setSelectedItems(selectedItems.filter((item) => item !== id))
  }

  const handleMapClick = (evt: LeafletMouseEvent) => {
    setSelectedPosition([evt.latlng.lat, evt.latlng.lng])
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft /> Voltar para a home
        </Link>
      </header>
      <form>
        <h1>Cadastro do ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input
              type="text"
              id="name"
              name="name"
              onKeyUp={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                onKeyUp={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                onKeyUp={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={selectedPosition} zoom={15} onclick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy<a href="http://osm.org/copyright>OpenStreetMap</a>" contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker id="mapMarker" draggable position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select
                id="uf"
                name="uf"
                onChange={(evt: any) => handleChangeState(evt)}
              >
                <option value="">Selecione um estado</option>
                {states &&
                  states.map((state: State) => (
                    <option
                      id={`option_state_${state.id}`}
                      key={`option_state_${state.id}`}
                      value={state.UF}
                    >
                      {state.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                id="city"
                name="city"
                disabled={!selectedState}
                onChange={handleChangeCity}
              >
                <option value="">Selecione uma cidade</option>
                {selectedState &&
                  cities &&
                  cities.map((city: City) => (
                    <option
                      id={`city_option_${city.id}`}
                      key={`city_option_${city.id}`}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items &&
              items.map((item: Item) => (
                <li
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                  id={`li_item_${item.id}`}
                  key={`li_item_${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <img src={item.imageURL} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </fieldset>
        <button type="button" onClick={onSubmit}>
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint
