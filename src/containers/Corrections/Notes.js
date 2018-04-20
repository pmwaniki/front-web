import React , {Component} from 'react';
import * as actions from "../../store/actions";
import {connect} from 'react-redux';


class Notes extends Component{

    state={
        notes_text:''
    };


    saveNote=()=>{
        let data={};
        let val=this.props.unique_fields;
        val.forEach((v)=>{
            data[v]=this.props.notes_row[v]
        });
        console.log("data to be sent",data);
        this.props.notesChanged(this.props.validation,data,this.props.notes_row["__note__"]);
        this.props.setNotesModal(false);
    };

    closeNote=()=>{
        this.props.setNotesModal(false);
    };

    onChangeText=(e)=>{
        let new_row={...this.props.notes_row};
        new_row["__note__"]=e.target.value;

        this.props.setModalRow(new_row);
    };

    render(){
        const style={
            modal_backdrop:{
                position:"fixed",
                zIndex:1,
                top:0,
                right:0,
                width:"100%",
                height:"100%",
                backgroundColor:"#f2f2f2",
                opacity:0.5

            },
            modal_contents:{
                position:"fixed",
                zIndex:100,
                right:0,
                top:60,
                backgroundColor:"blue",
                opacity:1
            },
            textarea:{
                position:"relative",
                right:0

            },
            buttons:{
                position:"relative",


            }
        };
        return(
            <div style={{display: this.props.notes_modal_open ? "block" : "none"}}>
                <div style={style.modal_backdrop}>

                </div>
                <div style={style.modal_contents}>
                    <h1>Notes</h1>
                    <textarea rows="10" cols={"50"} value={this.props.notes_row.__note__} onChange={this.onChangeText} style={style.textarea}></textarea>
                    <br/>
                    <div style={style.buttons}><button onClick={this.saveNote}>SAVE</button> <button onClick={this.closeNote}>CANCEL</button></div>
                </div>
            </div>

        );
    }
}

const mapStateToProps= state=>{
    return{
        notes_row:state.corrections.notes_row,
        notes_modal_open:state.corrections.notes_modal_open,
        validation:state.corrections.validation,
        unique_fields:state.corrections.unique_fields

    }
};

const mapDispatchToProps=dispatch=>{
    return {
        notesChanged: (validation,data,text)=>dispatch(actions.notesChanged(validation,data,text)),
        setNotesModal: (open)=>dispatch(actions.setNotesModal(open)),
        setModalRow: (row)=>dispatch(actions.setModalRow(row))
    }
};
export default connect(mapStateToProps,mapDispatchToProps) (Notes);