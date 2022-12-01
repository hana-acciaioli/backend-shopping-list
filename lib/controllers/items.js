const { Router } = require('express');
const Item = require('../models/Item');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const items = await Item.getAll(req.user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newItem = await Item.insert({
        description: req.body.description,
        qty: req.body.qty,
        userId: req.user.id,
        bought: req.body.bought,
      });
      res.json(newItem);
    } catch (e) {
      next(e);
    }
  })
  .put('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const updatedItem = await Item.updateById(req.params.id, req.body);
      res.json(updatedItem);
    } catch (e) {
      next(e);
    }
  });
