import React,{Component} from "react";
import * as actions from "../../store/actions/index";
import {connect} from "react-redux";
import CorrectionTable from "./CorrectionTable";
import Notes from './Notes';


class Corrections extends Component{



    refreshHandler=(event)=>{
        event.preventDefault();
        if(!this.props.validation){
            alert("Validation must be set");
            return;
        }
        this.props.setIssues(this.props.validation,this.props.start,this.props.stop,this.props.hosp);

    };
    changeStart = (e) =>{
        this.props.setStart(e.target.value);
    };
    changeStop = (e) =>{
        this.props.setStop(e.target.value);
    };
    changeHosp=(e)=>{
        this.props.setFilterHospital(e.target.value);
    };
    changeValidation=(e) =>{
        //get unique variables
        let validation=e.target.value;
        let val=this.props.validations.filter((e)=>e.validation_id===validation);
        val=val[0]['field_unique'];
        this.props.setValidation(validation,val);
        console.log("Selected:",e.target.value);
    }



  render(){
    return(
      <div className="panel panel-default">
          <div className="panel-heading">
            <form className="form-inline">
                <div className="form-group">
                    <label>Validation:</label>
                    <select value={this.props.validation} onChange={(e)=>this.changeValidation(e)}>
                        <option value={null}></option>
                        {this.props.validations.map(validation => {
                            return <option value={validation.validation_id} key={validation.validation_id}>{validation.name}</option>
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label>Start</label>
                    <input className='Date-input' type='date' value={this.props.start} onChange={(e)=>this.changeStart(e)}/>
                </div>
                <div className="form-group">
                    <label>Stop</label>
                    <input className='Date-input' type='date' value={this.props.stop} onChange={(e)=>this.changeStop(e)}/>
                </div>

                <div className="form-group">
                    <label>Hospital</label>
                    <select onChange={this.changeHosp}>
                        <option value={0}>All</option>
                        {this.props.hospitals.map((h)=>{
                            return <option value={h.id} selected={this.props.hosp===h.id}>{h.name}</option>
                        })}
                    </select>
                </div>




                <button type="submit" className="btn btn-primary" onClick={(e)=>this.refreshHandler(e)}>Refresh</button>
            </form>
          </div>
          <div className="panel-body">
            <p>Issues for hosp</p>
              <Notes/>
              {this.props.validation_errors !== "" ? <h1>{this.props.validation_errors}</h1> : <CorrectionTable/>}
          </div>
      </div>
    );
  }
}

const mapStateToProps = state=>{
    return {
        validations:state.corrections.validations,
        validation:state.corrections.validation,
        validation_errors:state.corrections.errors,
        start:state.corrections.start,
        stop:state.corrections.stop,
        hosp: state.corrections.hosp,
        hospitals:state.images.hospitals,
    }
};

const mapDispatchToProps = dispatch =>{
    return {
        getValidations: () => dispatch(actions.getValidations()),
        setValidation: (validation,unique_fields) => dispatch(actions.setValidation(validation,unique_fields)),
        setStart: (date)=> dispatch(actions.setValidationStart(date)),
        setStop: (date) => dispatch(actions.setValidationStop(date)),
        setIssues: (validation,start,stop,hosp) => dispatch(actions.getIssues(validation,start,stop,hosp)),
        setFilterHospital: (h)=>dispatch(actions.setFilterHospital(h)),
    }

};
export default connect(mapStateToProps,mapDispatchToProps) (Corrections);
