const router = require('express').Router()
const { Item, Contract, ContractAssociations, User } = require("../db/models");

router.get('/', (req, res, next) => {
  const { basket } = req.session
  res.json(basket)
})

router.put('/add', (req, res, next) => {
  const { basket } = req.session
  basket.push(req.body)
  res.json(req.body)
})

router.put('/remove', (req, res, next) => {
  const { basket } = req.session
  let newBasket = basket.filter(item => {
    return item.id !== req.body.itemId
  })
  req.session.basket = newBasket
  res.send(200)
})

router.put('/delete', (req, res, next) => {
  let { basket, inEscrow } = req.session
  const itemIds = req.body.itemIds.split(', ')
  console.log('itemIds', itemIds)
  let newBasket = basket.filter(item => {
    return !itemIds.includes(item.id.toString())
  })
  let updatedItemPromises = itemIds.map(itemId => {
    return Item.findById(+itemId)
    .then(item => item.update({status: 'InEscrow'}))
  })
  Promise.all(updatedItemPromises)
  .then(rUpdatedItems => {
    console.log('resolvedITems', rUpdatedItems)
    req.session.basket = newBasket
    req.session.inEscrow = [...inEscrow, ...rUpdatedItems]
    res.send(200)
  })
  .catch(err => console.log(err))
})

router.delete('/', (req, res, next) => {
  req.session.basket = []
  req.session.inEscrow = []
  res.sendStatus(204)
})

module.exports = router