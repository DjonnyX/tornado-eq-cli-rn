import { ICompiledOrderType, ICompiledLanguage, IEQueueTheme } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export interface ICapabilitiesState {
    themes: IEQueueTheme | undefined;
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
    currentScreen: MainNavigationScreenTypes | undefined;
}