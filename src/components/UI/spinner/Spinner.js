import React, {Component} from 'react';
import {connect} from 'react-redux'
import './Spinner.css'

class Spinner extends Component{

    render(){
        let style={
            modal:{
                position:'fixed',
                zIndex:10,
                top:'56px',
                right:'50%',
                //backgroundColor:'blue',
                width:'50%',
                height:'50%'
            }
        };
        return(
            <div style={{...style.modal,display:this.props.open? 'block':'none'}}>
                <div className={'loader'}>
                </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        open: state.ui.spinnerOpen,
    }
}

export default connect(mapStateToProps)(Spinner);

