import React, { Dispatch } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import {
    ICompiledLanguage, ICompiledOrder, IEQueueTheme, ITerminalEQConfig
} from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { CapabilitiesSelectors, CombinedDataSelectors, OrdersSelectors } from "../../store/selectors";
import { OrderListContainer } from "../simple/order-list/OrderList";

interface IOrdersSelfProps {
    // store props
    _theme: IEQueueTheme;
    _config: ITerminalEQConfig;
    _orders: Array<ICompiledOrder>;
    _language: ICompiledLanguage;

    // self props
}

interface IOrdersProps extends IOrdersSelfProps { }

const OrdersScreenContainer = React.memo(({ _theme, _config, _orders, _language }: IOrdersProps) => {
    const theme = !!_theme ? _theme?.themes?.[_theme?.name] : undefined;
    return (
        !!theme &&
        <View style={{
            width: "100%", height: "100%",
        }}>
            <OrderListContainer theme={theme} config={_config} orders={_orders} language={_language} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _orders: OrdersSelectors.selectCollection(state),
        _config: CombinedDataSelectors.selectConfig(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const OrdersScreen = connect(mapStateToProps, mapDispatchToProps)(OrdersScreenContainer);