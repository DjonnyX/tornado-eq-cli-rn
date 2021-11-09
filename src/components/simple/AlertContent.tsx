import { IEQueueThemeColors } from "@djonnyx/tornado-types";
import React from "react";
import { View, Text } from "react-native";
import { IAlertButton } from "../../interfaces";
import { SimpleButton } from "./SimpleButton";

interface IAlertContentProps {
    theme: IEQueueThemeColors,
    title: string;
    message: string;
    buttons: Array<IAlertButton>;
}

export const AlertContent = React.memo(({ theme, title, message, buttons }: IAlertContentProps) => {
    return (
        <>
            {
                !!theme &&
                <View style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "column", marginBottom: 32 }}>
                        <Text style={{
                            fontWeight: "bold", textTransform: "uppercase",
                            color: theme.common.alert.titleColor,
                            fontSize: theme.common.alert.titleFontSize
                        }}>
                            {title}
                        </Text>
                        <Text style={{
                            fontWeight: "bold",
                            color: theme.common.alert.messageColor,
                            fontSize: theme.common.alert.messageFontSize
                        }}>
                            {message}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        {
                            buttons.map((b, i) =>
                                <SimpleButton key={i} style={{
                                    borderRadius: 6,
                                    backgroundColor: theme.common.alert.buttonColor, marginLeft: i > 0 ? 12 : 0
                                }}
                                    focused={true}
                                    textStyle={{
                                        textTransform: "uppercase",
                                        fontWeight: "bold",
                                        color: theme.common.alert.buttonTextColor,
                                        fontSize: theme.common.alert.buttonTextFontSize,
                                    }} onPress={() => {
                                        if (!!b.action) {
                                            b.action();
                                        }
                                    }} title={b.title} />
                            )
                        }
                    </View>
                </View>
            }
        </>
    );
})