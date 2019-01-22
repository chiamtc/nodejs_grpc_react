import React, {Component} from 'react';
const {LoginReq} = require('../proto/user_pb');
const {UsersClient} = require('../proto/user_grpc_web_pb');
import {withRouter} from "react-router-dom";
var userClient = new UsersClient('http://' + window.location.hostname + ':8080',
    null, null);

class Login extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:''
        }
    }

    login = (e)=>{
        e.preventDefault();
        const user = new LoginReq();
        user.setEmail(this.state.email)
        user.setPassword(this.state.password);
        console.log('user',user)
        userClient.login(user, {}, (err,res)=>{
            console.log('err',err)
            console.log('res',res)
           if(err) return;
            localStorage.setItem('access_token',res)
            this.props.history.push('/')
        })
    };

    render() {
        return (<div>
            <form>
                Email:<input onChange={(e)=> this.setState({email:e.target.value})}/>
                <br/>
                Password:<input onChange={(e)=> this.setState({password:e.target.value})}/>
                <button onClick={this.login}>Login</button>
            </form>
        </div>)
    }


}

export default withRouter(Login);
