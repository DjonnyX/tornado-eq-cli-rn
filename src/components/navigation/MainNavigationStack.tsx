import React from "react";
import {
  createStackNavigator,
} from "@react-navigation/stack";

import { LoadingScreen } from "../screens/LoadingScreen";
import { MainNavigationScreenTypes } from "./MainNavigationScreenTypes";
import { AuthScreen } from "../screens/AuthScreen";
import { OrdersScreen } from "../screens/OrdersScreen";

const Stack = createStackNavigator();

export const MainNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainNavigationScreenTypes.AUTH}
      headerMode="none"
      screenOptions={{}}
    >
      <Stack.Screen
        name={MainNavigationScreenTypes.AUTH}
        component={AuthScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.LOADING}
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.ORDERS}
        component={OrdersScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}