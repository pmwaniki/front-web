import React,{Component} from "react";
import * as actions from "../../store/actions/index";
import {connect} from "react-redux";
import CorrectionTable from "./CorrectionTable";


class Corrections extends Component{



    refreshHandler=(event)=>{
        event.preventDefault();
        this.props.setIssues(this.props.validation,this.props.start,this.props.stop);

    };
    changeStart = (e) =>{
        this.props.setStart(e.target.value);
    };
    changeStop = (e) =>{
        this.props.setStop(e.target.value);
    };
    changeValidation=(e) =>{
        this.props.setValidation(e.target.value);
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




                <button type="submit" className="btn btn-primary" onClick={(e)=>this.refreshHandler(e)}>Refresh</button>
            </form>
          </div>
          <div className="panel-body">
            <p>Issues for hosp</p>
              {<CorrectionTable/>}
          </div>
      </div>
    );
  }
}

const mapStateToProps = state=>{
    return {
        validations:state.corrections.validations,
        validation:state.corrections.validation,
        start:state.corrections.start,
        stop:state.corrections.stop
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        getValidations: () => dispatch(actions.getValidations()),
        setValidation: (validation) => dispatch(actions.setValidation(validation)),
        setStart: (date)=> dispatch(actions.setValidationStart(date)),
        setStop: (date) => dispatch(actions.setValidationStop(date)),
        setIssues: (validation,start,stop) => dispatch(actions.getIssues(validation,start,stop)),
    }

};
export default connect(mapStateToProps,mapDispatchToProps) (Corrections);
