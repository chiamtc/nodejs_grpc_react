import React, {Component} from "react";

const {List, Empty, Employee, Watch} = require('../proto/employees_pb.js');
const {EmployeesClient} = require('../proto/employees_grpc_web_pb.js');

var client = new EmployeesClient('http://' + window.location.hostname + ':8080',
    null, null);


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        var request = new Empty();
        /*client.list(request, {}, function (err, message) {
            console.log('err', err)
            console.log('message', message)
        });*/

        var watcher = client.watch(request, {});
        watcher.on('data', (response) => {
            console.log('watching?', response.toObject())
        })
/*

        watcher.on('end',(response)=>{
            console.log('watching end?',response)
        })
*/


        var newEmp = new Employee();
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
        }, 10000);
    }


    render() {
        return (
            <div>
                <form>
                    Name:<input/>
                    Email:<input/>

                </form>
            </div>
        )
    }
}

export default (Dashboard);
