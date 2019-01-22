import React, {Component, Suspense, lazy} from 'react'
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect,
    Match, withRouter
} from 'react-router-dom'
import Login from '../login';
import Dashboard from '../_dashboard';

class Routes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={(props) => localStorage.getItem('access_token') !== null
                        ? <Dashboard/> :
                        <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}/>
                    <Route exact path='/login' component={Login}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;
