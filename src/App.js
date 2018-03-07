import React, { Component } from 'react';
import {Route,Redirect,withRouter,Switch} from 'react-router-dom';
import Layout from "./components/Layout/Layout";
import Images from "./containers/Images/Images";
import Corrections from "./containers/Corrections/Corrections";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";
import Login from "./containers/Authentication/Login"

import * as actions from "./store/actions/index";


import './App.css';

class App extends Component {
    componentWillMount(){
        this.props.initHospitals();
        this.props.initValidations();
        this.props.checkAuthState();
    }
  render() {
        let body=(<Login/>);
        if(this.props.loggedIn){
            body=(
                <Switch>
                    <Route name="images" path="/images" component={Images} ></Route>
                    <Route name="corrections" path="/corrections" component={Corrections} />
                    <Route path="/" component={Images}/>


                </Switch>
            );
        }

    return (

        <div className="App">
            {/*this.props*/}
        <Layout path={this.props.location} username={this.props.username} logout={this.props.logout}>
            {body}

        </Layout>


        </div>

    );
  }
}

const mapStateToProps=(state)=>{
    return {
        loggedIn:state.auth.loggedIn,
        username:state.auth.username
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {
        initHospitals: ()=> dispatch(actions.getHospitals()),
        initValidations: () => dispatch(actions.getValidations()),
        checkAuthState:()=>dispatch(actions.checkAuthState()),
        logout:()=>dispatch(actions.logout()),
    }
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps,null,{pure:false}) (App));
