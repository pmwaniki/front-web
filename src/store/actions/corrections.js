import * as actionTypes from "./actionTypes";
import axios from "axios";
import {spinnerOpenState} from './index'



const getToken=()=>{
    let token=localStorage.getItem("token");
    return "Token " + token
};

const setValidations=(data)=>{
    return { type:actionTypes.SET_VALIDATIONS,validations:data}
}


export const getValidations=()=>{
    return dispatch =>{
      //console.log("Getting validations");
        axios.get("/api/validations/")
            .then(res => dispatch(setValidations(res.data)));
    }
}

export const setValidationStart=(date)=>{
    return{
        type:actionTypes.SET_VALIDATIONS_START,
        date:date
    }
};

export const setValidationStop=(date)=>{
    return{
        type:actionTypes.SET_VALIDATIONS_STOP,
        date:date
    }
};

export const setValidation=(validation)=>{
    return{
        type:actionTypes.SET_VALIDATION,
        validation:validation
    }
};

const setIssues=(data) =>{
    console.log(data);
    return {
        type:actionTypes.SET_ISSUES,
        issues:data
    }
};


export const getIssues = (validation,start,stop)=>{
    return dispatch=>{
        let query=`/api/issues/?validation=${validation}`;
        if (start !== "") query=query + `&start=${start}`;
        if (stop !== "") query=query + `&stop=${stop}`;
        axios.get(query,{headers:{authorization:getToken()}})
            .then(res_issues => {
                dispatch(spinnerOpenState(true));
                axios.get(`/api/history/?validation=${validation}`,{headers:{authorization:getToken()}})
                    .then(res_hist=>{
                        dispatch(spinnerOpenState(false));
                        return dispatch(setIssues({history:res_hist.data,issues:res_issues.data}))
                    });
                })
            .catch(err => {
                console.log(err);
                dispatch(spinnerOpenState(false));
            });
    }
};

const setHistory=(validation,data)=>{
    return {
        type:actionTypes.SET_HISTORY,
        validation:validation,
        history: data
    }
};
export const changeHistory=(validation,data)=>{
    return dispatch=>{
        axios.post(`/api/history/`,{validation:validation,values:data},{headers:{authorization:getToken()}})
            .then(res =>{
                dispatch(setHistory(validation,res.data));
            });
    }
};
