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
    focused?: boolean;
    onPress: () => void;
    children?: JSX.Element;
}

interface IStyles {
    sView: StyleProp<ViewStyle>;
    sLayout: StyleProp<ViewStyle>;
    sText: StyleProp<TextStyle>;
}

export const SimpleButton = ({ children, title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled,
    disabled = false, focused = false, onPress }: ISimpleButtonProps) => {
    const [styles, setStyles] = useState<IStyles>({} as IStyles);
    const [focus, setFocus] = useState(focused);
    const ref = useRef<TouchableOpacity>();

    useEffect(() => {
        if (focused) {
            setFocus(true);
            ref.current?.focus();
        }
    });

    useEffect(() => {
        const opacity = disabled ? 0.35 : 1;
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

        setStyles({
            sView,
            sLayout,
            sText,
        })
    }, [style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled, focus, disabled]);

    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled, title]);

    const onFocusHandler = useCallback(() => {
        console.warn("focused")
        setFocus(true);
    }, []);

    const onBlurHandler = useCallback(() => {
        console.warn("unfocused")
        setFocus(false);
    }, []);

    useEffect(() => {
        if (!!ref && focus) {
            ref.current?.focus();
        }
    }, [focus, ref]);

    const shadow = uiutils.createShadow((style as any)?.backgroundColor);

    return (
        <DropShadow style={shadow}>
            <TouchableOpacity ref={ref as any} style={styles.sView}
                onPress={onPressHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} disabled={disabled}>
                <View
                    style={styles.sLayout}
                >
                    {
                        !!children && children
                    }
                    <Text style={styles.sText}>
                        {
                            title
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </DropShadow>
    )
};

interface ISimpleSysytemButtonProps {
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

export const SimpleSystemButton = React.memo(({ title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled,
    disabled = false, onPress }: ISimpleSysytemButtonProps) => {

    let sView: StyleProp<ViewStyle> = { borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleView as any };
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

    const styles: IStyles = {
        sView,
        sLayout,
        sText,
    };

    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled, title]);

    return (
        <TouchableOpacity style={styles.sView} onPress={onPressHandler} disabled={disabled}>
            <View
                style={styles.sLayout}
            >
                <Text style={styles.sText}>
                    {
                        title
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
});