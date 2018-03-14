import * as actionTypes from "./actionTypes";



export const snackbarSetMessage=(message)=>{
    return dispatch=>{
        dispatch({
            type:actionTypes.SNACKBAR_MESSAGE,
            message:message
        })
    };

};

export const snackbarOpenState=(isOpen)=>{
    console.log("about to dispatch");
    return dispatch =>{

        dispatch ({type:actionTypes.SNACKBAR_OPEN,
            isOpen:isOpen})
    };

};

export const spinnerOpenState=(isOpen)=>{
    //console.log("about to dispatch");
    return dispatch =>{

        dispatch ({type:actionTypes.SPINNER_OPEN,
            isOpen:isOpen})
    };

};




