import {connect} from 'react-redux'
import {changeRouteAction} from '../../shared/actions/otherAction'
import BottomTabNavigator from './BottomTabNavigator.Presentational'

const mapStateToProps = (state) => ({
    routeName: state.currentRoute,
    tasks: state.tasks,
    // The redux connected component will get updated to re-render when mapping to the updated fields in redux store state.
    // currentWeekInMonth: state.currentWeekInMonth 
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeRouteAction: (routeName) => dispatch(changeRouteAction(routeName))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomTabNavigator)