export const updateHeaderText = (data) => ({
    type: "UPDATE_HEADER_TEXT",
    data
})

export const changeRouteAction = routeName => ({
    type: 'CHANGE_ROUTE',
    routeName
})

export const toggleReturn = () => ({
    type: 'TOGGLE_RETURN'
})

export const updateTitle = (title) => ({
    type: "CHANGE_ADD_TASK_TITLE",
    title
})

export const updateType = (type, task_type) => ({
    type,
    data: {
        type: task_type
    }
})

export const updateDescription = (description) => ({
    type: "CHANGE_ADD_TASK_DESCRIPTION",
    description
})

export const changeAnnotation = (annotation) => ({
    type: "CHANGE_CURRENT_ANNOTATION",
    annotation
})