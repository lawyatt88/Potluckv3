import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Router } from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Main, Login, Signup, UserHome, Market, Basket, Inbox, Account, MessageInbox, Pantry, RequestTicket, Ledger} from './components'
import {me, fetchContracts, fetchAllItems, fetchCompletedContracts, fetchInbox, fetchBasket} from './store'



/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
      this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, inbox} = this.props

    return (
      <Router history={history}>
        <Main>
          <Switch>
            {/* Routes placed here are available to all visitors */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            {
              isLoggedIn &&
              <Switch>
              {/* Routes placed here are available to logged in users */}
              <Route exact path="/market" component={Market} />
              <Route exact path="/community" component={Ledger} />
              <Route exact path="/basket" component={Basket} />
              <Route exact path="/inbox" component={Inbox} />
              <Route exact path="/account" component={Account} />
              <Route exact path="/messageinbox" component={MessageInbox} />
              <Route exact path="/pantry" component={Pantry} />
              <Route path="/:id" component={RequestTicket} inbox={inbox} />
              </Switch>
            }
            {/* Displays our Login component as a fallback */}
            <Route component={Login} />
          </Switch>
        </Main>
      </Router>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    currentUser: state.user,
    inbox: state.inbox
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData () {
      dispatch(me())
      dispatch(fetchContracts())
      dispatch(fetchAllItems())
      dispatch(fetchCompletedContracts())
      dispatch(fetchBasket())
    }
  }
}

export default connect(mapState, mapDispatch)(Routes)

// export default Routes

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
