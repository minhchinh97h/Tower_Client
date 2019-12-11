import { StyleSheet } from "react-native";

import * as CommonStyles from "../../../styles/style";

export const styles = StyleSheet.create({
  title: {
    fontFamily: CommonStyles.sf_ui_display_light_font,
    fontSize: 26,
    lineHeight: 29,
    letterSpacing: -0.02,
    color: CommonStyles.text_icon_colors.ti_1
  },

  upgrade_button_container: {
    width: 316,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: CommonStyles.primary_colors.prim_1,
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.15
  },

  upgrade_button_normal_text: {
    fontFamily: CommonStyles.sf_ui_display_light_font,
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: -0.02,
    color: "white"
  },

  benefit_text: {
    fontFamily: CommonStyles.sf_ui_display_light_font,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.02,
    color: CommonStyles.text_icon_colors.ti_1
  },

  versus_text: {
    fontFamily: CommonStyles.sf_ui_display_light_font,
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.02,
    color: CommonStyles.text_icon_colors.ti_2
  },

  motivation_text: {
    fontFamily: CommonStyles.sf_ui_display_light_font,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.02,
    color: "#EB5757"
  }
});
