import {connect} from 'react-redux'
import DayAnnotationPanel from './DayAnnotationPanel'
import {updateStartingDate} from './actions/updateStartingDate'

const mapStateToProps = (state) => ({
    currentTask: state.currentTask
})

const maptDispatchToProps = (dispatch, ownProps) => ({
    updateStartingDate: (data) => dispatch(updateStartingDate(data))
}) 

export default connect(
    mapStateToProps,
    maptDispatchToProps
)(DayAnnotationPanel)