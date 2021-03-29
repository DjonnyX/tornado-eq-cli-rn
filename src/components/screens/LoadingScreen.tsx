import React, { Dispatch, useEffect } from "react";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CapabilitiesSelectors, CombinedDataSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { CapabilitiesActions } from "../../store/actions";

interface ILoadingSelfProps {
  // store props
  _theme: string;
  _progress: number;
  _loaded: boolean;
  _setCurrentScreen: (screen: MainNavigationScreenTypes) => void;

  // self props
}

interface ILoadingProps extends ILoadingSelfProps { }

const LoadingScreenContainer = React.memo(({ _theme, _progress, _loaded, _setCurrentScreen }: ILoadingProps) => {
  useEffect(() => {
    if (_loaded) {
      _setCurrentScreen(MainNavigationScreenTypes.ORDERS);
    }
  }, [_loaded]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
      <ProgressBar
        style={{ width: "100%", maxWidth: 200, marginLeft: "10%", marginRight: "10%" }}
        styleAttr="Horizontal"
        progress={_progress / 100}
        indeterminate={false}
        color={theme.themes[theme.name].loading.progressBar.trackColor}></ProgressBar>
      <Text style={{ color: theme.themes[theme.name].loading.progressBar.textColor }}>
        {
          _progress > 0
            ?
            `${_progress}%`
            :
            "загрузка..."
        }
      </Text>
    </View>
  );
})

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  return {
    _theme: CapabilitiesSelectors.selectTheme(state),
    _progress: CombinedDataSelectors.selectProgress(state),
    _loaded: CombinedDataSelectors.selectLoaded(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
  return {
    _setCurrentScreen: (screen: MainNavigationScreenTypes) => {
      dispatch(CapabilitiesActions.setCurrentScreen(screen));
    },
  };
};

export const LoadingScreen = connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);