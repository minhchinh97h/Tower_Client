import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    Button,
    ScrollView,
    TouchableHighlight,
    Modal
} from 'react-native';

let scrollViewRef,
    dayHolderWidth = 60,
    days_arr = [],
    today = new Date().getDate(),
    lastDayIndex = 0
    

export default class Daily extends React.Component{
    static navigationOptions = {
        swipeEnabled: false,
        header: null
    }

    state = {
        dailyTimeView: null,
        day_number_circle_style_arr: [],
        day_number_text_style_arr: [],
        days_arr: [],

        taskTabOpened: false
    }

    componentDidMount(){
        const didFocusScreen = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.props.changeRouteAction(payload.state.routeName)
            }
        )


        days_arr.length = 0

        let month = new Date().getMonth() + 1,
            year = new Date().getFullYear()

        
        let daysInMonth = this.getDaysInMonth(month, year),
            day_number_circle_style_arr = [],
            day_number_text_style_arr = []

        for(let i = 1; i <= daysInMonth; i++){
            let dayWord,
                dayInWeek = new Date(year, month-1, i).getDay()

            if(dayInWeek === 0){
                dayWord = 'Su'
            }

            else if (dayInWeek === 1){
                dayWord = 'Mo'
            }

            else if (dayInWeek === 2){
                dayWord = 'Tu'
            }

            else if (dayInWeek === 3){
                dayWord = 'We'
            }

            else if (dayInWeek === 4){
                dayWord = 'Th'
            }

            else if (dayInWeek === 5){
                dayWord = 'Fr'
            }

            else if (dayInWeek === 6){
                dayWord = 'Sa'
            }

            days_arr.push({
               dayWord: dayWord,
               dayNumb: i,
               chosen: false
            })

            day_number_circle_style_arr.push(styles.circleCenterDayNumberHolder)

            if(i === today)
                day_number_text_style_arr.push(styles.biggerFontWeightForToday)
            else
                day_number_text_style_arr.push(styles.notToday)
        }

        this.setState({
            day_number_circle_style_arr: day_number_circle_style_arr.map(style => {return style}),
            day_number_text_style_arr: day_number_text_style_arr.map(style => {return style}),
            days_arr: days_arr.map(day => {return day})
        })
        
        this.focusScrollViewToDay(scrollViewRef, days_arr, today)
    }

    
    componentDidUpdate(prevProps, prevState){
    }

    chooseDay = (scrollViewRef, days_arr, day, dayIndex) => {
        let day_number_circle_style_arr = this.state.day_number_circle_style_arr,
            day_number_text_style_arr = this.state.day_number_text_style_arr

        day_number_circle_style_arr[lastDayIndex] = {...styles.circleCenterDayNumberHolder, backgroundColor: 'transparent'}

        if(lastDayIndex === today-1)
            day_number_text_style_arr[lastDayIndex] = {...styles.biggerFontWeightForToday, color: 'black'}
        else
            day_number_text_style_arr[lastDayIndex] = {...styles.notToday, color: 'gray'}
        


        day_number_circle_style_arr[dayIndex] = {...styles.circleCenterDayNumberHolder, backgroundColor: 'black'}

        if(dayIndex === today-1)
            day_number_text_style_arr[dayIndex] = {...styles.biggerFontWeightForToday, color: 'white'}
        else
            day_number_text_style_arr[dayIndex] = {...styles.notToday, color: 'white'}

        this.setState({
            day_number_circle_style_arr: day_number_circle_style_arr.map(style => {return style}),
            day_number_text_style_arr: day_number_text_style_arr.map(style => {return style})
        })

        this.focusScrollViewToDay(scrollViewRef, days_arr, day)

        lastDayIndex = dayIndex
    }

    focusScrollViewToDay = (scrollViewRef, days_arr, day) => {
        let dayIndex = days_arr.findIndex(obj => obj.dayNumb === day),
            x_off_set

        if(dayIndex > (days_arr.length - 4)){
            dayIndex = days_arr.length - 7
            scrollViewRef.scrollTo({
                y: 0,
                x: dayIndex * dayHolderWidth
            })
        }

        else if (dayIndex < 3){
            scrollViewRef.scrollTo({
                y: 0,
                x: 0
            })
        }

        else{
            dayIndex -= 3
            x_off_set = dayIndex * dayHolderWidth

            scrollViewRef.scrollTo({
                y: 0,
                x: x_off_set
            })
        }
    }

    getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate()
    }


    openAddTaskTab = () => {
        this.setState(prevState => ({
            taskTabOpened: !prevState.taskTabOpened
        }))
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.scrollViewContainer} >
                    <ScrollView 
                        horizontal={true} 
                        ref={view => scrollViewRef = view}
                        indicatorStyle='white'
                    >
                        {this.state.days_arr.map((obj, index) => (
                            <TouchableHighlight 
                                onPress={this.chooseDay.bind(this, scrollViewRef, days_arr, obj.dayNumb,index)} 
                                style={styles.dayHolder} 
                                key={"day " + index}
                                underlayColor='transparent'
                            >
                            <>
                                <View>
                                    {
                                        obj.dayNumb === today ?
                                            <Text
                                            style={styles.biggerFontWeightForToday}
                                            >
                                                {obj.dayWord}
                                            </Text>

                                            :

                                            <Text
                                                style={styles.notToday}
                                            >
                                                {obj.dayWord}
                                            </Text>
                                    }
                                </View>

                                <View 
                                    style={styles.dayNumberHolder}
                                >
                                    <View style={this.state.day_number_circle_style_arr[index]}>
                                        <Text
                                            style={this.state.day_number_text_style_arr[index]}
                                        >
                                            {obj.dayNumb}
                                        </Text>
                                    </View>
                                </View>
                            </>
                            </TouchableHighlight>
                        ))}

                        {this.state.dailyTimeView}

                    </ScrollView>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    
                    {this.state.taskTabOpened ? 
                        <View
                            style={{
                                position: 'absolute'
                            }}
                        >
                            <Text>Test</Text>
                        </View>

                        :

                        <></>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    scrollViewContainer: {
        flex: 0,
        height: 70,
    },

    dayHolder: {
        width: dayHolderWidth,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },

    currentDayHolder: {
        height: 35, //half the size of scrollViewContainer's height
        width: 35,  //equal to height to form a square
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 35/2
    },

    dayNumberHolder: {
        height: 35,
        width: dayHolderWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },

    underlayIndicator: {
        position: 'absolute',
        width: dayHolderWidth,
        backgroundColor: 'yellow',
        height: 70,
    },

    biggerFontWeightForToday: {
        fontWeight: "600",
        color: 'black'
    },

    notToday: {
        color: 'gray'
    },

    circleCenterDayNumberHolder: {
        marginTop: 10,
        height: 25,
        width: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    }
})