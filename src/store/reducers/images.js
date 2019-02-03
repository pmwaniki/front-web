import * as actionTypes from "../actions/actionTypes";


const initialState={
    hosp:51,
    hospitals:[],
    images:[],
    images_all:[]

};



const reducer=(state=initialState,action)=>{
    switch (action.type){
        case actionTypes.GET_ALL_IMAGES: return {...state,images_all:action.images};
        case actionTypes.SET_HOSPITAL: return {...state,hosp:action.hosp_id};
        case actionTypes.SET_ALL_HOSPITALS: return{...state,hospitals:action.hospitals};
        default: return state
    }
};




export default reducer;