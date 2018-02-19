import React from 'react'
import InboxCard from './InboxCard'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { updateContractStatus } from '../store'

const Inbox = (props) => {
    const { currentUser, inbox, changeStatusToFirstReview, changeStatusToSecondReview } = props
    console.log('the INBOX', inbox)
    let createdRequests = [], firstReviewRequests = [], secondReviewRequests = [], pendingRequests = [], completedRequests = [], canceledRequests = [];
    
    for (var contractId in inbox) {
        let currentContract = inbox[contractId].contract
        switch (currentContract.status) {
            case 'Created':
                createdRequests.push(currentContract)
                break;
            case 'FirstReview':
                firstReviewRequests.push(currentContract)
                break;
            case 'SecondReview':
                secondReviewRequests.push(currentContract)
                break;
            case 'Pending':
                pendingRequests.push(currentContract)
                break;
            case 'Completed':
                completedRequests.push(currentContract)
                break;
            case 'Canceled':
                canceledRequests.push(currentContract)
                break;
            default:
                createdRequests.push(currentContract)
        }
    }

    
    let inboxBody
    if (!Object.keys(inbox).length) inboxBody = <h5>No current requests.</h5>
    else inboxBody = (
        <div className="container">
            <h3>New Requests</h3>
            {createdRequests &&
                <div>
                    <h5>A user is interested in making a trade!</h5>
                    <ul className="ticket-list">
                        {createdRequests.map(request => {
                            let myAssoc = inbox[request.id].associations.find(assoc => +assoc.userId === +currentUser.id)
                            let createdClickHandler = myAssoc.initiator ? () => {} : () => changeStatusToFirstReview(request)
                            console.log('createdClickHandler', createdClickHandler)
                            return (
                                <li key={request.id} className="request-ticket-card" onClick={createdClickHandler}>
                                    <Link to={`/${request.id}`}>
                                        <InboxCard request={request} otherUser={inbox[request.id].otherUser} />
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
            <h3>In Review</h3>
            { (secondReviewRequests || firstReviewRequests) &&
                <div>
                    <h5>Your request is being reviewed!</h5>
                    <ul className="ticket-list">
                        {firstReviewRequests &&
                            firstReviewRequests.map(request => {
                                let myAssoc = inbox[request.id].associations.find(assoc => +assoc.userId === +currentUser.id)
                                let firstReviewClickHandler = myAssoc.initiator ? () => changeStatusToSecondReview(request) : () => {}
                                console.log('firstReviewClickHandler', firstReviewClickHandler)
                                return (
                                    <li key={request.id} className="request-ticket-card" onClick={firstReviewClickHandler} >
                                        <Link to={`/${request.id}`}>
                                            <InboxCard request={request} otherUser={inbox[request.id].otherUser} />
                                        </Link>
                                    </li>
                                )
                            })
                        }
                        {secondReviewRequests &&
                            secondReviewRequests.map(request => {
                                return (
                                    <li key={request.id} className="request-ticket-card">
                                        <Link to={`/${request.id}`}>
                                            <InboxCard request={request} otherUser={inbox[request.id].otherUser} />
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                }
            <h3>Pending</h3>
            {pendingRequests &&
                <div>
                    <h5>Congrats! Both users have confirmed the trade. Meet up in person to exchange your foods and receive 10 Potluck Points!</h5>
                    <ul className="ticket-list">
                            {pendingRequests.map(request => {
                                return (
                                    <li key={request.id} className="request-ticket-card">
                                        <Link to={`/${request.id}`}>
                                            <InboxCard request={request} otherUser={inbox[request.id].otherUser} />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                </div>
            }
            <h3>Completed</h3>
            {completedRequests &&
                <div>
                <h5>Way to go! Here's a list of your successful trades:</h5>
                <ul className="ticket-list">
                        {completedRequests.map(request => {
                            return (
                                <li key={request.id} className="request-ticket-card">
                                    <Link to={`/${request.id}`}>
                                        <InboxCard request={request} otherUser={inbox[request.id].otherUser} />
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
        </div>
    )

    return inboxBody
}

const mapState = (state) => {
    return {
        inbox: state.inbox,
        currentUser: state.user,
    }
}

const mapDispatch = (dispatch) => {
    return {
        changeStatusToFirstReview: (contract) => dispatch(updateContractStatus(contract.id, {status: 'FirstReview'})),
        changeStatusToSecondReview: (contract) => dispatch(updateContractStatus(contract.id, {status: 'SecondReview'}))
    }
}

export default withRouter(connect(mapState, mapDispatch)(Inbox))
