export const currentRoute = (state = "", action) => {
    switch (action.type) {
        case 'CHANGE_ROUTE':
            return state = action.routeName
        
        default:
            return state
    }
}