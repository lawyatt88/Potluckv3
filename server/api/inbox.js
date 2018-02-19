const router = require('express').Router()
const { Item, Contract, ContractAssociations, User } = require("../db/models");

router.get('/', (req, res, next) => {
    let { inbox, passport } = req.session
    console.log('req.session', req.session)
    //instanciate object for inbox on session
    const contractsByContractId = {}
    //find contract IDs and status from associations contractIds
    const associationContractIds = new Set()

    ContractAssociations.findAll()
    .then(associations => Promise.all(associations))
    .then(rAssociations => {
        // console.log('I AM HERE!', rAssociations)
        //return all contract associations by current user
        let assocsByCurrentUser = rAssociations.filter(assoc => +assoc.userId === +passport.user)
        let assocIds = assocsByCurrentUser.map(assoc => assoc.contractId).sort((x, y) => x - y)

        //add unique contract IDs to set
        assocIds.forEach(assocId => associationContractIds.add(assocId))
        console.log('associationContractIds', associationContractIds)

        let otherUserPromiseArr = [], contractPromiseArr = []

        //compose inbox object by contract ID
        associationContractIds.forEach((contractId, v2, set) => {
          console.log('inLoo00000000p',contractId)
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
        console.log('RESOLVED OTHER USERS', rOtherUsersArr)  //shows up correctly
        console.log('RESOLVED CONTRACTS', rContractArr) //shows up correctly
        // set user with appropriate contract key
        for (var contractId in contractsByContractId) {
          console.log(contractId)
          contractsByContractId[contractId] = { ...contractsByContractId[contractId], otherUser: rOtherUsersArr.shift(), contract: rContractArr.shift() }
        }

        req.session.inbox = contractsByContractId
        return req.session.inbox
      })
      .then(newInbox => {
        console.log('newInbox', newInbox)
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
