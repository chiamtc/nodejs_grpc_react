import React, {Component} from "react";
import {withRouter} from 'react-router-dom'
const {List, Empty, Employee, Watch} = require('../proto/employees_pb.js');
const {EmployeesClient, EmployeesPromiseClient} = require('../proto/employees_grpc_web_pb.js');
var client = new EmployeesPromiseClient('http://' + window.location.hostname + ':8080',
    null, null);


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            employeesList: []
        }
    }

    componentDidMount() {
        var request = new Empty();

        /*
                //traditional callback - unary call
                client.list(request, {}, function (err, message) {
                    console.log('err', err)
                    console.log('message', message)
                });

                //using promise - unary call
                client.list(request, {}).then((message, err) => {
                    console.log('message', message.toObject())
                    console.log('err', err)
                });
        */


        var meta = {'custom-header-1':localStorage.getItem('access_token')}
        var watcher = client.watch(request, meta);
        watcher.on('data', (response) => {
            console.log('watching?', response.toObject())
            this.setState({employeesList: response.toObject().employeesList})
        })
        /*

                watcher.on('end',(response)=>{
                    console.log('watching end?',response)
                })
        */


        /* var newEmp = new Employee();
         newEmp.setName('test11');
         newEmp.setEmail('asdas11@sad.com')
         newEmp.setEmployeeId(parseInt(Math.random() * 1000000))
       //  console.log('newEmp', newEmp)

         var newEmp2 = new Employee();
         newEmp2.setName('test12');
         newEmp2.setEmail('asdas12@sad.com')
         newEmp2.setEmployeeId(parseInt(Math.random() * 1000000))
        // console.log('newEmp', newEmp2)
         setTimeout(() => {
             client.insert(newEmp, {}, function (err, message) {
                 console.log('insert err', err)
                 console.log('insert message', message)
             });
         }, 5000);

         setTimeout(() => {
             client.insert(newEmp2, {}, function (err, message) {
                 console.log('insert err', err)
                 console.log('insert message', message)
             });
         }, 10000);*/
    }

    testSubmit = (e) => {
        e.preventDefault();
        var newUser = new Employee();
        newUser.setEmployeeId(parseInt(Math.random() * 1000000))
        newUser.setName(this.state.name);
        newUser.setEmail(this.state.email)
        client.insert(newUser, {}).then((err, message) => {
            console.log('message', message)
            console.log('err', err)
        });
    }

    renderList = () => {
        return this.state.employeesList.map((e, i) => {
            return <p key={i}>{e.employeeId} - {e.name} - {e.email}</p>
        })
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderList()}
                </div>
                <hr/>
                <form>
                    Name:<input onChange={(e) => this.setState({name: e.target.value})}/>
                    Email:<input onChange={(e) => this.setState({email: e.target.value})}/>
                    <button onClick={this.testSubmit}>Submit</button>
                </form>
                <br/>
                <br/>
                <button onClick={(e)=>{e.preventDefault(); localStorage.clear();this.props.history.push('/login')}}>Sign out</button>
            </div>
        )
    }
}

export default withRouter(Dashboard);
