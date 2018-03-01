import React,{Component} from "react";
import axios from "axios";
import * as actions from "../../../store/actions";
import {connect} from "react-redux";

class NewImage extends Component{
  state={
      file:"",
      ipno:"",
      id:""
  };

  onChangeFile=(e)=>{
    this.setState({file:e.target.files[0]});
  }
  onChangeIP=(e)=>{
    //console.log(e);
    this.setState({ipno:e.target.value});
  };
  onChangeID=(e)=>{
    this.setState({id:e.target.value});
  };



  submitHandler=(e)=>{
    e.preventDefault();
    if(!this.state.file){
      alert("No file selected");
      return null;
    }
    if(!this.state.ipno){
      alert("You must enter IP Number");
      return null;
    }
    if(!this.state.id){
        alert("You must enter record id");
        return;
    }

    this.props.upload({
        file_path:this.state.file,
        record_id:this.state.id,
        ipno:this.state.ipno,
        hosp_id:this.props.hosp
    });



    this.setState({
        file:"",
        ipno:"",
        id:""
    });

  }
  render(){

    return(
      <div>

        <form className="form form-inline"  method="post" encType="multipart/form-data">
            <div className="form-group">
              <label>Record ID</label>
              <input type="text" value={this.state.id} onChange= {this.onChangeID}/>
            </div>
            <div className="form-group">
                <label>IPNO</label>
                <input type="text" value={this.state.ipno} id="ipno" onChange={this.onChangeIP}/><br/>
            </div>
            <div className="form-group">
                <input type="file" onChange={this.onChangeFile} />
            </div>
            <div className="form-group"></div>

          <button type="submit" onClick={this.submitHandler} >Upload New Image</button>
        </form>
      </div>

    );
  }
}


const mapStateToProps=(state)=>{
    return {
        hosp: state.images.hosp
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {

        upload:(image)=>dispatch(actions.upload(image))
    }
};
export default connect(mapStateToProps,mapDispatchToProps) (NewImage);
