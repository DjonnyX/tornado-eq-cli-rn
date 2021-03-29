import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";

interface IOrderListItemProps {
    themeName: string;
    order: ICompiledOrder;
    language: ICompiledLanguage;
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
}

export const OrderListItem = React.memo(({ themeName, style, textStyle, language, order }: IOrderListItemProps) => {
    return (
        <View style={{
            flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center",
            backgroundColor: "green", borderRadius: 8, padding: 22, ...style as any,
        }}>
            <Text textBreakStrategy="simple" numberOfLines={1} ellipsizeMode="tail" style={{
                textAlign: "center", fontSize: 44, fontWeight: "bold",
                color: "#ffffff", textTransform: "uppercase", ...textStyle as any,
            }}>
                {
                    order?.code
                }
            </Text>
        </View>
    );
});