import React, { Component } from 'react'

import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
    FlatList
} from 'react-native';

import CalendarDisplayHolder from './calendar-display-holder/CalendarDisplayHolder'

export default class DayAnnotationPanel extends Component{
    month_order_array = []

    state = {
        renderDaysInMonth: null,
        currentIndexOfTotalCalendarMonth: 0,
        month_order_array: []
    }

    chooseDiffCalendarMonth = (index) => {
        this.setState({
            currentIndexOfTotalCalendarMonth: index
        })
    }

    initializeMonthsForCalendar = () => {
        let currentMonth = new Date().getMonth(),
            currentYear = new Date().getFullYear()

        this.getNumberOfMonthsInTheFuture(currentMonth, currentYear, ((12 * 30) + 1)) //To fully display the current month and also all the next stated months, plus 1
    }

    _renderItem = (item, index) => {
        return(
            <CalendarDisplayHolder
                key={'month-render-calendar' + index}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width - 50,
                    marginLeft: Dimensions.get('window').width - 50
                }} 
                

                month={item.month} 
                year={item.year}
                calendarIndex = {index}
                chooseDiffCalendarMonth = {this.chooseDiffCalendarMonth}
                currentIndexOfTotalCalendarMonth = {this.state.currentIndexOfTotalCalendarMonth}
            />
        )
    }

    getNumberOfMonthsInTheFuture = (currentMonth, currentYear, numberOfMonths) => {
        if(numberOfMonths === 0){
            return
        }

        this.month_order_array.push({
            month: currentMonth,
            year: currentYear,
        })

        if(currentMonth === 11){
            currentMonth= 0
            currentYear += 1
        }

        else{
            currentMonth += 1
        }

        numberOfMonths -= 1

        this.getNumberOfMonthsInTheFuture(currentMonth, currentYear, numberOfMonths)
    }


    componentDidMount(){
        this.initializeMonthsForCalendar()

        this.setState({
            month_order_array: [... this.month_order_array]
        })
    }

    componentDidUpdate(prevProps, prevState){
    }

    render(){
        return(
            <>
            {/* Today Tommorow Next Monday */}
            <View style={{
                height: 80,
                paddingHorizontal: 30,
                paddingTop: 30,
                paddingBottom: 10,
            }}>
                <View style={{
                    height: 35,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: "gainsboro",
                    flexDirection: "row",
                    justifyContent: 'space-between',
                }}>
                    <View style={{
                        backgroundColor: "black",
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 20,
                                fontWeight: "700"
                            }}
                        >Today</Text>
                    </View>
        
                    <View style={{
                        backgroundColor: "gainsboro",
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: "700"
                            }}
                        >Tomorrow</Text>
                    </View>
        
                    <View style={{
                        backgroundColor: "gainsboro",
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        
                    }}>
                        <Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: "700"
                            }}
                        >Next Monday</Text>
                    </View>
                </View>
            </View> 

            {/* Main content of calendar */}
            <View 
                style = {{
                    flex: 1,
                }}
            >
                <FlatList
                    horizontal={true}
                    decelerationRate={0}
                    snapToInterval={(Dimensions.get('window').width - 50) * 2}
                    snapToAlignment="start"
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => 'month-render-calendar' + index}
                    initialNumToRender={2}
                    data={this.state.month_order_array}
                    renderItem={({item, index}) => (
                        <CalendarDisplayHolder
                            key={'month-render-calendar' + index}
                            
                            style={
                                index === this.state.month_order_array.length - 1 ? 
                                {
                                    flex: 1,
                                    width: Dimensions.get('window').width - 50,
                                }

                                :

                                {
                                    flex: 1,
                                    width: Dimensions.get('window').width - 50,
                                    marginRight: Dimensions.get('window').width - 50
                                }
                            } 
                            month={item.month} 
                            year={item.year}
                            calendarIndex = {index}
                            chooseDiffCalendarMonth = {this.chooseDiffCalendarMonth}
                            currentIndexOfTotalCalendarMonth = {this.state.currentIndexOfTotalCalendarMonth}
                        />
                    )}
                >

                </FlatList>
            </View>
            

            <View
                style={{
                    height: 50,
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: 'gainsboro',
                    borderTopColor: 'gainsboro',
                }}
            >
                <Text>
                    Add time
                </Text>
            </View>
            <View
                style={{
                    height: 50,
                    backgroundColor: 'yellow'
                }}
            >

            </View>
            <View
                style={{
                    height: 60,
                    backgroundColor: 'black',
                    marginBottom: 20,
                }}
            >

            </View>
            </>
        )
    }
}