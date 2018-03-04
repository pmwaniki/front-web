import axios from 'axios';
import config from "../../config";
import * as actionTypes from './actionTypes';

const authStart=()=>{
    return {
        type:actionTypes.AUTH_START
    }
};
const authSuccess=(token,username)=>{
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username:username
    }
};

const authFail=(error)=>{
    return {
        type:actionTypes.AUTH_FAIL,
        error:error
    }
};

export const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    return{
        type:actionTypes.AUTH_LOGOUT
    }
};


export const auth=(username,password)=>{
    return dispatch=>{
        dispatch(authStart());
        const authData={
            username:username,
            password:password
        };
        axios.post("/api-token-auth/", authData)
            .then(res=>{
                if(!res.data.token){
                    throw Error("No token returned");
                }
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("username",username);
                dispatch(authSuccess(res.data.token,username));
            })
            .catch(err=>{
                if (err.response){
                    dispatch(authFail("Unable to log in with provided credentials"));
                    console.log("Response Error:",err);
                } else if(err.request){
                    dispatch(authFail("Unable to reach remote server: Contact site Admin"));
                    console.log("Request error",err);
                } else {
                    dispatch(authFail("Something went wrong: contact site admin"));
                    console.log("Other Error:",err);
                }

            });
    }
};

export const checkAuthState=()=>{
    return dispatch=>{
        const token=localStorage.getItem("token");
        if(!token){
            dispatch(logout());
        } else {
            const username=localStorage.getItem("username");
            dispatch(authSuccess(token,username));
        }
    }
};