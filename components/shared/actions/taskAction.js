export const updateTask = (type, data) => ({
    type,
    data
})

export const deleteTask = (type, id) => ({
    type,
    id
})

export const deleteAllTasksInCategory = (type, category_id) => ({
    type,
    id: category_id
})