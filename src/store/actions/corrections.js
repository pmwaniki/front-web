import * as actionTypes from "./actionTypes";
import axios from "axios";
import {spinnerOpenState} from './index'
import {SET_FILTER_HOSPITALS} from "./actionTypes";



const getToken=()=>{
    let token=localStorage.getItem("token");
    return "Token " + token
};

const setValidations=(data)=>{
    return { type:actionTypes.SET_VALIDATIONS,validations:data}
};


export const getValidations=()=>{
    return dispatch =>{
      //console.log("Getting validations");
        axios.get("/api2/validations/")
            .then(res => dispatch(setValidations(res.data)));
    }
};

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
export const setFilterHospital=(hosp_id)=>{
    return {
        type: actionTypes.SET_FILTER_HOSPITAL, hosp_id: hosp_id
    }
};

export const setFilterHospitals = (selected_hosp)=>{
    return {
        type: actionTypes.SET_FILTER_HOSPITALS, selected_hosp:selected_hosp
    }
}

export const setFilter=(filter)=>{
    return{
        type:actionTypes.SET_FILTER,
        filter:filter
    }
};

export const setValidation=(validation,unique_fields)=>{
    return{
        type:actionTypes.SET_VALIDATION,
        validation:validation,
        unique_fields:unique_fields
    }
};

const setIssues=(data) =>{
    //console.log(data);
    return {
        type:actionTypes.SET_ISSUES,
        issues:data
    }
};

const setValidationErrors=(errors)=>{
    return {
        type:actionTypes.SET_VALIDATTION_ERRORS,
        errors:errors
    }

};

export const getIssues = (validation,start,stop,hosp)=>{
    return dispatch=>{
        let query=`/api2/issues/?validation=${validation}`;
        if (start !== "") query=query + `&start=${start}`;
        if (stop !== "") query=query + `&stop=${stop}`;
        // if(hosp !== "0") query=query + `&hosp=${hosp}`;
        query=query + `&hosp=${hosp.join(",")}`;
        // if (hosp.length==1){
        //     query=query + `&hosp=${hosp}`;
        // }else {
        //     query=query + `&hosp=${hosp.join(",")}`;
        // }
        dispatch(spinnerOpenState(true));
        dispatch(setValidationErrors(''));
        axios.get(query,{headers:{authorization:getToken()}})
            .then(res_issues => {

                axios.get(`/api2/history/?validation=${validation}`,{headers:{authorization:getToken()}})
                    .then(res_hist=>{
                        dispatch(spinnerOpenState(false));
                        return dispatch(setIssues({history:res_hist.data,issues:res_issues.data}))
                    })
                    .catch(error=>{
                        dispatch(spinnerOpenState(false));
                        if (error.response){
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            // The request was made but no response was received
                            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                            // http.ClientRequest in node.js
                            console.log(error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }

                    })
                ;
                })
            .catch(error => {
                dispatch(spinnerOpenState(false));
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Response error",error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    dispatch(setValidationErrors(error.response.data));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log("request error:",error.request);
                    dispatch(setValidationErrors("Request error:Contact site admin"));
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    dispatch(setValidationErrors(error.message));
                }


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
export const notesChanged=(validation,data,text)=>{
    return dispatch=>{
        dispatch(spinnerOpenState(true));
        axios.post(`/api2/history/`,{validation:validation,values:data,notes:text},{headers:{authorization:getToken()}})
            .then(res =>{
                dispatch(setHistory(validation,res.data));
                dispatch(spinnerOpenState(false));
            })
            .catch(err=>{
                alert("Could not get or set history");
                dispatch(spinnerOpenState(false));
            });
    }
};
export const changeHistory=(validation,data,checked)=>{
    return dispatch=>{
        dispatch(spinnerOpenState(true));
        axios.post(`/api2/history/`,{validation:validation,values:data,checked:checked},{headers:{authorization:getToken()}})
            .then(res =>{
                dispatch(setHistory(validation,res.data));
                dispatch(spinnerOpenState(false));
            })
            .catch(err=>{
                alert("Could not get or set history");
                dispatch(spinnerOpenState(false));
            });

    }
};

//NOTES MODAL
export const setNotesModal=(open)=>{
    return dispatch=>{
        dispatch({
            type:actionTypes.SET_NOTES_MODAL,
            open:open
        });
    }

};

export const setModalRow=(row)=>{
    return dispatch=>{
        dispatch({
            type:actionTypes.SET_NOTES_ROW,
            row:row
        });
    }

};
