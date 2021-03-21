import { ICompiledLanguage, ICompiledOrder, OrderStatuses } from "@djonnyx/tornado-types";
import React from "react";
import { View } from "react-native";
import { OrderListColumn } from "./OrderListColumn";

interface IOrderListProps {
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
}

export const OrderListContainer = React.memo(({ orders, language }: IOrderListProps) => {
    return (
        <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
            <View style={{ flex: 1, height: "100%", overflow: "hidden" }}>
                <OrderListColumn title="Готовятся" orders={orders.filter(o => o.status < OrderStatuses.COMPLETE)} language={language} />
            </View>
            <View style={{ flex: 1, height: "100%", overflow: "hidden" }}>
                <OrderListColumn title="Готовы" orders={orders.filter(o => o.status === OrderStatuses.COMPLETE)} language={language} />
            </View>
        </View>
    );
})