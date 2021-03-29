import { ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";
import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { GridList } from "../../layouts/GridList";
import { OrderListItem } from "./OrderListItem";

interface IOrderListProps {
    columns: number;
    rows: number;
    title: string;
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    layoutStyle: StyleProp<ViewStyle>;
    headerStyle: StyleProp<ViewStyle>;
    headerTextStyle: StyleProp<TextStyle>;
    itemStyle: StyleProp<ViewStyle>;
    itemTextStyle: StyleProp<TextStyle>;
}

export const OrderListColumn = React.memo(({ columns, rows, title, orders, language, layoutStyle, headerStyle, headerTextStyle,
    itemStyle, itemTextStyle }: IOrderListProps) => {
    return (
        <View style={{ flex: 1, flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <View style={{
                height: 92, padding: 20, justifyContent: "center", alignItems: "center",
                ...headerStyle as any,
            }}>
                <Text style={{
                    fontWeight: "bold", textTransform: "uppercase",
                    fontSize: 44, fontFamily: "roboto", ...headerTextStyle as any,
                }}>
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, width: "100%", ...layoutStyle as any }}>
                <GridList style={{ flex: 1, width: "100%" }}
                    padding={2} spacing={10} data={orders || []}
                    columnsNum={columns} rowsNum={rows} renderItem={({ item }) => {
                        return <OrderListItem key={item.data.id} style={itemStyle} textStyle={itemTextStyle}
                            order={item.data} language={language} />
                    }}
                    keyExtractor={(item, index) => item.data.id}>
                </GridList>
            </View>
        </View>
    );
})