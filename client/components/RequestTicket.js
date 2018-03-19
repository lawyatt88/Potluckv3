import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import InitiatorRequestTicket from './InitiatorRequestTicket'
import RespondingRequestTicket from './RespondingRequestTicket'
import { fetchContractAssociations, updateContract, removeFromOffer, removeFromMyMarket, updateContractStatus, completeContractStatus, fetchInbox } from '../store'

class RequestTicket extends Component {
    componentWillUpdate(nextProps, nextState){
        // in case user refreshes request ticket/goes directly to request ticket without going through the inbox component
        const { contractId, currentUser, inbox, match } = nextProps
        let myAssoc = inbox[+contractId].associations.find(assoc => +assoc.userId === +currentUser.id)
        
        this.display = myAssoc.initiator ? <InitiatorRequestTicket inbox={inbox} contractId={contractId} path={match.path} /> : <RespondingRequestTicket inbox={inbox} contractId={contractId} path={match.path} />
    }

    render (){
        const { contractId, currentUser, inbox, match } = this.props
        if (Object.keys(inbox).length) {
            let myAssoc = inbox[+contractId].associations.find(assoc => +assoc.userId === +currentUser.id)
            this.display = myAssoc.initiator ? <InitiatorRequestTicket inbox={inbox} contractId={contractId} path={match.path} /> : <RespondingRequestTicket inbox={inbox} contractId={contractId} path={match.path} />
            
            console.log('display', this.display)
        }
        return (
            this.display || null
        )
    }
}

const mapState = (state, ownProps) => {
    return {
        inbox: state.inbox,
        currentUser: state.user,
        contractId: ownProps.match.params.id,
    }
}

export default withRouter(connect(mapState)(RequestTicket))