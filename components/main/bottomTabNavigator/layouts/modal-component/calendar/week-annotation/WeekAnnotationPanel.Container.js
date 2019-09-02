import {connect} from 'react-redux'
import {updateTask} from '../../../../../../shared/actions/taskAction'
import WeekAnnotationPanel from './WeekAnnotationPanel'

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateTask: (data) => dispatch(updateTask("UPDATE_NEW_WEEK_TASK", data))
})

export default connect(
    null,
    mapDispatchToProps
)(WeekAnnotationPanel)