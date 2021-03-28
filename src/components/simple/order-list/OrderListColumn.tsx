import { ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";
import React from "react";
import { View, Text } from "react-native";
import { GridList } from "../../layouts/GridList";
import { OrderListItem } from "./OrderListItem";

interface IOrderListProps {
    columns: number;
    rows: number;
    title: string;
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
}

export const OrderListColumn = React.memo(({ columns, rows, title, orders, language }: IOrderListProps) => {
    return (
        <View style={{ flex: 1, flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <View style={{
                height: "10%", padding: 20, justifyContent: "center", alignItems: "center",
                backgroundColor: "black"
            }}>
                <Text style={{
                    color: "white", fontWeight: "bold", textTransform: "uppercase",
                    fontSize: 44, fontFamily: "roboto"
                }}>
                    {title}
                </Text>
            </View>
            <GridList style={{ flex: 1, width: "100%" }}
                padding={10} spacing={6} data={orders || []}
                columnsNum={columns} rowsNum={rows} renderItem={({ item }) => {
                    return <OrderListItem key={item.data.id} order={item.data} language={language} />
                }}
                keyExtractor={(item, index) => item.data.id}>
            </GridList>
        </View>
    );
})