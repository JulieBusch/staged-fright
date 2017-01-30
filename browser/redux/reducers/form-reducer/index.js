import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form/immutable' // <--- immutable import

const reducer = combineReducers({ form })

export default reducer