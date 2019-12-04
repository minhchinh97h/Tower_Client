import {
    StyleSheet,
} from 'react-native'

import * as CommonStyles from '../../../../../../../../shared/styles/style'

export const styles = StyleSheet.create({
    warning_text: {
        fontFamily: CommonStyles.sf_ui_display_light_font,
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: -0.02,
        color: CommonStyles.text_icon_colors.ti_1,
        textAlign: "center"
    }
})