import React, {Component} from "react";
import config from "../../../config";

class ImageDetails extends Component{

    render(){
        return(
            <div>
                {this.props.files.files.map((f,index) =>{
                    return <img className="img-fluid" key={index} src={`${config.bandendURL}/${f.file_path}`} />
                })}

            </div>
        );
    }
}

export default ImageDetails;
