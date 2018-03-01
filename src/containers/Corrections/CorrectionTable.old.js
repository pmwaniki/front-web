import React , {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../store/actions/index";
const $ = require('jquery');
$.DataTable = require('datatables.net');



class CorrectionTable extends Component{

    checked=(row,history_data,uniqueVars) =>{
        if(history_data.length===0){
            return 0;
        }
        return history_data.map(hist=>{

            return uniqueVars.map( (vars)=> {
                return hist.values[vars]===row[vars];

            }).reduce((a,b)=>a*b);

        }).reduce((a,b)=>a||b);


    };
    getUniqueVars=(validation)=>{
        let val=this.props.validations.filter((e)=>e.validation_id===validation);
        return val[0].field_unique;
    };

    onCheckHandler=(row)=>{
        console.log("Checkbox clicked",row);
        let data={};
        let val=this.props.validations.filter((e)=>e.validation_id===this.props.validation);
        val=val[0]['field_unique'];
        val.forEach((v)=>{
            data[v]=this.props.issues.data[row][v]
        });
        console.log(data);
        this.props.toggleChecked(this.props.validation,data);
    };

    renderTable=()=>{

        //table.show();
    }

    componentDidMount=()=>{
        console.log("Component did mount");
        let table=$('#corrTable').DataTable({
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "serverSide": false,
            "columnDefs": [
                { "orderable": false, "targets": 0 }
            ],
            "drawCallback": function( settings ) {
                console.log( 'DataTables has redrawn the table' );
            }
        });


    };

    componentWillUnmount=()=>{
        console.log("componentWillUnmount");



    };

    componentWillReceiveProps=()=>{
        console.log("Component will recieve props");
        $('#corrTable').DataTable().clear();
        //let table=$('#corrTable').DataTable();
        //table.draw();


    };
    componentDidUpdate=()=>{
        console.log("Component did update");

        let rows=this.formatData(this.props.issues.data,this.props.issues.schema);
        console.log("Transformed data",rows);
        rows.forEach(i =>  $('#corrTable').DataTable().row.add(i));
        $('#corrTable').DataTable().draw();
    };



    formatData=(data,schema)=>{
        let rows=[];
        return data.map((row,index)=>{
            let checked=this.checked(row,this.props.history,this.getUniqueVars(this.props.validation));
            let node=$(`<tr><td><input type='checkbox' onChange='()=>this.onCheckHandler(${index})' checked=${checked}/></td>${schema.fields.map(cell=>`<td>${row[cell.name]}</td>`) }</tr>`);
            //const node=html`<tr><td><input type='checkbox' onChange={()=>this.onCheckHandler(${index})} checked=${checked}/></td>${schema.fields.map(cell=>`<td>${row[cell.name]}</td>`) }</tr>`;

            return node;
        });
    };

    tableRows=(data)=>{
        /*const rows=`
        <tr>
        <td><input type="checkbox" onChange={()=>this.onCheckHandler(${row.index})} checked=${row.checked}/></td>
</tr>
        `;*/
    };

    render(){

        return(
            <div>
                <table id="corrTable" className={"table table-striped cell-border"}>
                    <thead><tr><th>{this.props.issues.data.length===0? "" : "Validated"}</th>
                        {this.props.issues.schema.fields.map(h=>{
                            return <th key={h.name}>{h.name}</th>
                        })}
                        </tr></thead>
                    <tbody>

                    {/*this.props.issues.data.map((row,index)=>{
                        return (<tr key={index}>
                            <td>
                                <input type="checkbox" onChange={()=>this.onCheckHandler(index)} checked={this.checked(row,this.props.history,this.getUniqueVars(this.props.validation))}/>
                            </td>
                            {this.props.issues.schema.fields.map(cell=>{
                                return <td key={cell.name}>{row[cell.name]}</td>
                            })}
                        </tr>);
                    })*/}
                    </tbody>
                </table>

            </div>
        );
    }
}

const mapStateToProps= state=>{
    return{
        validation: state.corrections.validation,
        validations: state.corrections.validations,
        issues: state.corrections.issues,
        history: state.corrections.history

    }
};

const mapDispatchToProps=dispatch=>{
    return {
        toggleChecked: (validation,data)=>dispatch(actions.changeHistory(validation,data))
    }
};


export default connect(mapStateToProps,mapDispatchToProps) (CorrectionTable);
