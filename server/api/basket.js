const router = require('express').Router()

router.get('/', (req, res, next) => {
  const { basket } = req.session
  res.json(basket)
})

router.put('/update', (req, res, next) => {
  const { basket } = req.session
  basket.push(req.body)
  res.send(200)
})

router.put('/delete', (req, res, next) => {
    const { basket } = req.session
    let newBasket = basket.filter(item => {
        return +item.id !== +req.body.itemId
    })
    req.session.basket = newBasket
    res.send(200)
})

router.delete('/', (req, res, next) => {
  req.session.basket = []
  res.sendStatus(204)
})

module.exports = router