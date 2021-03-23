import Color from "color";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { uiutils } from "../../utils/ui";

interface ISimpleButtonProps {
    title: string;
    disabled?: boolean;
    styleView?: StyleProp<ViewStyle>;
    styleViewDisabled?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    styleDisabled?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    textStyleDisabled?: StyleProp<TextStyle>;
    onPress: () => void;
}

export const SimpleButton = ({ title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled,
    disabled = false, onPress }: ISimpleButtonProps) => {
    const [focus, setFocus] = useState(false);
    const ref = useRef<TouchableOpacity>();

    const opacity = disabled ? 0.35 : 1;
    const shadow = uiutils.createShadow((style as any)?.backgroundColor);
    let sView: StyleProp<ViewStyle> = { borderRadius: 3, overflow: "hidden", opacity, ...styleView as any };
    let sLayout: StyleProp<ViewStyle> = { paddingLeft: 22, paddingRight: 22, paddingTop: 16, paddingBottom: 16, ...style as any };
    let sText: StyleProp<TextStyle> = { fontSize: 14, fontWeight: "bold", ...textStyle as any };

    if (disabled) {
        if (!!styleViewDisabled) {
            sView = { ...sView as any, ...styleViewDisabled as any };
        }
        if (!!styleDisabled) {
            sLayout = { ...sLayout as any, ...styleDisabled as any };
        }
        if (!!textStyleDisabled) {
            sText = { ...sText as any, ...textStyleDisabled as any };
        }
    }

    if (focus) {
        sLayout = { ...sLayout as any, borderWidth: 4, borderColor: Color((style as any).backgroundColor).darken(0.25).toString() };
    }

    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled]);

    const onFocusHandler = useCallback(() => {
        setFocus(true);
    }, []);

    const onBlurHandler = useCallback(() => {
        setFocus(false);
    }, []);

    useEffect(() => {
        if (!!ref && focus) {
            ref.current?.focus();
        }
    }, [focus, ref]);

    return (
        <DropShadow style={shadow}>
            <TouchableOpacity ref={ref as any} style={sView} onPress={onPressHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} disabled={disabled}>
                <View
                    style={sLayout}
                >
                    <Text style={sText}>
                        {
                            title
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </DropShadow>
    )
};