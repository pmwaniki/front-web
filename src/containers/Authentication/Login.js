import React , { Component} from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";


class Login extends Component{

    state={
        username:'',
        password:''
    };

    usernameChange=(e)=>{
        this.setState({...this.state,username:e.target.value})
    };
    passwordChange=(e)=>{
        this.setState({...this.state,password:e.target.value})
    };
    submitHandler=(e)=>{
        e.preventDefault();
        this.props.auth(this.state.username,this.state.password);
    };

    render(){

        return(
            <form className={"form"}>
                <span style={{color:'red'}}>{this.props.error}</span>
                <div className={"form-group"}>
                    <label>Username</label>
                    <input type={"text"} name="USERNAME" value={this.state.username} onChange={this.usernameChange}/>
                </div>
                <div className={"form-group"}>
                    <label>Password</label>
                    <input type={"text"} name="PASSWORD" value={this.state.password} type="password" onChange={this.passwordChange}/>
                </div>

                <button type={"submit"} className={"btn btn-default"} onClick={this.submitHandler}>Submit</button>

            </form>
        );
    }
};

const mapStateToProps= (state)=>{
    return {
        error:state.auth.error,
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {
        auth: (username,password)=>dispatch(actions.auth(username,password)),

    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Login);