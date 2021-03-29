import { ICompiledLanguage, ICompiledOrder, ITerminalEQConfig, OrderStatuses } from "@djonnyx/tornado-types";
import React from "react";
import { View } from "react-native";
import { theme } from "../../../theme";
import { OrderListColumn } from "./OrderListColumn";

interface IOrderListProps {
    themeName: string;
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    config: ITerminalEQConfig;
}

export const OrderListContainer = React.memo(({ themeName, config, orders, language }: IOrderListProps) => {
    return (
        <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
            <View style={{
                flex: 1, height: "100%", overflow: "hidden",
                backgroundColor: theme.themes[theme.name].orders.new.background,
            }}>
                <OrderListColumn
                    themeName={themeName}
                    layoutStyle={{
                        paddingTop: 8, paddingLeft: 8,
                    }}
                    headerStyle={{
                        backgroundColor: theme.themes[theme.name].orders.new.header.background,
                    }}
                    headerTextStyle={{
                        color: theme.themes[theme.name].orders.new.header.textColor,
                    }}
                    itemStyle={{
                        backgroundColor: theme.themes[theme.name].orders.new.item.background,
                    }}
                    itemTextStyle={{
                        color: theme.themes[theme.name].orders.new.item.textColor,
                    }}
                    columns={config.layout.new.columns} rows={config.layout.new.rows}
                    title="Готовятся" orders={orders.filter(o => o.status < OrderStatuses.COMPLETE)} language={language} />
            </View>
            <View style={{
                flex: 1, height: "100%", overflow: "hidden",
                backgroundColor: theme.themes[theme.name].orders.complete.background,
            }}>
                <OrderListColumn
                    themeName={themeName}
                    layoutStyle={{
                        paddingTop: 8, paddingRight: 8,
                    }}
                    headerStyle={{
                        backgroundColor: theme.themes[theme.name].orders.complete.header.background,
                    }} headerTextStyle={{
                        color: theme.themes[theme.name].orders.complete.header.textColor,
                    }}
                    itemStyle={{
                        backgroundColor: theme.themes[theme.name].orders.complete.item.background,
                    }}
                    itemTextStyle={{
                        color: theme.themes[theme.name].orders.complete.item.textColor,
                    }}
                    columns={config.layout.complete.columns} rows={config.layout.complete.rows}
                    title="Готовы" orders={
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