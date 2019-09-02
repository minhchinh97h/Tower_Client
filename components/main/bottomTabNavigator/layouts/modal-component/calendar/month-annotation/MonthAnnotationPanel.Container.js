import {connect} from 'react-redux'
import MonthAnnotationPanel from './MonthAnnotationPanel'
import {updateTask} from '../../../../../../shared/actions/taskAction'

const maptDispatchToProps = (dispatch, ownProps) => ({
    updateTask: (data) => dispatch(updateTask("UPDATE_NEW_MONTH_TASK", data))
}) 

export default connect(
    null,
    maptDispatchToProps
)(MonthAnnotationPanel)