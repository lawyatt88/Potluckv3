import React from 'react'
import {connect} from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import {logout, stopGethInst} from '../store'


const Account = (props) => {
    const {handleClick, user, stopGeth } = props
    return (
        <div>
            {/*<h2>Account</h2>*/}
            <h3>Welcome, {user.username}</h3>
            <h3>Potluck points: {user.rating}</h3>
            <p onClick={(event) => handleClick(event, user, stopGeth)}>Logout</p>

        </div>
    )
}

const mapState = (state) => {
    return {
        user: state.user
    }
}

const mapDispatch = (dispatch, ownProps) => {
    return {
        handleClick (evt, user, stopGeth) {
            dispatch(logout())
            stopGeth(user)
        },
        stopGeth (user) {
            dispatch(stopGethInst(user))
        }
    }
}

// delete me later

export default withRouter(connect(mapState, mapDispatch)(Account))
