import { connect } from 'react-redux'
import { toggleReturn } from '../../shared/actions/otherAction'
import Header from './Header'

const mapStateToProps = (state, ownProps) => ({
    headerText: state.headerText,
    currentRoute: state.currentRoute
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleReturn: () => dispatch(toggleReturn())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)