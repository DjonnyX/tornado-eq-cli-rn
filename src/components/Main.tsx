import React, { Dispatch, useCallback, useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { connect } from "react-redux";
import { CapabilitiesActions } from "../store/actions";
import {
    AlertService, AuthService, DataCollectorService, NavigationService, SnackService
} from "../core";
import { MainNavigationScreenTypes } from "./navigation";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors } from "../store/selectors";
import { AuthScreen } from "./screens/AuthScreen";
import { LoadingScreen } from "./screens/LoadingScreen";
import { OrdersScreen } from "./screens/OrdersScreen";

interface IMainProps {
    // store props
    _currentScreen: MainNavigationScreenTypes;
    _setCurrentScreen?: (screen: MainNavigationScreenTypes) => void;
    // self props
}

const MainContainer = React.memo(({ _currentScreen, _setCurrentScreen }: IMainProps) => {
    useEffect(() => {
        if (_setCurrentScreen !== undefined) {
            _setCurrentScreen(MainNavigationScreenTypes.AUTH);
        }
    }, []);

    return (
        <>
            {/** services */}
            <AuthService />
            <DataCollectorService />
            <AlertService />

            {/** components */}
            <StatusBar hidden={true} />
            {/** Navigation screens */}
            {
                _currentScreen === MainNavigationScreenTypes.AUTH &&
                <AuthScreen />
            }
            {
                _currentScreen === MainNavigationScreenTypes.LOADING &&
                <LoadingScreen />
            }
            {
                _currentScreen === MainNavigationScreenTypes.ORDERS &&
                <OrdersScreen />
            }

            {/** snack */}
            <SnackService />
        </>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IMainProps) => {
    return {
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _setCurrentScreen: (screen: MainNavigationScreenTypes) => {
            dispatch(CapabilitiesActions.setCurrentScreen(screen));
        },
    };
};

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainContainer);