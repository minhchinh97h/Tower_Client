import React, { Component } from 'react'

import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableHighlight
} from 'react-native';

import CalendarDisplayHolder from './calendar-display-holder/CalendarDisplayHolder'


export default class DayAnnotationPanel extends Component{
    month_data_array = []
    numberOfMonths = (12 * 10) + 1 //Number of months we want to display. (12 months in a year) * (number of year) + 1 (for current month)

    state = {
        current_month_index: 0,
        month_data_array: []
    }

    chooseDifferentMonth = (index) => {
        if(index !== this.state.current_month_index)
            this.setState({
                current_month_index: index
            })
    }

    _keyExtractor = (item, index) => `month-calendar-${index}`

    _renderItem = ({item, index}) => (
        <CalendarDisplayHolder 
            style = {
                index === this.state.month_data_array.length - 1 ? 
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
            month_index = {index}
            chooseDifferentMonth = {this.chooseDifferentMonth}
            current_month_index = {this.state.current_month_index}
        /> 
    )

    initializeMonths = () => {
        let currentMonth = new Date().getMonth(),
            currentYear = new Date().getFullYear()

        this.getFollowingMonths(currentMonth, currentYear, this.numberOfMonths)
    }

    getFollowingMonths = (currentMonth, currentYear, numberOfMonths) => {
        if(numberOfMonths === 0){
            return
        }

        this.month_data_array.push({
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

        this.getFollowingMonths(currentMonth, currentYear, numberOfMonths)
    }


    componentDidMount(){
        this.initializeMonths()

        this.setState({
            month_data_array: [... this.month_data_array]
        })
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

            {/* Main content of day calendar */}
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
                    keyExtractor={this._keyExtractor}
                    initialNumToRender={1}
                    removeClippedSubviews={true}
                    data={this.state.month_data_array}
                    extraData={this.state.current_month_index}
                    renderItem={this._renderItem}
                    maxToRenderPerBatch={10}
                    windowSize={15}
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
                    justifyContent: "center"
                }}
            >
                <Text>
                    Add time
                </Text>
            </View>

            <View
                style={{
                    height: 50,
                    backgroundColor: 'white',
                    justifyContent: "center"
                }}
            >
                <Text>
                    Add reminder
                </Text>
            </View>
            <View
                style={{
                    height: 60,
                    backgroundColor: 'white',
                    marginBottom: 20,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: 'center'
                }}
            >
                <TouchableHighlight
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        backgroundColor: 'gray',
                        marginRight: 20
                    }}
                >
                    <Text
                        style={{
                            color: "white"
                        }}
                    >
                        X
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        backgroundColor: 'gray',
                        marginRight: 10
                    }}
                >
                    <Text
                        style={{
                            color: "white"
                        }}
                    >
                        OK
                    </Text>
                </TouchableHighlight>
            </View>
            </>
        )
    }
}