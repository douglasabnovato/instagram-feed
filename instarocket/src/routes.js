/* Navegação em pilha (React Navigation 4) do alô, uai mobile: o app abre no feed; a câmera leva à nova publicação */
import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Text } from "react-native";
import Feed from "./pages/Feed";
import New from "./pages/New";

/* Marca em texto no lugar do antigo logo de imagem */
function Marca() {
  return (
    <Text accessibilityRole="header" style={{ marginHorizontal: 20, fontFamily: "serif", fontSize: 22, fontWeight: "700", color: "#3B2417" }}>
      alô, uai
    </Text>
  );
}

export default createAppContainer(
  createStackNavigator({ Feed, New }, {
    initialRouteName: "Feed",
    defaultNavigationOptions: {
      headerTintColor: "#3B2417",
      headerStyle: { backgroundColor: "#FBF6EE" },
      headerTitle: () => <Marca />,
      headerBackTitleVisible: false,
    },
    mode: "modal",
  }),
);
/* Fim de routes.js */
