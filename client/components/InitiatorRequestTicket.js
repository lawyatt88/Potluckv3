import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import ItemCard from './ItemCard'
import Pantry from './Pantry'
import { fetchContractAssociations, updateContract, removeFromOffer, removeFromMyMarket, updateContractStatus, completeContractStatus } from '../store'

const InitiatorRequestTicket = (props) => {
    console.log('PROPS FROM init request ticket', props)
    const { items, contractId, currentUser, offer, inbox, path, updateContractHandler, approveSwapHandler, completeSwapHandler, } = props

    //first items belong to currentUser
    const contractInQuestion = inbox[+contractId].contract
    const otherUserName = inbox[+contractId].otherUser.username

    const initiatorAssociation = inbox[+contractId].associations.find(assoc => assoc.userId === currentUser.id)
    let initItemIds = initiatorAssociation.itemIds.split(", ")
    let initContractItems
    if (initItemIds) {
        initContractItems = initItemIds.map(oneItemId => {
            return items.find(item => +item.id === +oneItemId)
        })
    }
    console.log('initCONTRACTITEMS', initContractItems)
    
    if(contractInQuestion.status !== 'Created') {
        const responderId = inbox[+contractId].otherUser.id
        const resAssociation = inbox[+contractId].associations.find(assoc => assoc.userId === responderId)
        console.log('resAssociation', resAssociation)
    
        let resItemIds = resAssociation.itemIds.split(", ")
        let resContractItems
        if (resItemIds) {
            resContractItems = resItemIds.map(oneItemId => {
                return items.find(item => +item.id === +oneItemId)
            })
        }
    }
    
    let display
    switch (contractInQuestion.status) {
        case 'Created':
            display =
                (<div>
                    <div className="requested-items">
                        <h3>{`You requested`}</h3>
                        <ul className="request-ticket-card"  >
                            {initContractItems &&
                                <li>
                                    <ItemCard itemOwnerId={currentUser.id} items={initContractItems} path={path} inRequest="true" />
                                </li>
                            }
                        </ul>
                        <h3>{`from ${otherUserName}`}</h3>
                    </div>
                </div>)
            break;
        case 'FirstReview':
            // would change after other user opened request
            break;
        case 'SecondReview':
            // changes after currentUser opens it from firstReview
            display =
                (<div className="requested-items">
                    <button type="button" className="btn btn-primary" onClick={() => approveSwapHandler(contractInQuestion)}>
                        Let's swap!
                </button>
                    <h3>Requested from you:</h3>
                    <ul className="request-ticket-card"  >
                        {initContractItems &&

                            <li>
                                <ItemCard itemOwnerId={currentUser.id} items={initContractItems} path={props.match.path} inRequest="true" />
                            </li>
                        }
                    </ul>
                    <h3>Your request:</h3>
                    <ul className="request-ticket-card"  >
                    {resContractItems &&
                        <li>
                            <ItemCard itemOwnerId={currentUser.id} items={resContractItems} path={props.match.path} inRequest="true" />
                        </li>
                    }
                    </ul>
                </div>)
            break;
        case 'Pending':
            display =
                (<div className="requested-items">
                    <button type="button" className="btn btn-primary" onClick={() => completeSwapHandler(contractInQuestion, currentUser)}>
                        Complete swap!
                </button>
                    <h3>Requested from you:</h3>
                    <ul className="request-ticket-card"  >
                        {initContractItems &&
                            initContractItems.map(item => <li key={item.id}>{item.name}</li>)}
                    </ul>
                    <h3>Your request:</h3>
                    <ul className="request-ticket-card"  >
                    {resContractItems &&
                        resContractItems.map(item => <li key={item.id}>{item.name}</li>)}
                        </ul>
                </div>)
            break;
        case 'Completed':
        display =
        (<div className="requested-items">
            <h3>Requested from you:</h3>
            <ul className="request-ticket-card"  >
                {initContractItems &&
                    initContractItems.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
            <h3>Your request:</h3>
            <ul className="request-ticket-card"  >
            {resContractItems &&
                resContractItems.map(item => <li key={item.id}>{item.name}</li>)}
                </ul>
                <h4>Date completed: {contractInQuestion.updatedAt}</h4>
        </div>)

            break;
        case 'Canceled':

            break;
        default:
        
    }


    
    
    return (
        <div className="request-ticket container">
            {/*<h5>Lets make a swap!</h5>*/}
            <p>Status: {contractInQuestion.status} </p>
            {display}
        </div>
    )
}

const mapState = (state, ownProps) => {
    return {
        items: state.market,
        currentUser: state.user,
        offer: state.offer
    }
}

const mapDispatch = (dispatch, ownProps) => {
    return {
        updateContractHandler: (items, contract, sender, senderId, currentUser) => {
            const solicitor = sender
            dispatch(updateContract(items, contract, solicitor, senderId, currentUser))
            items.forEach(item => {
                // dispatch(removeFromOffer(item.id))
                dispatch(removeFromMyMarket(item.id))
            })
            // sends update to contract via web3, and then gets all contracts
            // will request ticket automatically update?
            // need to send message to the user who initiated the contract
        },
        approveSwapHandler: (contract) => {
            dispatch(updateContractStatus(+contract.id, { status: 'Pending' }))
        },
        completeSwapHandler: (contract, currentUser) => {
            console.log('CONTRACTANDCURRENTUSER', contract, currentUser)
            dispatch(completeContractStatus(contract, currentUser))
        }

    }
}

export default connect(mapState, mapDispatch)(InitiatorRequestTicket)