import { createAppContainer, createStackNavigator } from "react-navigation";

import Feed from "./pages/Feed";
import New from "./pages/New";

export default createAppConteiner(
    createStackNavigatior({
        Feed,
        New,
    })
);
