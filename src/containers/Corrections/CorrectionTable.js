import React , {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../store/actions/index";
import config from "../../config";
import $ from 'jquery'

//import 'datatables.net'
//import 'datatables.net-buttons'

import 'datatables.net-bs' ;
import 'datatables.net-buttons-bs' ;
import 'datatables.net-select';
import 'datatables.net-select-bs/css/select.bootstrap.css'
import 'datatables.net-buttons/js/buttons.colVis.js' ;
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons/js/buttons.html5.js' ;
import 'datatables.net-buttons/js/buttons.print.js' ;

import './CorrectionTable.css';




class CorrectionTable extends Component{



    checked=(row,history_data,uniqueVars) =>{
        history_data=history_data.filter(h=> h.checked );
        if(history_data.length===0){
            return 0;
        }

        return history_data.map(hist=>{

            return uniqueVars.map( (vars)=> {
                return hist.values[vars]===row[vars] & hist.checked;

            }).reduce((a,b)=>a*b);

        }).reduce((a,b)=>a||b);


    };
    getNote=(row,history_data,uniqueVars)=>{

        history_data=history_data.filter(h=>  h.note !== '');
        if(history_data.length===0){
            return '';
        }

        let hist_row= history_data.filter(hist=>{
            return uniqueVars.map( (vars)=> {
                return hist.values[vars]===row[vars];

            }).reduce((a,b)=>a*b);
        });
        //console.log("matched history record",hist_row);
        if(hist_row.length===0){
            return '';
        }
        console.log("Found one",hist_row[0]['note']);
        return hist_row[0]['note'];
    };
    getUniqueVars=(validation)=>{
        let val=this.props.validations.filter((e)=>e.validation_id===validation);
        return val[0].field_unique;
    };
    getImageMap=(validation)=>{
      let val=this.props.validations.filter((e)=>e.validation_id===validation);
      return val[0].mapping;
    };

    onCheckHandler=(row)=>{
        //console.log("Checkbox clicked",row);
        let data={};
        let val=this.props.unique_fields;
        val.forEach((v)=>{
            data[v]=row[v]
        });
        //console.log(data);
        this.props.toggleChecked(this.props.validation,data);
    };

    onChangeNotes=(row,text)=>{
        let data={};
        let val=this.props.unique_fields;

        val.forEach((v)=>{
            data[v]=this.props.issues.data[row][v]
        });
        //console.log(data);
        this.props.notesChanged(this.props.validation,data,text);
    };

    formatData=(data,schema)=>{
        return data.map((row,index)=>{
            let checked=this.checked(row,this.props.history,this.getUniqueVars(this.props.validation));
            row["__checked__"]=checked;
            row["__index__"]=index;
            row["__note__"]=this.getNote(row,this.props.history,this.getUniqueVars(this.props.validation));

            return row;
        });
    };

    createTable=()=>{

      if ( $.fn.DataTable.isDataTable( '#corrTable' ) ) {
        $('#corrTable').DataTable().destroy();
      }
      let columns=this.props.issues.schema.fields.map(f=>{
        return {"data": f.name,title:f.name}
      });
      let index_column={"data":"__index__",title:"Verified"};
      columns.unshift(index_column);


      //console.log("Columns:",columns);
      let table=$('#corrTable').DataTable({
          'dom': '<"top" lf>t<"bottom" iprB>',
          "columns":columns,
          "order": [[ 1, "asc" ]],
          //"select":'single',
          buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
          ],


        //"data":data,
        "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
        "columnDefs":[
          {"targets":0,"orderable": true,
          "className": "CustomColumn",
          "render": function(data, type, row, meta){
            if (row['__checked__']){
              return `<div><span key=${row.__index__} class="glyphicon glyphicon-pencil edit" ></span>
                            <span key=${row.__index__} style="margin-right:10px;" class="glyphicon glyphicon-picture expanded"></span>
                            <input key=${row.__index__} type='checkbox' checked class="validated"/></div>`;
            }
            return `<div>
                    <span key=${row.__index__} class="glyphicon glyphicon-pencil edit"></span>
                    <span key=${row.__index__} style="margin-right:10px;" class="glyphicon glyphicon-picture expanded"></span>
                    <input key=${row.__index__} type='checkbox' class="validated" /></div>`;
          }}
        ]
      });




        //table.show();
    };

    updateTable=()=>{
        let table=$('#corrTable').DataTable();
        let data=this.formatData(this.props.issues.data,this.props.issues.schema);
        table.clear();
        table.rows.add(data).draw();

        //add child rows
        let mapping_var=this.getImageMap(this.props.validation);
        console.log("Mapping variables",mapping_var);
        table.rows().eq(0).each(index=>{
            let row=table.row(index);
            let row_data=row.data();
            let images=this.props.images;
            //console.log("raw data",row_data);
            let matches=[];


            Object.keys(mapping_var).forEach(issue_var=>{

                let image_var=mapping_var[issue_var];
                images.forEach(e=>{
                    //console.log("Comparing",e[image_var],row_data[issue_var]);
                    if(String(e[image_var])===String(row_data[issue_var])){
                        matches.push(e);
                        //console.log("Matched",e,row_data);
                    }
                })

            });
            //console.log("All Matches",matches);


            //console.log("Filtered images:", images);

            let children = $("<div></div>");
            matches.forEach(im=>{
                let image=$(`<img style="max-width: 100%;height: auto" src=${config.bandendURL}${im.file_path} />`);
                children.append(image);
            });

            if(matches.length===0){
                children.append($(`<p style="color:red"><strong>No images available</strong></p>`));
            } else{
                $(row.node()).addClass("withImage");
            }
            if(row_data["__note__"]){
                $(row.node()).addClass("withNote");
            }

            row.child(children);





        });
        table.draw();


        table.$('.expanded').on("click",(e)=>{
            //
            let node=e.currentTarget;
            let row_index=$(node).attr("key");
            let row=table.row(row_index);
            if(row.child.isShown()){
                row.child.hide();
                //row.removeClass("shown");
            } else {
                row.child.show();
                //row.addClass("shown");
            }


        });

        table.$('.edit').on("click",(e)=>{
            //
            let node=e.currentTarget;
            let row_index=$(node).attr("key");
            let row=table.row(row_index);
            console.log("Text in row is: ",row.data());
            this.props.setModalRow(row.data());
            this.props.setNotesModal(true);


        });

        table.$('tr').on( 'click', (e)=> {

            let row = e.currentTarget;
            //find already selected rows
            table.rows({'selected':true}).deselect();
            row=table.row(row).select();


            console.log("Selected row",row);
        } );




        table.$('.validated').on("change", (e)=>{
            let row=table.row(e.currentTarget.closest('tr')).data();
            console.log("checkbox clicked", row);
            this.onCheckHandler(row);
        });
    };

    componentDidMount=()=>{
        //console.log("Component did mount");
        //this.createTable();
        //this.updateTable();


    };
    componentWillMount=()=>{
        this.props.setAllImages();
    };

    componentWillUnmount=()=>{
        //console.log("componentWillUnmount");
        if ( $.fn.DataTable.isDataTable( '#corrTable' ) ) {
            $('#corrTable').DataTable().destroy();
        }

    };

    shouldComponentUpdate=(nextProps,nextState)=>{
      //console.log("Current props",this.props.issues.data);
      //console.log("Next props",nextProps.issues.data);
      //console.log("are props equal?",this.props.issues.data ===  nextProps.issues.data);

      //return this.props.issues.data !==  nextProps.issues.data;
        return true;

    };

    componentWillReceiveProps=()=>{
        //console.log("Component will recieve props");
        //let table=$('#corrTable').DataTable();
        //table.draw();


    };
    componentDidUpdate=()=>{
        //console.log("Component did update");
        if (this.props.issues.schema.fields.length>0){
              this.createTable();
              this.updateTable();
        }


        //let rows=this.formatData(this.props.issues.data,this.props.issues.schema);

        //console.log("Table data:",this.props.issues.data);

    };







    render(){

        return(
            <div>

                <table id="corrTable" className={"table cell-border"}>


                </table>

            </div>
        );
    }
}

const mapStateToProps= state=>{
    return{
        validation: state.corrections.validation,
        validations: state.corrections.validations,
        unique_fields:state.corrections.unique_fields,
        issues: state.corrections.issues,
        history: state.corrections.history,
        images:state.images.images_all

    }
};

const mapDispatchToProps=dispatch=>{
    return {
        toggleChecked: (validation,data)=>dispatch(actions.changeHistory(validation,data)),
        notesChanged: (validation,data,text)=>dispatch(actions.notesChanged(validation,data,text)),
        setAllImages:()=>dispatch(actions.getAllImages()),
        setNotesModal: (open)=>dispatch(actions.setNotesModal(open)),
        setModalRow: (row)=>dispatch(actions.setModalRow(row))
    }
};


export default connect(mapStateToProps,mapDispatchToProps) (CorrectionTable);
