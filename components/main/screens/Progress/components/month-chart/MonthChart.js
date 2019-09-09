import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';

import MonthAnnotationCalendar from './month-anno-calendar/MonthAnnotationCalendar'

export default class MonthChart extends React.PureComponent {

    month_texts = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    state = {
        calendar_chosen_bool: false,
        month_anno_current_time_text: `${this.month_texts[new Date().getMonth()]} ${new Date().getFullYear()}`,
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    }

    chooseMonth = (month, year) => {
        this.props.setMonthAnnoYearData(month, year)
        this.setState({
            month,
            year,
            month_anno_current_time_text: `${this.month_texts[month]} ${year}`,
        })
    }

    chooseCalendar = () => {
        this.setState({
            calendar_chosen_bool: true
        })
    }

    dismissCalendar = () => {
        this.setState({
            calendar_chosen_bool: false
        })
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        marginTop: 17,
                        justifyContent: "center",
                        alignItems: "center"
                    }}

                    onPress={this.chooseCalendar}
                >
                    <Text>
                        {this.state.month_anno_current_time_text}
                    </Text>
                </TouchableOpacity>

                {this.state.calendar_chosen_bool ?
                    <Modal
                        transparent={true}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    width: Dimensions.get("window").width,
                                    backgroundColor: "black",
                                    opacity: 0.5
                                }}

                                onPress={this.dismissCalendar}
                            >
                            </TouchableOpacity>

                            <MonthAnnotationCalendar
                                year_array={this.props.year_array}
                                chooseMonth={this.chooseMonth}
                                dismissCalendar={this.dismissCalendar}
                            />
                        </View>
                    </Modal>

                    :

                    null
                }
            </View>
        )
    }
}
