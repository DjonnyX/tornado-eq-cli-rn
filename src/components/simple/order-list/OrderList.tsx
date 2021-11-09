import { ICompiledLanguage, ICompiledOrder, IEQueueTheme, IEQueueThemeColors, ITerminalEQConfig, OrderStatuses } from "@djonnyx/tornado-types";
import React from "react";
import { View } from "react-native";
import { localize } from "../../../utils/localization";
import { OrderListColumn } from "./OrderListColumn";

interface IOrderListProps {
    theme: IEQueueThemeColors;
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    config: ITerminalEQConfig;
}

export const OrderListContainer = React.memo(({ theme, config, orders, language }: IOrderListProps) => {
    return (
        !!theme &&
        <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
            <View style={{
                flex: 1, height: "100%", overflow: "hidden",
                backgroundColor: theme.orders.new.backgroundColor,
            }}>
                <OrderListColumn
                    theme={theme}
                    layoutStyle={{
                        paddingTop: 8, paddingLeft: 8,
                    }}
                    headerStyle={{
                        backgroundColor: theme.orders.new.header.backgroundColor,
                    }}
                    headerTextStyle={{
                        color: theme.orders.new.header.textColor,
                    }}
                    itemStyle={{
                        backgroundColor: theme.orders.new.item.backgroundColor,
                    }}
                    itemTextStyle={{
                        color: theme.orders.new.item.textColor,
                    }}
                    columns={config.layout.new.columns} rows={config.layout.new.rows}
                    title={
                        localize(language, "equeue_new_items_title")
                    } orders={orders.filter(o => o.status < OrderStatuses.COMPLETE)} language={language} />
            </View>
            <View style={{
                flex: 1, height: "100%", overflow: "hidden",
                backgroundColor: theme.orders.complete.backgroundColor,
            }}>
                <OrderListColumn
                    theme={theme}
                    layoutStyle={{
                        paddingTop: 8, paddingRight: 8,
                    }}
                    headerStyle={{
                        backgroundColor: theme.orders.complete.header.backgroundColor,
                    }} headerTextStyle={{
                        color: theme.orders.complete.header.textColor,
                    }}
                    itemStyle={{
                        backgroundColor: theme.orders.complete.item.backgroundColor,
                    }}
                    itemTextStyle={{
                        color: theme.orders.complete.item.textColor,
                    }}
                    columns={config.layout.complete.columns} rows={config.layout.complete.rows}
                    title={
                        localize(language, "equeue_ready_items_title")
                    } orders={
                        orders.filter(o => o.status === OrderStatuses.COMPLETE).sort(sortByCompleteSortNum)
                    } language={language} />
            </View>
        </View>
    );
});

const sortByCompleteSortNum = (a: ICompiledOrder, b: ICompiledOrder) => {
    if (a.completeSortNum < b.completeSortNum) {
        return 1;
    }
    if (a.completeSortNum > b.completeSortNum) {
        return -1;
    }
    return 0;
};