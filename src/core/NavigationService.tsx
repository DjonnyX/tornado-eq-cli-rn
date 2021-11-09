import React, { Dispatch, useEffect } from "react";
import { connect } from "react-redux";
import { ICompiledLanguage, ICompiledOrderType } from "@djonnyx/tornado-types";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors, CombinedDataSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { CapabilitiesActions, NotificationActions } from "../store/actions";

interface INavigationServiceProps {
    // store
    _setLanguage?: (language: ICompiledLanguage) => void;
    _snackClose?: () => void;
    _alertClose?: () => void;
    _languages?: Array<ICompiledLanguage>;
    _currentScreen?: MainNavigationScreenTypes;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
}

export const NavigationServiceContainer = React.memo(({ onNavigate, _currentScreen, _languages,
    _setLanguage, _alertClose, _snackClose }: INavigationServiceProps) => {

    useEffect(() => {
        // etc
    }, [_currentScreen, onNavigate]);

    useEffect(() => {
        if (!!_currentScreen && onNavigate !== undefined) onNavigate(_currentScreen as MainNavigationScreenTypes);
    }, [_currentScreen]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _languages: CombinedDataSelectors.selectLangages(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _setLanguage: (language: ICompiledLanguage) => {
            dispatch(CapabilitiesActions.setLanguage(language));
        },
        _snackClose: () => {
            dispatch(NotificationActions.snackClose());
        },
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const NavigationService = connect(mapStateToProps, mapDispatchToProps)(NavigationServiceContainer);