import express from 'express'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const router = express.Router()
const pointsController = new PointsController()
const itemsController = new ItemsController()

router.get('/points/:id', pointsController.show)
router.get('/points', pointsController.index)
router.post('/points', pointsController.create)
router.get('/items', itemsController.index)
export default router
