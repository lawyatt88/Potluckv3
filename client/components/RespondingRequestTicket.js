import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import ItemCard from './ItemCard'
import Pantry from './Pantry'
import { fetchContractAssociations, updateContract, removeFromOffer, removeFromMyMarket, updateContractStatus, completeContractStatus } from '../store'

const RespondingRequestTicket = (props) => {
    console.log('PROPS FROM responder request ticket', props)

    const { items, contractId, currentUser, offer, inbox, path, updateContractHandler, approveSwapHandler, completeSwapHandler, } = props
    
    //first items belong to otherUser
    const contractInQuestion = inbox[+contractId].contract
    const otherUserName = inbox[+contractId].otherUser.username

    const resAssociation = inbox[+contractId].associations.find(assoc => assoc.userId === currentUser.id)
    let resContractItems = null
    console.log('resAssociation.itemIds', resAssociation.itemIds)
    if (resAssociation.itemIds) {
        let resItemIds = resAssociation.itemIds.split(", ")
        console.log('resITemIds', resItemIds)
        if (resItemIds) {
            resContractItems = resItemIds.map(oneItemId => {
                return items.find(item => +item.id === +oneItemId)
            })
        }
    }
    console.log('resCONTRACTITEMS', resContractItems)
    

    //initiator 
    const otherUserId = inbox[+contractId].otherUser.id
    const otherUser = inbox[+contractId].otherUser
    const initAssociation = inbox[+contractId].associations.find(assoc => assoc.userId === otherUserId)
    let initItemIds = initAssociation.itemIds.split(", ")
    let initContractItems
    if (initItemIds) {
        initContractItems = initItemIds.map(oneItemId => {
            return items.find(item => +item.id === +oneItemId)
        })
    }
    console.log('initCONTRACTITEMS', initContractItems)
    
    let display
    switch (contractInQuestion.status) {
        case 'Created':
            display =
                (<div>
                    <div className="requested-items">
                        <h3>Requested from you:</h3>
                        <ul className="request-ticket-card"  >
                            {initContractItems &&
                                <li>
                                    <ItemCard itemOwnerId={currentUser.id} items={initContractItems} path={path} inRequest="true" />
                                </li>
                            }
                        </ul>
                        <h3>Your request:</h3>
                        {offer &&
                            <div>
                                <ItemCard itemOwnerId={otherUserId} items={offer} path={path} inRequest="true" />
                                <button type="button" className="btn btn-primary" onClick={() => updateContractHandler(offer, contractInQuestion, otherUser, otherUserId, currentUser)}>
                                    Send Request <i className="fas fa-arrow-circle-right" />
                                </button>
                            </div>
                        }
                    </div>
                    <hr />
                    <div className="sender-pantry">
                        <Pantry senderId={otherUserId} path={props.match.path} />
                    </div>
                </div>)
            break;
        case 'FirstReview':
            display =
            (<div>
            {!resAssociation.itemIds &&
                <div> 
                <div className="requested-items">
                        <h3>Requested from you:</h3>
                        <ul className="request-ticket-card"  >
                            {initContractItems &&
                                <li>
                                    <ItemCard itemOwnerId={currentUser.id} items={initContractItems} path={path} inRequest="true" />
                                </li>
                            }
                        </ul>
                        <h3>Your request:</h3>
                        {offer && 
                            <div>
                                <ItemCard itemOwnerId={otherUserId} items={offer} path={path} inRequest="true" />
                                <button type="button" className="btn btn-primary" onClick={() => updateContractHandler(offer, contractInQuestion, otherUser, otherUserId, currentUser)}>
                                    Send Request <i className="fas fa-arrow-circle-right" />
                                </button>
                            </div>
                        }
                        </div>
                        <hr />
                        <div className="sender-pantry">
                            <Pantry senderId={otherUserId} path={props.match.path} />
                        </div>
                        </div>
                    }
                    {resAssociation.itemIds &&
                        <div>
                            <h4>{`Your response has been sent!`}</h4>
                            <hr />
                            <div className="requested-items">
                                <h3>Requested from you:</h3>
                                <ul className="request-ticket-card"  >
                                    {initContractItems &&
                                        initContractItems.map(item => <li key={item.id}>{item.name}</li>)}
                                </ul>
                                <h3>Your request:</h3>
                                <ul className="request-ticket-card"  >
                                {resContractItems &&
                                    resContractItems.map(item => <li key={item.id}>{item.name}</li>)}
                                {offer &&
                                    offer.map(item => <li key={item.id}>{item.name}</li>)}
                                </ul>
                            </div> 
                        </div>}
                    </div>
                    )
            break;
        case 'SecondReview':
            display =
                (resAssociation.itemIds &&
                <div>
                    <h4>{`${otherUserName} is considering your trade!`}</h4> 
                    <hr />
                    <div className="requested-items">
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
                    </div>
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
                        {reqContractItems &&
                            reqContractItems.map(item => <li key={item.id}>{item.name}</li>)}
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
                {reqContractItems &&
                    reqContractItems.map(item => <li key={item.id}>{item.name}</li>)}
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
        requests: state.inbox,
        currentUser: state.user,
        contractId: ownProps.match.params.id,
        offer: state.offer,
        contracts: state.requests
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

export default withRouter(connect(mapState, mapDispatch)(RespondingRequestTicket))