import React, { Component } from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { styles } from './styles/styles'

export default class RepeatEndAfterOptionRow extends React.Component {

    state = {
        is_text_input_readable: false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.index === nextProps.current_index && this.props.current_index !== nextProps.current_index)
            || (this.props.index === nextProps.last_index && this.props.last_index !== nextProps.last_index)
            || (this.props.after_occurrence_value !== nextProps.after_occurrence_value)
    }

    _chooseEndOption = () => {
        this.props.chooseEndOption(this.props.index)
        this.setState({
            is_text_input_readable: true
        }, () => {
            this._text_input_ref.focus()
        })
    }

    _setTextInputRef = (r) => {
        this._text_input_ref = r
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.index === this.props.last_index && this.props.last_index !== prevProps.last_index) {
            this.setState({
                is_text_input_readable: false,
            }, () => {
                this._text_input_ref.blur()
            })
        }
    }

    render() {
        let text_style = styles.unchosen_every_option_text,
            button_container = styles.repeat_end_chosen_button_container_deactivated,
            activated = this.props.index === this.props.current_index,
            input_text_style = styles.unchosen_every_option_input

        if (this.props.index === this.props.current_index) {
            text_style = styles.every_option_text
            button_container = styles.repeat_end_chosen_button_container
            input_text_style = styles.every_option_input
        }

        else if (this.props.index === this.props.last_index) {
            text_style = styles.unchosen_every_option_text
            button_container = styles.repeat_end_chosen_button_container_deactivated
            input_text_style = styles.unchosen_every_option_input
        }

        return (
            <TouchableOpacity
                style={{
                    marginTop: 25,
                    marginLeft: 59,
                    marginRight: 30,
                }}

                onPress={this._chooseEndOption}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={text_style}
                        >
                            After
                        </Text>

                        <TextInput
                            style={input_text_style}
                            editable={this.state.is_text_input_readable}
                            maxLength={2}
                            keyboardType="numbers-and-punctuation"
                            placeholder="1"
                            value={this.props.after_occurrence_value}
                            onChange={this.props._onChangeAfterOccurrenceValue}
                            ref={this._setTextInputRef}
                            autoCorrect={false}
                        />

                        <View
                            style={{
                                marginLeft: 20,
                            }}
                        >
                            <Text
                                style={text_style}
                            >
                                occurrences
                            </Text>
                        </View>
                    </View>

                    <View
                        style={button_container}
                    >
                        {activated ?
                            <View
                                style={styles.repeat_end_chosen_button_activated}
                            >

                            </View>
                            :
                            null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}