let initialState = {
    pri_01: {
        name: "Do First",
        importance: 1,
        urgency: 1
    },

    pri_02: {
        name: "Plan",
        importance: 1,
        urgency: 0
    },

    pri_03: {
        name: "Delay",
        importance: 0,
        urgency: 1
    },

    pri_04: {
        name: "Delegate",
        importance: 0,
        urgency: 0
    },

}

export const priorities = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}