import { Request, Response } from 'express'
import knex from '../database/connection'
import { mapItems } from '../utils'

class PointsController {
  async index(request: Request, response: Response) {
    const { uf, city, items } = request.query
    let query = knex('points').join(
      'point_items',
      'points.id',
      '=',
      'point_items.point_id'
    )
    if (items) {
      const parsedItems = (items as string)
        .split(',')
        .map((item) => Number(item.trim()))
      if (parsedItems) {
        query = query.whereIn('point_items.items_id', parsedItems)
      }
    }
    if (uf) query = query.where('uf', uf as string)
    if (city) query = query.where('city', city as string)
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
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body
    const trx = await knex.transaction()
    try {
      const insertedIds = await trx('points').insert({
        image:
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      })
      const pointItems = items.map((item: number) => ({
        items_id: item,
        point_id: insertedIds[0],
      }))
      await trx('point_items').insert(pointItems)
      await trx.commit()
      return response.json({ ...request.body, id: insertedIds[0] })
    } catch (error) {
      await trx.rollback()
    }
  }
}
export default PointsController
