import React, { Component } from 'react'

import {
    View,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';

import MonthAnnotationPanel from './month-annotation/MonthAnnotationPanel.Container'
import WeekAnnotationPanel from './week-annotation/WeekAnnotationPanel.Container'

import DayCalendar from '../../../../screens/Journal/components/share/calendar/day-calendar/DayCalendar.Container'

const panel_width = 338

export default class Calendar extends Component {

    render() {
        return (
            <>
                {
                    this.props.currentAnnotation === 'day' ?
                        <DayCalendar
                            disableAllTabs={this.props.disableAllTabs}
                        />

                        :

                        <>
                            {this.props.currentAnnotation === 'week' ?
                                <View
                                    style={{
                                        position: 'absolute',
                                        width: panel_width,
                                        height: 446,
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                    }}
                                >
                                    <WeekAnnotationPanel
                                        disableAllTabs={this.props.disableAllTabs}
                                    />
                                </View>

                                :

                                <View style={{
                                    position: 'absolute',
                                    width: panel_width,
                                    height: 546,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                }}>
                                    <MonthAnnotationPanel
                                        disableAllTabs={this.props.disableAllTabs}
                                    />
                                </View>

                            }
                        </>
                }

            </>
        )
    }
}