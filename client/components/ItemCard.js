import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateBasket, addToBasket, removeFromBasket, returnToMyMarketThunk, removeFromMyMarket, addToOffer, removeFromOffer, createContractWeb3 } from '../store'

const ItemCard = (props) => {
    const { currentUser, items, item, inRequest, ownProps } = props

    let buttonText, clickHandler

    let inRequestTicket = ownProps.match.path === '/:id'

    const cardBody = singleItem => {
        console.log('SINGLEITEM', singleItem)
            switch (props.path) {
                case '/pantry':
                    buttonText = inRequestTicket ? <i className="fa fa-plus" aria-hidden="true" /> : <i className="fa fa-minus" aria-hidden="true" />
                    clickHandler = inRequestTicket ? event => props.handleAddToOffer(event, singleItem, currentUser.id) : () => {}
                break;

                case '/market':
                    buttonText = (singleItem.status === 'InEscrow') ? <div className="pending-item"><i className="fas fa-clock" /><i className="fa fa-plus" aria-hidden="true" /></div> : <i className="fa fa-plus" aria-hidden="true" />
                    clickHandler = event => props.handleAddToBasket(event, singleItem, currentUser.id)
                break;

                case '/basket':
                    buttonText = <i className="fa fa-times" aria-hidden="true" />
                    clickHandler = event => props.handleRemoveFromBasket(event, singleItem.id, currentUser.id)
                break;

                case '/:id':
                    buttonText = <i className="fa fa-times" aria-hidden="true" />
                    clickHandler = event => props.handleRemoveFromOffer(event, singleItem.id, currentUser.id)
                break;

                default:
                    buttonText = <i className="fa fa-times" aria-hidden="true" />
                    clickHandler = () => {}
              }

        let returnDisplay = 
        (
            <div key={singleItem.id} className="row card-body-wrapper">
                <div className="col-3">
                    <img src={`${singleItem.iconUrl}`} className="card-icon" />
                </div>
                <div className="card-text-wrapper col-7 d-inline-flex flex-column justify-content-center">
                    <h5 className="card-title">{singleItem.name}</h5>
                    {!inRequest &&
                        <div>
                            <p className="card-text">{singleItem.description}</p>
                            {(props.match.path !== '/pantry') && <h6>On offer by {singleItem.user.username}</h6>}
                        </div>
                    }
                </div>
                <div className="col-2" onClick={clickHandler}>{buttonText}</div>
            </div>
        )
        return returnDisplay
    }

    const display = items ? items.map(ownersItem => cardBody(ownersItem)) : cardBody(item)

    return (
        <div className="card w-100">
            <div className="card-body">
                {display}
            </div>
        </div>
    )
}

const mapState = (state, ownProps) => {
    return {
        currentUser: state.user,
        ownProps: ownProps
    }
}

const mapDispatch = (dispatch, ownProps) => {
    return {
        handleAddToBasket: (event, singleItem, userId) => {
            dispatch(updateBasket(singleItem))
            dispatch(removeFromMyMarket(singleItem.id))
        },
        handleRemoveFromBasket: (event, itemId, userId) => {
            dispatch(removeFromBasket(itemId))
            dispatch(returnToMyMarketThunk(itemId))
        },
        handleAddToOffer: (event, singleItem, userId) => {
            dispatch(addToOffer(singleItem, userId))
            dispatch(removeFromMyMarket(singleItem.id))
        },
        handleRemoveFromOffer: (event, itemId, userId) => {
            dispatch(removeFromOffer(itemId, userId))
            dispatch(returnToMyMarketThunk(itemId))
        }
    }
}

export default withRouter(connect(mapState, mapDispatch)(ItemCard))
