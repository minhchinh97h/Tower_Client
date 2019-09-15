import { connect } from 'react-redux'
import {
    updateCategory,
    createCategory,
    chooseCategory,
    deleteCategory
} from '../shared/actions/categoryAction'

import { deleteAllTasksInCategory } from '../shared/actions/taskAction'

import Drawer from './DrawerVer2'

const mapStateToProps = (state, ownProps) => {
    return ({
        categories: state.categories,
        priorities: state.priorities,
        
        day_tasks: state.day_tasks,
        week_tasks: state.week_tasks,
        month_tasks: state.month_tasks,

        completed_day_tasks: state.completed_day_tasks,
        completed_week_tasks: state.completed_week_tasks,
        completed_month_tasks: state.completed_month_tasks,

        day_stats: state.day_stats,
        month_stats: state.month_stats,
        week_stats: state.week_stats,

        month_chart_stats: state.month_chart_stats,
        week_chart_stats: state.week_chart_stats,
        year_chart_stats: state.year_chart_stats
    })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    createCategory: (data) => dispatch(createCategory(data)),
    updateCategory: (id, data) => dispatch(updateCategory(id, data)),
    chooseCategory: (category) => dispatch(chooseCategory(category)),

    deleteCategory: (category_id) => dispatch(deleteCategory(category_id)),
    deleteAllTasksInCategory: (type, category_id) => dispatch(deleteAllTasksInCategory(type, category_id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Drawer)