import React from 'react'
import { connect } from 'react-redux'
import { fetchAllItems, fetchContractAssociations } from '../store'


const InboxCard = (props) => {
    
    const { request, requests, contracts, currentUser, items, inbox, otherUser } = props
    console.log('im the request~', request)
    let displayMessage

    const item = items.find(singleItem => +singleItem.userId === +otherUser.id)
    
    const message = (currentContract) => {
      switch (currentContract.status) {
        case 'Created':
          return `You have a new request from ${otherUser.username}`
          break;
        case 'FirstReview': // user2 is looking over user1's initial trade request
          return `${otherUser.username} is considering your request!`
          break;
        case 'SecondReview': // user1 reviews updated request and will confirm the trade with "Let's Swap!"
          return `${otherUser.username} has responded - confirm your trade!`
          break;
        case 'Pending': // after user1 has confirmed the trade with "Let's Swap"
          return `You and ${otherUser.username} have agreed to trade...`
          break;
        // case 'Completed':
        default:
          return `Your have a request!`
      }
    }

    if (request) displayMessage = message(request)
    
    

    // SWITCH on contract.status
    // find one item in the current request that belongs to the other user, so that we can interpolate that user's username into the message

    // if (request && item) message = `You have a new request from ${item.user.username}`

    //add different messages based off of contract status

    return (
                <div className="card w-100">
                    <div className="card-body">
                        {displayMessage}
                    </div>
                </div>
            )
}

const mapState = (state) => {
    return {
        items: state.market,
        inbox: state.inbox,
        currentUser: state.user
    }
}

const mapDispatch = (dispatch, ownProps) => {
    // dispatch(fetchAllItems())
    return {}
}

export default connect(mapState, mapDispatch)(InboxCard)
