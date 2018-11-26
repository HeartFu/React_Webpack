import apis from '@/fetch'
import { handleActions, combineActions } from 'redux-actions'
import createActionsHandler from './actions'

const actions = createActionsHandler(apis)
const {
    changeTheme,
    getUserAuth,
    clearUserAuth
} = actions
// 初始化状态
const initialState = {
    apis,
    theme: localStorage.theme || Object.keys(window.themeUrl)[0],
    userAuth: null,
    ...actions
}

const rootReducer = handleActions({
    [combineActions(getUserAuth, clearUserAuth, changeTheme)]: (state, { payload }) => ({
        ...state,
        ...payload
    })
}, initialState)

export default rootReducer
