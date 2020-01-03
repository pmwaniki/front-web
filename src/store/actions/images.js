import * as actionTypes from "./actionTypes";
import axios from "axios";




const getToken=()=>{
    let token=localStorage.getItem("token");
    return "Token " + token
};

const setAllImages=(data)=>{
    return {
        type: actionTypes.GET_ALL_IMAGES,
        images:data
    }

};

export const getAllImages=()=>{
    return dispatch =>{
        axios.get("/api2/",{headers:{authorization:getToken()}})
            .then(res =>{
                dispatch(setAllImages(res.data));
            })
            .catch(err=>console.log("Error fetching all images:",err));
    }
};



export const setHospital=(hosp_id)=>{
    return {
        type: actionTypes.SET_HOSPITAL, hosp_id: hosp_id
    }
};

const setAllHospitals=(data)=>{
    return {
        type:actionTypes.SET_ALL_HOSPITALS,
        hospitals: data
    }
};


export const getHospitals=()=>{
    return dispatch=>{
        axios.get("/api2/hospitals/",{headers:{authorization:getToken()}})
            .then( res=>{
                console.log(res.data);
                dispatch(setAllHospitals(res.data));
            })
    }
};

export const upload=(image)=>{
    return dipatch=>{
        let url="/api2/new/";
        let formData=new FormData();
        formData.append('file_path',image.file_path);
        formData.append('record_id',image.record_id);
        formData.append('ipno',image.ipno);
        formData.append('hosp_id',image.hosp_id);

        axios.post(url,formData,{headers:{authorization:getToken()}})
            .then( res => {
                //this.props.setImages(this.props.hosp);
                dipatch(getAllImages());
            })
            .catch(err => console.log(err));
    }
};

