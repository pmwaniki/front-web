import * as actionTypes from "../actions/actionTypes";


const initialState={
    validations:[],
    validation:"",
    unique_fields:[],
    start:"",
    stop:"",
    issues:{schema:{fields:[]},data:[]},
    errors:"",
    history:[],
    notes_modal_open:false,
    notes_row:{__note__:''}
};


const reducer = (state=initialState,action) =>{
    switch (action.type){
        case actionTypes.SET_VALIDATIONS: return {...state,validations:action.validations};
        case actionTypes.SET_VALIDATION: return {...state,validation:action.validation,unique_fields:action.unique_fields};
        case actionTypes.SET_VALIDATIONS_START: return {...state,start:action.date};
        case actionTypes.SET_VALIDATIONS_STOP: return {...state,stop:action.date};
        case actionTypes.SET_ISSUES: return {...state,issues: action.issues.issues,history:action.issues.history};
        case actionTypes.SET_HISTORY: return {...state,history:action.history};
        case actionTypes.SET_VALIDATTION_ERRORS: return {...state,errors:action.errors};
        case actionTypes.SET_NOTES_ROW: return {...state,notes_row:action.row};
        case actionTypes.SET_NOTES_MODAL: return{...state,notes_modal_open:action.open};
        default: return state;

    }

}

export default reducer;