import { Request, Response } from 'express'
import Knex from 'knex'
import knex from '../database/connection'
import { mapItems } from '../utils'
import { IMAGE_BASE_URL } from '../constants'

export default class PointsController {
  async index(request: Request, response: Response) {
    const { uf, city, items } = request.query
    const query: Knex.QueryBuilder = knex('points').join(
      'point_items',
      'points.id',
      '=',
      'point_items.point_id'
    )
    if (items) {
      const parsedItems: number[] = (items as string)
        .split(',')
        .map((item) => Number(item.trim()))
      if (parsedItems) {
        query.whereIn('point_items.items_id', parsedItems)
      }
    }
    if (uf) query.where('uf', uf as string)
    if (city) query.where('city', city as string)
    const result = await query.distinct().select('points.*')
    return response.json(result)
  }
  async show(request: Request, response: Response) {
    const id = request.params.id
    const result = await knex('points').where('id', id).first()
    if (!result) return response.status(404).send('Not Found')
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.items_id')
      .where('point_items.point_id', id)
    if (items) {
      result.items = mapItems(items)
    }
    return response.json(result)
  }
  async create(request: Request, response: Response) {
    const { items } = request.body
    const trx = await knex.transaction()
    try {
      const data = {
        ...request.body,
        image: `${IMAGE_BASE_URL}fake-image.jpg`,
      }
      delete data.items
      const insertedIds = await trx('points').insert(data)
      const pointItems = items.map((item: number) => ({
        items_id: item,
        point_id: insertedIds[0],
      }))
      await trx('point_items').insert(pointItems)
      await trx.commit()
      return response.json({ ...data, id: insertedIds[0] })
    } catch (error) {
      await trx.rollback()
    }
  }
}
