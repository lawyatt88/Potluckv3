import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout, stopGethInst} from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Main extends Component {
  componentDidMount(){
    let {pathname} = this.props.location
    this.topNavHeight = this.refs.topnav.clientHeight
    this.bottomNavHeight = 80
  }

  render(){
  console.log('i am props', this.props)
  const {children, isLoggedIn, user, inbox, basket, match} = this.props
  console.log('LOCATION PATH', location.pathname)

  let title
  switch(location.pathname) {
    case '/': {title = 'POTLUCK'
    this.bottomNavHeight = 0
    }
    break;
    case '/login': {title = 'POTLUCK'
    this.bottomNavHeight = 0
    }
    break;
    case '/signup': {title = 'POTLUCK'
    this.bottomNavHeight = 0
    }
    break;
    case '/community': title = 'Community Board'
    break;
    case '/market': title = 'Market'
    break;
    case '/basket': title = 'Basket'
    break;
    case '/inbox': title = 'Inbox'
    break;
    case '/account': title = 'Account'
    break;
    case '/pantry': title = 'My Pantry'
    break;
    case '/login': title = 'POTLUCK' 
    break;
    case '/signup': title = 'POTLUCK' 
    break;
    default: title = "Let's make a swap!"
  }

  return (
    <div style={{paddingTop: this.topNavHeight, paddingBottom: this.bottomNavHeight}}>
      <div ref="topnav" id="title" className="navbar fixed-top"><h3>{title}</h3></div>
      {
        isLoggedIn &&
        <nav ref="bottomnav" id="main" className="navbar fixed-bottom nav-fill">
          {/* The navbar will show these links after you log in */}
          <Link to="/community" className="nav-item" ><i className="fas fa-users" /></Link>
          <Link to="/market" className="nav-item"><i className="fas fa-lemon" /></Link>
          <Link to="/pantry" className="nav-item"><img src="./icons/pantry-icon-solid-01.png" className="menu-icon" /></Link>
          <Link to="/basket" className="nav-item"><i className="fas fa-shopping-basket" />({basket.length})</Link>
          <Link to="/inbox" className="nav-item"><i className="fas fa-envelope" />({Object.keys(inbox).length})</Link>
          <Link to="/account" className="nav-item"><i className="fas fa-cog" /></Link>
        </nav>
      }
      {children}
    </div>
  )}
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    basket: state.basket,
    user: state.user,
    inbox: state.inbox
  }
}

const mapDispatch = (dispatch) => {
    return {
      
    }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired
}
