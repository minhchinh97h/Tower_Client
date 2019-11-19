import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import Calendar from './components/calendar/Calendar.Container'
import SummaryHolder from './components/summary-holder/SummaryHolder.Container'
import ChartsHolder from "./components/charts-holder/ChartsHolder.Container";

import ProgressHeader from "./components/header/ProgressHeader.Container";

export default class Progress extends React.PureComponent {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return ({
      header: <ProgressHeader navigation={navigation} />,
      swipeable: false
    })
  }

  current_date = new Date()

  state = {
    choose_month_bool: false,
    month: this.current_date.getMonth(),
    year: this.current_date.getFullYear(),

    chosen_month: this.current_date.getMonth(),
    chosen_year: this.current_date.getFullYear(),

    data: []
  }

  _setChosenMonthFromCalendar = (month) => {
    this.setState({
      chosen_month: month
    })
  }

  _setChosenYearFromCalendar = (year) => {
    this.setState({
      chosen_year: year
    })
  }

  _keyExtractor = (item, index) => `progress-${item.id}-component`

  _renderItem = ({ item, index }) => {
    if (item.id === "calendar") {
      return (
        <Calendar
          _setChosenMonthFromCalendar={this._setChosenMonthFromCalendar}
          _setChosenYearFromCalendar={this._setChosenYearFromCalendar}
        />
      )
    }

    else if (item.id === "summary-holder") {
      return (
        <SummaryHolder
          chosen_month={this.state.chosen_month}
          chosen_year={this.state.chosen_year}
        />
      )
    }

    return (
      <ChartsHolder />
    )
  }

  componentDidMount() {
    const didFocusScreen = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.props.changeRouteAction(payload.state.routeName)
      }
    )

    let data = []

    data.push({
      id: "calendar"
    })
    data.push({
      id: "summary-holder"
    })
    data.push({
      id: "charts-holder"
    })
    this.setState({
      data
    })
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "white"
        }}
      >
        <FlatList
          data={this.state.data}
          extraData={this.state.should_flatlist_update}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}
