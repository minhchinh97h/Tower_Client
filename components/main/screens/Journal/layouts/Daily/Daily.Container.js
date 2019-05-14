import {connect} from 'react-redux'
import {changeRoute} from './actions/ChangeRoute'
import Daily from './Daily.Presentational'

const mapStateToProps = (state) => ({
    routeName: state.currentRoute
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    changeRouteAction: (routeName) => dispatch(changeRoute(routeName))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Daily)