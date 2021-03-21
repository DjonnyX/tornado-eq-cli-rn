import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import {
    ICompiledLanguage, ICompiledOrder
} from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors, OrdersSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { OrderListContainer } from "../simple/order-list/OrderList";

interface IOrdersSelfProps {
    // store props
    _orders: Array<ICompiledOrder>;
    _language: ICompiledLanguage;

    // self props
}

interface IOrdersProps extends StackScreenProps<any, MainNavigationScreenTypes.ORDERS>, IOrdersSelfProps { }

const OrdersScreenContainer = React.memo(({ _orders, _language, navigation }: IOrdersProps) => {
    return (
        <View style={{
            width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <OrderListContainer orders={_orders} language={_language} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _orders: OrdersSelectors.selectCollection(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const OrdersScreen = connect(mapStateToProps, mapDispatchToProps)(OrdersScreenContainer);