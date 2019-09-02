import { connect } from 'react-redux'
import {
    updateCategory,
    createCategory,
    chooseCategory,
    deleteCategory
} from '../shared/actions/categoryAction'

import {deleteAllTasksInCategory} from '../shared/actions/taskAction'

import Drawer from './DrawerVer2'

const mapStateToProps = (state, ownProps) => ({
    categories: state.categories
})

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