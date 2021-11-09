import { IEQueueTheme } from "@djonnyx/tornado-types";
import { createSelector } from "reselect";
import { IAppState } from "../state";

const getCapabilities = (state: IAppState) => state.capabilities;

export namespace CapabilitiesSelectors {
    export const selectTheme = createSelector(getCapabilities, (state) => {
        return state?.themes as IEQueueTheme;
    });

    export const selectLanguage = createSelector(getCapabilities, (state) => {
        return state?.language;
    });

    export const selectOrderType = createSelector(getCapabilities, (state) => {
        return state?.orderType;
    });

    export const selectCurrentScreen = createSelector(getCapabilities, (state) => {
        return state?.currentScreen;
    });
}