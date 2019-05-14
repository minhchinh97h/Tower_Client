import React from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

let scrollViewRef,
    currentWeek,
    weekHolderWith = 60

export default class Weekly extends React.Component{
    static navigationOptions = {
        swipeEnabled: false,
    }

    state = {
        weeks_arr : []
    }

    componentDidMount(){
        let totalWeeksInYear = 53,
            weeks_arr = [],
            todayMili = new Date().getTime()

        currentWeek = this.getCurrentWeekFromToday(todayMili)

        for(let i = 1; i <= totalWeeksInYear; i++){
            weeks_arr.push({
                week_text: 'W',
                week_numb: i
            })
        }

        this.setState({weeks_arr})
    }

    getCurrentWeekFromToday = (todayMili) => {
        let startMili, diff, currentWeek

        startMili = new Date(new Date().getFullYear(), 0, 0).getTime()
        diff = todayMili - startMili

        currentWeek = diff/(1000 * 60 * 60 * 24 * 7)

        return Math.ceil(currentWeek)
    }

    render(){
        return(
            <View>
                <ScrollView 
                    style={styles.scrollViewContainer}
                    horizontal={true}
                    ref = {view => scrollViewRef = view}
                    indicatorStyle='white'
                    scrollEventThrottle={1}
                >
                    {this.state.weeks_arr.map((obj, index) => (
                        <TouchableHighlight
                            key={"week " + index}
                            style={styles.weekHolder}
                        >
                            <>
                            <View>
                                <Text>
                                    Week
                                </Text>
                            </View>

                            <View>
                                <View>
                                    <Text>
                                        {obj.week_numb}
                                    </Text>
                                </View>
                            </View>
                            </>
                        </TouchableHighlight>
                    ))}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },

    scrollViewContainer: {
        height: 70,
    },

    weekHolder: {
        width: weekHolderWith,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    }
})