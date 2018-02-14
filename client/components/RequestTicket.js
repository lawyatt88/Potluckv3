import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import InitiatorRequestTicket from './InitiatorRequestTicket'
import RespondingRequestTicket from './RespondingRequestTicket'
import { fetchContractAssociations, updateContract, removeFromOffer, removeFromMyMarket, updateContractStatus, completeContractStatus, fetchInbox } from '../store'

class RequestTicket extends Component {
    componentDidMount() {
        this.props.loadInboxData()
    }

    render (){
        console.log('the proppppppps', this.props)
        const { contractId, currentUser, inbox, match } = this.props
    
        let myAssoc = inbox[+contractId].associations.find(assoc => +assoc.userId === +currentUser.id)
    
        let display = myAssoc.initiator ? <InitiatorRequestTicket inbox={inbox} contractId={contractId} path={match.path} /> : <RespondingRequestTicket inbox={inbox} contractId={contractId} path={match.path} />
        console.log('display', display)
        return (
            inbox && display
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

const mapDispatch = (dispatch, ownProps) => {
    return {
        loadInboxData: () => {
            dispatch(fetchInbox())
        }
    }
}

export default withRouter(connect(mapState, mapDispatch)(RequestTicket))