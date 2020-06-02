import { Request, Response } from 'express'
import knex from '../database/connection'
import { mapItems } from '../utils'

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*')
    const result = mapItems(items)
    return response.json(result)
  }
}

export default ItemsController
