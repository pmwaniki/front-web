import * as actionTypes from "../actions/actionTypes";

const initialState={
    username:'',
    loggedIn:false,
    token:'',
    error:''
};


const reducer=(state=initialState,action)=>{
    switch (action.type){
        case actionTypes.AUTH_START: return initialState;
        case actionTypes.AUTH_LOGOUT: return initialState;
        case actionTypes.AUTH_SUCCESS: return {...state,username:action.username,
            token:action.token,loggedIn:true};
        case actionTypes.AUTH_FAIL:return {...state,error:action.error};

        default: return state;
    }
};


export default reducer;