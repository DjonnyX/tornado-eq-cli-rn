import React from "react";
import { View, Text } from "react-native";
import { ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";

interface IOrderListItemProps {
    order: ICompiledOrder;
    language: ICompiledLanguage;
}

export const OrderListItem = React.memo(({ language, order }: IOrderListItemProps) => {
    return (
        <View style={{
            flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center",
            backgroundColor: "green", borderRadius: 16, padding: 22
        }}>
            <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                textAlign: "center", fontSize: 44, fontWeight: "bold",
                color: "#ffffff", textTransform: "uppercase",
                marginBottom: 12
            }}>
                {
                    order?.code
                }
            </Text>
        </View>
    );
});