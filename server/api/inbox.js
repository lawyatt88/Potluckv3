const router = require('express').Router()
const { Item, Contract, ContractAssociations, User } = require("../db/models");

router.get('/', (req, res, next) => {
    let { inbox, passport } = req.session
    //instanciate object for inbox on session
    const contractsByContractId = {}
    //find contract IDs and status from associations contractIds
    const associationContractIds = new Set()

    ContractAssociations.findAll()
    .then(associations => Promise.all(associations))
    .then(rAssociations => {
        //return all contract associations by current user
        let assocsByCurrentUser = rAssociations.filter(assoc => +assoc.userId === +passport.user)
        let assocIds = assocsByCurrentUser.map(assoc => assoc.contractId).sort((x, y) => x - y)

        //add unique contract IDs to set
        assocIds.forEach(assocId => associationContractIds.add(assocId))

        let otherUserPromiseArr = [], contractPromiseArr = []

        //compose inbox object by contract ID
        associationContractIds.forEach((contractId, v2, set) => {
            let contract, assocs, otherUser

            //find all associations with current contract
            assocs = rAssociations.filter(association => +association.contractId === +contractId)

            //find other user by looking through assocs and filtering out current user
            //grabbing the other user's ID and finding them in the DB
            let otherUserAssocs = assocs.filter(assoc => +assoc.userId !== +passport.user)
            otherUserPromiseArr.push(User.findById(otherUserAssocs[0].userId))

            //find contract instance
            contractPromiseArr.push(Contract.findById(contractId))
            
            // finally compose object and add it to object
            // contractsByContractId.set(contractId, { associations: assocs })
            contractsByContractId[contractId] = { associations: assocs }
        })
        return Promise.all([Promise.all(otherUserPromiseArr), Promise.all(contractPromiseArr)])
      })
      .then(([rOtherUsersArr, rContractArr]) => {
        // set user with appropriate contract key
        for (var contractId in contractsByContractId) {
          contractsByContractId[contractId] = { ...contractsByContractId[contractId], otherUser: rOtherUsersArr.shift(), contract: rContractArr.shift() }
        }

        req.session.inbox = contractsByContractId
        return req.session.inbox
      })
      .then(newInbox => {
        res.json(newInbox)
      })
      .catch(next);
})


router.put('/delete', (req, res, next) => {
  let newCart = req.session.inbox.filter(lineRequest => {
    return +lineRequest.productId !== +req.body.productId
  })
  req.session.inbox = newCart
  res.send(200)
})

router.delete('/', (req, res, next) => {
  req.session.inbox = []
  res.sendStatus(204)
})

module.exports = router
