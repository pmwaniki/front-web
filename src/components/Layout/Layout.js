import React from "react";
import {NavLink,Link} from "react-router-dom";


const layout = (props)=>{

  return(
    <div>
    <div>
    <header>
        <nav className="navbar navbar-inverse">
          <div  className="container-fluid">
            <ul className="nav navbar-nav">
              <li className={props.path.pathname==="/images" ? "active" : null}><NavLink  to="/images" className="nav-link" activeClassName="active">Images</NavLink></li>
              <li className={props.path.pathname==="/corrections" ? "active" : null}><NavLink to="/corrections" className="nav-link" activeClassName="active">Corrections</NavLink></li>
            </ul>
              {props.username ? <ul className={"nav navbar-nav navbar-right"}>
                  <li className={"dropdown"}>
                      <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                          <span className="glyphicon glyphicon-user"></span> {props.username}
                      </a>


                  </li>
                  <li><a><div onClick={props.logout}>Logout</div></a></li>


              </ul> : null}



          </div>

        </nav>
        </header>
    </div>
    <div>
      <div>{props.children}</div>
    </div>
</div>


  );
};

export default layout;
