const { Router } = require('express');
const Item = require('../models/Item');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const items = await Item.getAll(req.user.id);
      if (!items) {
        next();
      }
      res.json(items);
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
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
  .put('/:id', authorize, async (req, res, next) => {
    try {
      const updatedItem = await Item.updateById(req.params.id, req.body);
      res.json(updatedItem);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', authorize, async (req, res, next) => {
    try {
      const item = await Item.getById(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', authorize, async (req, res, next) => {
    try {
      const deletedItem = await Item.delete(req.params.id);
      res.json(deletedItem);
    } catch (e) {
      next(e);
    }
  });
