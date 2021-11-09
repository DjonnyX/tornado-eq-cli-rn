import React, { Dispatch } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { AlertContent, ModalTransparent } from "../components/simple";
import { IAlertState } from "../interfaces";
import { CapabilitiesSelectors, NotificationSelectors } from "../store/selectors";
import { NotificationActions } from "../store/actions";
import { IEQueueTheme } from "@djonnyx/tornado-types";

interface IAlertServiceProps {
    // store
    _theme: IEQueueTheme;
    _alertParams: IAlertState;
    _alertClose: () => void;
}

export const AlertServiceContainer = React.memo(({ _theme, _alertParams, _alertClose }: IAlertServiceProps) => {
    const theme = !!_theme ? _theme?.themes?.[_theme?.name] : undefined;
    return (
        !!theme &&
        <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, }}>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <ModalTransparent theme={theme} visible={Boolean(_alertParams.visible)}>
                    <AlertContent
                        theme={theme}
                        title={_alertParams.title || ""}
                        message={_alertParams.message || ""}
                        buttons={_alertParams.buttons.map(b => ({
                            ...b,
                            action: () => {
                                if (!!b.action) {
                                    b.action();
                                }

                                _alertClose();
                            }
                        }))}
                    />
                </ModalTransparent>
            </View>
        </View>
    )
});

const mapStateToProps = (state: IAppState) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _alertParams: NotificationSelectors.selectAlert(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const AlertService = connect(mapStateToProps, mapDispatchToProps)(AlertServiceContainer);