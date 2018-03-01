import React ,{Component} from "react";
import {NavLink} from "react-router-dom";

import {connect} from "react-redux";


class Hospitals extends Component{

  render(){

    return(
      <div>

        <ul className="nav nav-pills nav-stacked">
          {this.props.hosp_list.map(hosp=>{
            return (<li key={hosp.id} className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={`${this.props.match.url}/${hosp.id}`}>
                {hosp.name}
              </NavLink>
            </li>);
          })}

        </ul>
      
      </div>

    );
  }
}

const mapStateToProps= state=>{
    return {
        hosp: state.images.hosp
    }
}

export default connect(mapStateToProps) (Hospitals);
