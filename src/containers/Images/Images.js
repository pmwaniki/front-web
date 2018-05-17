import React,{Component,withRouter} from "react";


import ImageTable from "./ImageTable/ImageTable";
import Hospitals from "./Hospitals/Hospitals";
import axios from "axios";
import {Route,Switch, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from "../../store/actions/index.js";
import {setHospital} from "../../store/actions";

var _ = require('lodash');

class Images extends Component{

    componentWillMount=()=>{
        //this.props.setImages(51);
        this.props.setAllImages();
    };

  changeHosp=(hosp_id)=>{
    this.props.setHosp(hosp_id);
    //this.props.setImages(hosp_id);
    this.props.setAllImages();
  };

  formatImages=(data) =>{
    //IPs= _.chain(data).uniqBy( 'ipno').map('ipno').value();
    var groups=_.groupBy(data, (e) => `${e.record_id}___${e.ipno}`);
    //console.log("Group:",groups);
    return Object.keys(groups).map((key,index)=>{
        let dates=groups[key].map(im=>im.date_created);
        return {
            uniqueId:key,
            recordID:key.split("___")[0],
            ipno:key.split("___")[1],
            last_modified: dates.reduce((a,b)=> {return a>b ? a : b ;}),
            files:groups[key].map(file=>{return{date_created:file.date_created,file_path:file.file_path}})}
    });
  };

  render(){
      let images=this.props.images_all.filter(image => image['hosp_id']===this.props.hosp);

      //console.log("Images: ",images);
      let images_formated=this.formatImages(images);
      //console.log("Images formated",images_formated);
    return(
      <div className="container-fluid">

          <div className="row">
            <div className="col-sm-2">
                <ul className="nav nav-pills nav-stacked">
                    {this.props.hospitals.map(hosp =>{
                        return <li onClick={()=>this.changeHosp(hosp.id)} className={hosp.id===this.props.hosp? "active": null } key={hosp.id}>
                            <a >{hosp.name}</a></li>
                    })}
                </ul>
            </div>
            <div className="col-sm-10">

                <ImageTable name={this.props.hosp} records={images_formated}/>

            </div>


          </div>
        </div>
    );
  }
}

const mapStateToProps=(state)=>{
  return {
      hosp: state.images.hosp,
      hospitals:state.images.hospitals,
      images:state.images.images,
      images_all: state.images.images_all
  }
};

const mapDispatchToProps=(dispatch)=>{
  return {
    setHosp: (hosp_id)=> dispatch(actions.setHospital(hosp_id)),
      //setImages: (hosp_id) => dispatch(actions.getImages(hosp_id)),
      setAllImages:()=>dispatch(actions.getAllImages())
  }
}


export default connect(mapStateToProps,mapDispatchToProps) (Images);
//export default withRouter( connect( mapStateToProps )( Images ) );
