import { connect } from 'react-redux'
import { changeRouteAction } from '../actions/otherAction'
import JournalTab from './JournalTab'

const mapStateToProps = (state, ownProps) => {
    if (ownProps.type === "day") {
        return ({
            routeName: state.currentRoute,
            tasks: state.day_tasks,
            categories: state.categories,
            priorities: state.priorities,
            completed_tasks: state.completed_day_tasks,
            current_chosen_category: state.currentChosenCategory,
        })
    }

    else if (ownProps.type === "week"){
        return ({
            routeName: state.currentRoute,
            tasks: state.week_tasks,
            categories: state.categories,
            priorities: state.priorities,
            completed_tasks: state.completed_week_tasks,
            current_chosen_category: state.currentChosenCategory,
        })
    }

    return ({
        routeName: state.currentRoute,
        tasks: state.month_tasks,
        categories: state.categories,
        priorities: state.priorities,
        completed_tasks: state.completed_month_tasks,
        current_chosen_category: state.currentChosenCategory,
    })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeRouteAction: (routeName) => dispatch(changeRouteAction(routeName)),
})

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(JournalTab)