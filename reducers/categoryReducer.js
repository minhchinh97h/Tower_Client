let initialState = {
    cate_0: {
        name: "Inbox",
        color: "red",
        quantity: 0
    }
}

export const categories = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_CATEGORY':
            return { ...state, ...action.data }

        case 'UPDATE_CATEGORY':
            let categories = { ...state }

            categories[action.id] = { ...action.data }

            return categories

        case 'DELETE_CATEGORY':
            let categories_clone = { ...state }

            delete categories_clone[action.id]
            
            return categories_clone

        default:

            return state
    }
}

export const currentChosenCategory = (state = "general", action) => {
    switch(action.type){
        case 'UPDATE_CURRENT_CHOSEN_CATEGORY':
            return action.data

        default:
            return state
    }
}