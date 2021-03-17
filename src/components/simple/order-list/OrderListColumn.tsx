import { ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";
import React from "react";
import { View } from "react-native";
import { GridList } from "../../layouts/GridList";
import { OrderListItem } from "./OrderListItem";

const MAX_ITEM_WIDTH = 256;

interface IOrderListProps {
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
}

export const OrderListColumn = React.memo(({ orders, language }: IOrderListProps) => {
    return (
        <View style={{ flex: 1, height: "100%", overflow: "hidden" }}>
            <GridList style={{ width: "100%" }}
                padding={10} spacing={6} data={orders || []}
                itemDimension={MAX_ITEM_WIDTH} renderItem={({ item }) => {
                    return <OrderListItem key={item.id} order={item} language={language} />
                }}
                keyExtractor={(item, index) => item.id}>
            </GridList>
        </View>
    );
})