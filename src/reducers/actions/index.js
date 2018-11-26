import { createActions } from 'redux-actions'
import { message } from 'antd'

export default function createActionsHandler(apis) {
    const actions = createActions({
        TEST_ACTION: async val => ({
            test: val
        }),
        CHANGE_THEME: (theme) => {
            localStorage.theme = theme
            return {
                theme
            }
        },
        GET_USER_AUTH: async () => {
            try {
                const res = await apis.getUserAuth()
                if (res.code === 0) {
                    localStorage.userAuth = JSON.stringify(res.data)
                    return {
                        userAuth: res.data
                    }
                }
            } catch (e) {
                message.error(e.message)
            }
            localStorage.userAuth = 0
            return {
                userAuth: 0
            }
        },
        CLEAR_USER_AUTH: () => ({ userAuth: 0 })
    })
    return actions
}
