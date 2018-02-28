import axios from 'axios'
import history from '../history'
import {createContractApi} from './contract'

/**
 * ACTION TYPES
 */
const GET_BASKET = 'GET_BASKET'
const ADD_BASKET_ITEM = 'ADD_BASKET_ITEM'
const REMOVE_BASKET_ITEM = 'REMOVE_BASKET_ITEM'
const REMOVE_BASKET = 'REMOVE_BASKET'


/**
 * INITIAL STATE
 */
const defaultBasket = []
/**
 * ACTION CREATORS
 *
 */
const getBasket = basket => ({ type: GET_BASKET, basket })
export const addToBasket = item => ({ type: ADD_BASKET_ITEM, item })
export const removeFromBasket = itemId => ({ type: REMOVE_BASKET_ITEM, itemId })
export const removeBasket = () => ({ type: REMOVE_BASKET })
/**
 * THUNK CREATORS
 */
// export const createContractWeb3 = (items, currentUser, soliciteeId) => dispatch => {
//     console.log("ITEMS inside Web3 createContract", items);
//     let allItems = items.map(item => item.name).join(', ');
//     let itemIds = []
//     items.forEach(itemObj => {
//       itemIds.push(itemObj.id)
//     })
//     itemIds = itemIds.join(', ')
//     console.log('allItems: ', allItems)
//     axios.post('/web3', {allItems, currentUser})
//       .then(result => {
//         // console.log("BASKET.JS RESULTDATA: ", result.data)
//         // const contractAddress = result.data
//         const contractAddress = '0xac4f4D4Ef8TESTdd5cEEFAc9TEST14e3ETESTa33'
//         dispatch(createContractApi(contractAddress, currentUser.id, soliciteeId, itemIds))
//         console.log("END OF CREATE CONTRACT")
//       })
//       .catch(err => console.log(err))
//     }

export const fetchBasket = () => dispatch =>
axios
  .get('/api/basket')
  .then(res => {
    console.log('I AM RES.DATA', res.data)
    dispatch(getBasket(res.data || defaultBasket))})
  .catch(err => console.log(err))

export const updateBasket = item => dispatch =>
axios
  .put('/api/basket/update', item)
  .then(res => dispatch(addToBasket(res.data)))
  .catch(err => console.log(err))

export const deleteLineItem = productId => dispatch =>
axios
  .put('/api/basket/delete', { productId })
  .then(() => axios.get('/api/basket'))
  .then(res => dispatch(getBasket(res.data)))
  .catch(err => console.log(err))

export const submitBasket = orderInfo => (dispatch, getState) =>
axios
  .post('/api/orders', orderInfo)
  .then(res => {
    dispatch(getBasketOrder(res.data))
    return res.data
  })
  .then(order => history.push(`/checkout-confirm/${order.id}`))
  .then(axios.delete('/api/basket'))
  .then(dispatch(resetBasket()))
  .catch(err => console.log(err))

export const clearBasket = () =>
  dispatch => {
    axios.delete('/api/basket')
    .then(_ => {
      dispatch(removeBasket())
      history.push('/login')
    })
    .catch(err => console.log(err))
  }

/**
 * REDUCER
 */
export default function(state = defaultBasket, action) {
  switch (action.type) {
    case GET_BASKET:
      return action.basket
    
    case ADD_BASKET_ITEM:
      return [...state, action.item]

    case REMOVE_BASKET_ITEM:
      console.log("ACTION.ITEMID", action.itemId)
      return state.filter(item => {
        return item.id !== +action.itemId
      })
    
    case REMOVE_BASKET:
      return defaultBasket

    default:
      return state
  }
}
