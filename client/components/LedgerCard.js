import React, {Component} from 'react'
import {connect} from 'react-redux'

const LedgerCard = (props) => {
      const {trade} = props
      let tradeItemImgsUser1 = trade.user1.itemImgs.map( (item, index) => <img className="ledger-item-img" src={item} key={index} />)
      console.log("ITEMS: ", trade.user1.itemImgs)
      console.log("ITEMS USER2: ", trade.user2.itemImgs)
      let tradeItemImgsUser2 = trade.user2.itemImgs.map( (item, index) => <img className="ledger-item-img" src={item} key={index} />)
        return (
          <div className="card w-100">
          { trade.user1 ?
            <div className="card-body">
            <p className="card-title col-12"><b>{trade.user1.name}</b> swapped with <b>{trade.user2.name}</b></p>
            <div className="d-flex flex-row align-items-center">
              <p className="card-user-icon">{trade.user1.name.slice(0,2)}</p>
              <p className="card-user-text">{trade.user1.comments}</p>
            </div>
            <div className="d-flex col-12 align-items-center justify-content-center">
              <div className="d-flex">{tradeItemImgsUser1}</div>
              <div className="d-flex swap-icon"><i className="fas fa-exchange-alt fa-2x" /></div>
              <div className="d-flex">{tradeItemImgsUser2}</div>
            </div>
            <div className="d-flex flex-row-reverse align-items-center">
              <p className="card-user-icon">{trade.user2.name.slice(0,2)}</p>
              <p className="card-user-text">{trade.user2.comments}</p>
            </div>
            </div>
            : <h1>No Recent Trades!</h1>
            }
          </div>
      )
}

const mapState = (state) => {
    return {
    }
}

const mapDispatch = (dispatch) => {
    return {
      getRelatedUsersAndItems(contract) {
        dispatch(getContractUsersAndItems(contract))
      }
  }
}

export default connect(mapState, mapDispatch)(LedgerCard)

