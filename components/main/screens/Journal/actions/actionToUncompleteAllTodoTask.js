export const actionToUncompleteAllTodoTask = ({id, title, completed}) => ({
    type: 'ACTION_UNCOMPLETE_ALL_TODO',
    id,
    title,
    completed
})