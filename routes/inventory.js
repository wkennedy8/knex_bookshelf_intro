const express = require('express');
const Inventory = require('../models/inventory');
const Warehouse = require('../models/warehouse');
const router = express.Router();

router.get('/', (req, res) => {
  Inventory.where(req.query)
    .fetchAll({ withRelated: ['warehouse'] })
    .then((inventories) => {
      res.status(200).json({ inventories });
    });
});

router.post('/', (req, res) => {
  Warehouse.where('id', req.body.warehouseId)
    .fetch()
    .then((warehouse) => console.log('Warehouse found'))
    .catch((warehouse) => {
      res.status(404).json({ error: 'Please provide valid warehouse id' });
    });
  new Inventory({
    name: req.body.name,
    description: req.body.description,
    warehouse_id: req.body.warehouseId,
    quantity: req.body.quantity,
    status: req.body.status
  })
    .save()
    .then((newInventory) => {
      res.status(201).json({ newInventory });
    });
});

router.get('/:id', (req, res) => {
  Inventory.where(req.params)
    .fetch({ withRelated: ['warehouse'] })
    .then((inventory) => {
      res.status(200).json({ inventory });
    });
});

router.put('/:id', (req, res) => {
  if (req.body.warehouseId) {
    Warehouse.where('id', req.body.warehouseId)
      .fetch()
      .then((warehouse) => console.log('Warehouse found'))
      .catch((warehouse) => {
        res.status(404).json({ error: 'Please provide valid warehouse id' });
      });
  }

  Inventory.where('id', req.params.id)
    .fetch()
    .then((inventory) => {
      inventory
        .save({
          name: req.body.name || inventory.name,
          description: req.body.description || inventory.description,
          warehouse_id: req.body.warehouseId || inventory.warehouse_id,
          quantity: req.body.quantity || inventory.quantity,
          status: req.body.status || inventory.status
        })
        .then((updatedInventory) => {
          res.status(200).json({ updatedInventory });
        });
    });
});

router.delete('/:id', (req, res) => {
  Inventory.where('id', req.params.id)
    .destroy()
    .then((deletedInventory) => {
      res.status(200).json({ deletedInventory });
    });
});
module.exports = router;

//`{ withRelated: ["inventories"] }` & `{ withRelated: ["warehouse"] }` will allow us to return all inventories for a warehouse while querying a warehouse and return warehouse details while querying for inventory.
