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
    ScrollView
} from 'react-native';

import CalendarDisplayHolder from './calendar-display-holder/CalendarDisplayHolder'

export default class DayAnnotationPanel extends Component{

    state = {
        renderDaysInMonth: null,
        currentIndexOfTotalCalendarMonth: 0,
        monthComponent_arr: null
    }

    chooseDiffCalendarMonth = (index) => {
        this.setState({
            currentIndexOfTotalCalendarMonth: index
        })
    }

    componentDidMount(){
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
                <ScrollView
                    horizontal={true}
                    decelerationRate={0}
                    snapToInterval={(Dimensions.get('window').width - 50) * 2}
                    snapToAlignment="start"
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd = {() => {

                    }}
                >

                    {MonthComponent_arr}

                </ScrollView>
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