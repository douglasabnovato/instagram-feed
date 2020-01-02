import React from 'react';
import { Switch, Route } from 'react-router-dom';

import New from './pages/New';
import Feed from './pages/Feed';

function Routes(){
    return(
        <Switch>
            <Route path="/" exact component={Feed} />
            <Route path="/new" component={New} />
        </Switch>
    );
}

export default Routes;