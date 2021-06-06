import { Action } from "redux";
import { ICompiledOrderType, ICompiledLanguage, IEQueueTheme } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export enum CapabilitiesActionTypes {
    SET_THEMES = "TORNADO/capabilities/set-themes",
    SET_LANGUAGE = "TORNADO/capabilities/set-language",
    SET_ORDER_TYPE = "TORNADO/capabilities/set-order-type",
    SET_CURRENT_SCREEN = "TORNADO/capabilities/set-current-screen",
}

interface ICapabilitiesActionSetThemes extends Action<CapabilitiesActionTypes.SET_THEMES> {
    themes: IEQueueTheme;
}

interface ICapabilitiesActionSetLanguage extends Action<CapabilitiesActionTypes.SET_LANGUAGE> {
    language: ICompiledLanguage;
}

interface ICapabilitiesActionSetOrderType extends Action<CapabilitiesActionTypes.SET_ORDER_TYPE> {
    orderType: ICompiledOrderType;
}

interface ICapabilitiesActionSetCurrentScreen extends Action<CapabilitiesActionTypes.SET_CURRENT_SCREEN> {
    currentScreen: MainNavigationScreenTypes;
}

export class CapabilitiesActions {
    static setThemes = (themes: IEQueueTheme): ICapabilitiesActionSetThemes => ({
        type: CapabilitiesActionTypes.SET_THEMES,
        themes,
    });

    static setLanguage = (language: ICompiledLanguage): ICapabilitiesActionSetLanguage => ({
        type: CapabilitiesActionTypes.SET_LANGUAGE,
        language,
    });

    static setOrderType = (orderType: ICompiledOrderType): ICapabilitiesActionSetOrderType => ({
        type: CapabilitiesActionTypes.SET_ORDER_TYPE,
        orderType,
    });

    static setCurrentScreen = (currentScreen: MainNavigationScreenTypes): ICapabilitiesActionSetCurrentScreen => ({
        type: CapabilitiesActionTypes.SET_CURRENT_SCREEN,
        currentScreen,
    });
}

export type TCapabilitiesActions = ICapabilitiesActionSetThemes | ICapabilitiesActionSetLanguage | ICapabilitiesActionSetOrderType
    | ICapabilitiesActionSetCurrentScreen;