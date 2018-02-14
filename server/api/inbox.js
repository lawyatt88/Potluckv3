const router = require('express').Router()
const { Item, Contract, ContractAssociations, User } = require("../db/models");

router.get('/', (req, res, next) => {
    let { inbox, passport } = req.session
    //instanciate map for inbox on session
    let contractsByContractId = {}
    //find contract IDs and status from associations contractIds
    const associationContractIds = new Set()

    ContractAssociations.findAll()
    .then(associations => Promise.all(associations))
    .then(rAssociations => {
        // console.log('I AM HERE!', rAssociations)
        //return all contract associations by current user
        let assocsByCurrentUser = rAssociations.filter(assoc => +assoc.userId === +passport.user)

        //add unique contract IDs to set
        assocsByCurrentUser.forEach(association => associationContractIds.add(association.contractId))

        let otherUserIdArr = []

        //compose inbox Map by contract ID
        associationContractIds.forEach((contractId, v2, set) => {
            let contract, assocs, otherUser
            assocs = rAssociations.filter(association => +association.contractId === +contractId)

            //find other user by looking through assocs and filtering out current user
            //grabbing the other user's ID and finding them in the DB
            let otherUserAssocs = assocs.filter(assoc => +assoc.userId !== +passport.user)
            otherUserIdArr.push(otherUserAssocs[0].userId)
            
            // finally compose object and add it to Map
            contractsByContractId[contractId] = { associations: assocs }
        })
        return otherUserIdArr
      })
      .then( otherUserIdArr => {
        otherUserPromiseArr = otherUserIdArr.map(otherUserId => {
          return User.findById(otherUserId)
        })

        return Promise.all(otherUserPromiseArr)
      })
      .then(rOtherUsersArr => {
        let contractPromiseArr = []
        rOtherUsersArr.forEach(otherUser => {
          associationContractIds.forEach((contractId, v2, set) => {
            // finally compose object and add it to Map
            contractPromiseArr.push(Contract.findById(contractId))
            contractsByContractId[contractId] = { ...contractsByContractId[contractId], otherUser: otherUser }
          })
        })
        return Promise.all(contractPromiseArr)
      })
      .then(rContractsArr => {
        rContractsArr.forEach(contract => {
          associationContractIds.forEach((contractId, v2, set) => {
            // finally compose object and add it to Map
            contractsByContractId[contractId] = { ...contractsByContractId[contractId], contract: contract }
          })
        })
        req.session.inbox = contractsByContractId
        return req.session.inbox
      })
      .then(newInbox => {
        console.log('NEWiNBOX', newInbox)
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
