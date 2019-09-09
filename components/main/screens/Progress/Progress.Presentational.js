import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Map } from 'immutable'
import { StackedBarChart, XAxis, YAxis } from 'react-native-svg-charts'
import PointEarnedSection from './components/point-earned-section/PointEarnedSection'
import WeekChart from './components/week-chart/WeekChart'
import MonthChart from './components/month-chart/MonthChart'
import YearChart from './components/year-chart/YearChart'

export default class Progress extends React.PureComponent {

  state = {
    choose_month_bool: false,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }



  componentDidMount() {
    const didFocusScreen = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.props.changeRouteAction(payload.state.routeName)
      }
    )
  }

  render() {
    return (
      <>
        <ScrollView>
          <PointEarnedSection
            {...this.props}
          />

          <SummaryHolder
            day_stats={this.props.day_stats}
            week_stats={this.props.week_stats}
            month_stats={this.props.month_stats}
            month={this.state.month}
            year={this.state.year}
          />

          <ChartSection />
        </ScrollView >
      </>
    );
  }
}



class SummaryHolder extends React.PureComponent {

  state = {
    day_total_completions: 0,
    week_total_completions: 0,
    month_total_completions: 0
  }

  getWeek = (date) => {
    let target = new Date(date);
    let dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    let firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  }

  getMonday = (date) => {
    let dayInWeek = new Date(date).getDay()
    let diff = dayInWeek === 0 ? 6 : dayInWeek - 1
    return new Date(new Date(date).getTime() - (diff * 86400 * 1000))
  }

  getNoWeekInMonth = (date) => {
    let nearest_monday = this.getMonday(date)
    let first_moday_of_month = this.getMonday(new Date(date.getFullYear(), date.getMonth(), 7))

    return Math.floor((nearest_monday - first_moday_of_month) / 7) + 1
  }

  updateDayTaskCompletions = (month, year, day_stats_map) => {
    let day_total_completions = 0,
      first_day_of_month = new Date(year, month, 1),
      last_day_of_month = new Date(year, month + 1, 0),
      total_sum = 0

    for (let i = first_day_of_month.getDate(); i <= last_day_of_month.getDate(); i++) {
      let day_timestamp = new Date(year, month, i).getTime()

      if (day_stats_map.has(day_timestamp)) {
        let data = day_stats_map.get(day_timestamp),
          total_sum = data.current.reduce(((total, amount) => total + amount), 0)

        day_total_completions += total_sum
      }
    }

    this.setState({
      day_total_completions
    })
  }

  updateWeekTaskCompletions = (month, year, week_stats_map) => {
    let first_day_of_month = new Date(year, month, 1),
      last_day_of_month = new Date(year, month + 1, 0),
      first_monday = this.getMonday(first_day_of_month),
      last_monday = this.getMonday(last_day_of_month),
      first_week_of_month = this.getWeek(first_monday),
      last_week_of_month = this.getWeek(last_monday),
      week_total_completions = 0,
      total_sum = 0

    for (let i = 0; i <= (last_week_of_month - first_week_of_month); i++) {
      let week_timestamp = first_monday.getTime() + 86400 * 1000 * 7 * i
      if (week_stats_map.has(week_timestamp)) {
        let data = week_stats_map.get(week_timestamp),
          total_sum = data.current.reduce(((total, amount) => total + amount), 0)

        week_total_completions += total_sum
      }
    }

    this.setState({
      week_total_completions
    })
  }

  updateMonthTaskCompletions = (month, year, month_stats_map) => {
    let month_timestamp = new Date(year, month),
      month_total_completions = 0,
      total_sum = 0

    if (month_stats_map.has(month_timestamp)) {
      let data = month_stats_map.get(month_timestamp),
        total_sum = data.current.reduce(((total, amount) => total + amount), 0)

      month_total_completions += total_sum
    }

    this.setState({
      month_total_completions
    })
  }

  componentDidMount() {
    this.updateDayTaskCompletions(this.props.month, this.props.year, Map(this.props.day_stats))
    this.updateWeekTaskCompletions(this.props.month, this.props.year, Map(this.props.week_stats))
    this.updateMonthTaskCompletions(this.props.month, this.props.year, Map(this.props.month_stats))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.day_stats !== prevProps.day_stats) {
      this.updateDayTaskCompletions(this.props.month, this.props.year, Map(this.props.day_stats))
    }

    if (this.props.week_stats !== prevProps.week_stats) {
      this.updateWeekTaskCompletions(this.props.month, this.props.year, Map(this.props.week_stats))
    }

    if (this.props.month_stats !== prevProps.month_stats) {
      this.updateMonthTaskCompletions(this.props.month, this.props.year, Map(this.props.month_stats))
    }

    if (this.props.month !== prevProps.month || this.props.year !== prevProps.year) {
      this.updateDayTaskCompletions(this.props.month, this.props.year, Map(this.props.day_stats))
      this.updateWeekTaskCompletions(this.props.month, this.props.year, Map(this.props.week_stats))
      this.updateMonthTaskCompletions(this.props.month, this.props.year, Map(this.props.month_stats))
    }
  }

  render() {
    return (
      <View
        style={{
          height: 165,
          flex: 1,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          marginTop: 66,
          borderColor: "black",
        }}
      >
        <View
          style={{
            width: 79,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
            marginLeft: 16,
          }}
        >
          <Text
            style={{
            }}
          >
            Summary:
            </Text>
        </View>


        <View
          style={{
            height: 81,
            marginTop: 16,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{this.state.day_total_completions}</Text>
            <Text>Daily completed</Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "black"
            }}
          >
            <Text>{this.state.week_total_completions}</Text>
            <Text>Weekly completed</Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{this.state.month_total_completions}</Text>
            <Text>Monthly completed</Text>
          </View>
        </View>
      </View>
    )
  }
}

class ChartSection extends React.PureComponent {
  data = [
    {
      month: 1000,
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
      oranges: 400,
    },
    {
      month: 1000,
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      month: 1000,
      apples: 640,
      bananas: 960,
      cherries: 3640,
      dates: 400,
    },
    {
      month: 1000,
      apples: 3320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ]

  x_data = [0, 1, 2, 3]
  y_data = [10, 11]

  colors = ['red', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6']
  keys = ['month', 'apples', 'bananas', 'cherries', 'dates']

  getWeek = (date) => {
    let target = new Date(date);
    let dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    let firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  }

  getMonday = (date) => {
    let dayInWeek = new Date(date).getDay()
    let diff = dayInWeek === 0 ? 6 : dayInWeek - 1
    return new Date(new Date(date).getTime() - (diff * 86400 * 1000))
  }

  getSunday = (date) => {
    let dayInWeek = new Date(date).getDay()
    let diff = (7 - dayInWeek) === 7 ? 0 : 7 - dayInWeek
    return new Date(new Date(date).getTime() + (diff * 86400 * 1000))
  }

  initWeekAnnoText = () => {
    let current = new Date(),
      monday = this.getMonday(current),
      sunday = this.getSunday(current)
    return `${this.short_month_texts[monday.getMonth()]} ${monday.getDate()} ${monday.getFullYear()} - ${this.short_month_texts[sunday.getMonth()]} ${sunday.getDate()} ${sunday.getFullYear()}`
  }

  short_month_texts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  current = new Date()
  week_month_array = [new Date().getMonth(), new Date().getMonth() + 1, new Date().getMonth() - 1]
  week_year_array = [new Date().getFullYear(), new Date().getFullYear(), new Date().getFullYear()]
  week_anno_current_time_text = this.initWeekAnnoText()
  month_year_array = [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() - 1]


  state = {
    current_annotation_index: 0,
    last_annotation_index: -1,
  }

  setWeekAnnoMonthYearData = (month, year) => {
    if (month === 11) {
      this.week_month_array = [month, 0, month - 1]
      this.week_year_array = [year, year + 1, year]
    }
    else if (month === 0) {
      this.week_month_array = [month, month + 1, 11]
      this.week_year_array = [year, year, year - 1]
    }

    this.week_month_array = [month, month + 1, month - 1]
    this.week_year_array = [year, year, year]
  }

  setMonthAnnoYearData = (year) => {
    this.month_year_array = [year, year + 1, year - 1]
  }

  chooseAnnotation = (index) => {
    if (this.state.current_annotation_index !== index) {
      this.setState(prevState => ({
        last_annotation_index: prevState.current_annotation_index,
        current_annotation_index: index
      }))
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 16,
            marginTop: 24
          }}
        >
          Number of completed tasks
        </Text>

        <View
          style={{
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: 255,
              height: 26,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "#CCCCCC"
            }}
          >
            <ChartTypeAnnotation
              index={0}
              annotation={"Week"}
              current_annotation_index={this.state.current_annotation_index}
              last_annotation_index={this.state.last_annotation_index}
              chooseAnnotation={this.chooseAnnotation}
            />

            <ChartTypeAnnotation
              index={1}
              annotation={"Month"}
              current_annotation_index={this.state.current_annotation_index}
              last_annotation_index={this.state.last_annotation_index}
              chooseAnnotation={this.chooseAnnotation}
            />

            <ChartTypeAnnotation
              index={2}
              annotation={"Year"}
              current_annotation_index={this.state.current_annotation_index}
              last_annotation_index={this.state.last_annotation_index}
              chooseAnnotation={this.chooseAnnotation}
            />
          </View>

          {this.state.current_annotation_index === 0 ?
            <WeekChart
              setWeekAnnoMonthYearData={this.setWeekAnnoMonthYearData}
              month_array={this.week_month_array}
              year_array={this.week_year_array}
            />

            :

            <>
              {this.state.current_annotation_index === 1 ?
                <MonthChart
                  setMonthAnnoYearData={this.setMonthAnnoYearData}
                  year_array={this.month_year_array}
                />

                :

                <YearChart />
              }
            </>
          }

        </View>


        <View
          style={{
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {/* <YAxis
              data={this.y_data}
              contentInset={{
                top: 20,
                bottom: 20,
              }}
              numberOfTicks={3}
              style={{
                width: 30,
              }}
            /> */}
            <StackedBarChart
              style={{
                height: 200,
                flex: 1,
              }}
              keys={this.keys}
              colors={this.colors}
              data={this.data}
              showGrid={true}
              animate={true}
              contentInset={{
                top: 20,
                bottom: 20,
              }}
            />
          </View>
          {/* <XAxis
            data={this.x_data}
            style={{
              marginLeft: 30,
            }}
            contentInset={{ left: 10, right: 10 }}
          /> */}
        </View>
      </View>
    )
  }
}

class ChartTypeAnnotation extends React.Component {

  state = {
    container_style: styles.unchosen_container,
    text_style: styles.unchosen_text
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.index === nextProps.current_annotation_index || this.props.index === nextProps.last_annotation_index
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.index === nextProps.current_annotation_index) {
      return ({
        container_style: styles.chosen_container,
        text_style: styles.chosen_text
      })
    }

    else if (nextProps.index === nextProps.last_annotation_index) {
      return ({
        container_style: styles.unchosen_container,
        text_style: styles.unchosen_text
      })
    }
    return null
  }



  _onPress = () => {
    this.props.chooseAnnotation(this.props.index)
  }

  render() {
    return (
      <TouchableOpacity
        style={this.state.container_style}
        onPress={this._onPress}
      >
        <Text
          style={this.state.text_style}
        >
          {this.props.annotation}
        </Text>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  unchosen_container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 30,
    backgroundColor: "white"
  },

  chosen_container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 30,
    backgroundColor: "black"
  },

  unchosen_text: {
    color: "gainsboro"
  },

  chosen_text: {
    color: "white"
  }
})