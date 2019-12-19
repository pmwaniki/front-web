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

    state={
        pagesize:10
    };

    setPagesize=(len)=>{
        this.setState({...this.state,pagesize:len});
    };



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
        //console.log("Found one",hist_row[0]['note']);
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

    onCheckHandler=(row,checked)=>{
        //console.log("Checkbox clicked",row);
        let data={};
        let val=this.props.unique_fields;
        val.forEach((v)=>{
            data[v]=row[v]
        });
        //console.log(data);
        this.props.toggleChecked(this.props.validation,data,checked);
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

    onFilterChangeVerified=(event)=>{
        this.props.setFilter({verified:event.target.value});


    };
    onFilterChangeImages=(event)=>{
        this.props.setFilter({images:event.target.value});


    };
    onFilterChangeNotes=(event)=>{
        this.props.setFilter({notes:event.target.value});


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

    destroyTable=()=>{
        if ( $.fn.DataTable.isDataTable( '#corrTable' ) ) {
            $('#corrTable').DataTable().destroy();
        }
    };

    createTable=()=>{

      this.destroyTable();
      let data=this.formatData(this.props.issues.data,this.props.issues.schema);
      let columns=this.props.issues.schema.fields.map(f=>{
        return {"data": f.name,title:f.name}
      });
      let index_column={"data":"__index__",title:"Verified"};
      columns.unshift(index_column);


      //console.log("Columns:",columns);
      let table=$('#corrTable').DataTable({
          dom: '<"top" lf>t<"bottom" iprB>',
          columns:columns,
          order: [[ 1, "asc" ]],
          //"select":'single',
          buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
          ],


        data:data,
        lengthMenu: [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
          "pageLength": this.state.pagesize,
        columnDefs:[
          {"targets":0,"orderable": true,
          //className: "CustomColumn",
          render: function(data, type, row){
              //console.log("About to render checkbox and input:",row);
            if (row['__checked__']===1){
              return `<div data-key=${row["__index__"]}><span class="glyphicon glyphicon-pencil edit" ></span>
                            <span style="margin-right:10px;" class="glyphicon glyphicon-picture expanded"></span>
                            <input  type='checkbox' checked class="validated"/></div>`;
            } else{
                return `<div data-key=${row["__index__"]}>
                    <span class="glyphicon glyphicon-pencil edit"></span>
                    <span  style="margin-right:10px;" class="glyphicon glyphicon-picture expanded"></span>
                    <input type='checkbox' class="validated" /></div>`;
            }

          }}
        ]
      }).draw();
        let mapping_var=this.getImageMap(this.props.validation);
        //console.log("Mapping variables",mapping_var);
        let images=this.props.images;
        let validation_id=this.props.validations.filter((v)=> v.validation_id===this.props.validation);
        validation_id = validation_id[0].id;
        images=images.filter(im=>im.validation===validation_id);
        //console.log("Validation id:",validation_id);

        let index_with_images=[];
        table.rows().eq(0).each(index=>{
            let row=table.row(index);
            let row_data=row.data();
            //console.log("Row index: ",index);
            //console.log("Row data: ",row_data);

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
                index_with_images.push(index);
            }
            if(row_data["__note__"]){
                $(row.node()).addClass("withNote");
            }

            row.child(children);





        });
        //console.log("Index with images:",index_with_images);
        table.draw();


        table.$('.expanded').on("click",(e)=>{
            //
            let node=e.target.parentNode;
            //console.log("Clicked on node:",node);
            let row_index=$(node).data("key");
            //console.log("Clicked on row:",row_index);
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
            let node=e.target.parentNode;
            let row_index=$(node).data("key");
            let row=table.row(row_index);
            //console.log("Text in row is: ",row.data());
            this.props.setModalRow(row.data());
            this.props.setNotesModal(true);


        });

        table.$('tr').on( 'click', (e)=> {

            let row = e.currentTarget;
            //find already selected rows

            table.rows({'selected':true}).deselect();
            row=table.row(row).select();


            //console.log("Selected row",row);
        } );




        table.$('.validated').on("change", (e)=>{
            let node=e.target.parentNode;
            let row_index=$(node).data("key");
            let row=table.row(row_index);
            let checked=e.target.checked;
            console.log("checkbox clicked:", checked);
            this.onCheckHandler(row.data(),checked);
        });



        //FILTER BY VERIFIED
        $.fn.dataTable.ext.search.push(
            (settings, datam, dataIndex) => {

                //console.log("Filter evaluating value:",settings);
                if(settings.nTable.id==="corrTable"){
                    let checked=data[dataIndex]["__checked__"];
                    if (this.props.filter.verified === "all"){
                        return true
                    } else if (this.props.filter.verified === "checked"){
                        return checked ===1 ? true: false;
                    } else if(this.props.filter.verified === "unchecked"){
                        return checked===1 ? false: true;
                    }
                } else{
                    return true;
                }

            }
        );

        //FILTER BY Note
        $.fn.dataTable.ext.search.push(
            (settings, datam, dataIndex) => {

                //console.log("Filter evaluating value:",settings);
                if(settings.nTable.id==="corrTable"){
                    let with_note=data[dataIndex]["__note__"] !=="";
                    if (this.props.filter.notes === "all"){
                        return true
                    } else if (this.props.filter.notes === "present"){
                        return with_note  ? true: false;
                    } else if(this.props.filter.notes === "absent"){
                        return with_note ? false: true;
                    }
                } else{
                    return true;
                }

            }
        );

        //FILTER BY Presence of Images
        $.fn.dataTable.ext.search.push(
            (settings, datam, dataIndex) => {


                if(settings.nTable.id==="corrTable"){
                    let index=data[dataIndex]["__index__"];
                    let with_image=index_with_images.includes(index);
                    if (this.props.filter.images === "all"){
                        return true
                    } else if (this.props.filter.images === "present"){
                        return with_image  ? true: false;
                    } else if(this.props.filter.images === "absent"){
                        return with_image ? false: true;
                    }
                } else{
                    return true;
                }

            }
        );




        //table.page.len(10).draw();
        table.draw();

        table.on( 'length.dt', ( e, settings, len )=> {
            //console.log( 'New page length: '+len );
            this.setPagesize(len);
        } );

        console.log("Table created")







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
        //return this.state.pagesize===nextState.pagesize;
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
              //this.updateTable();
        }


        //let rows=this.formatData(this.props.issues.data,this.props.issues.schema);

        //console.log("Table data:",this.props.issues.data);

    };







    render(){

        return(
            <div>
                <p>Filter</p>
                <label>Verified</label>
                <select onChange={this.onFilterChangeVerified }>
                    <option selected={this.props.filter.verified==="checked"} value="checked">Checked</option>
                    <option selected={this.props.filter.verified==="unchecked"} value="unchecked">Unchecked</option>
                    <option selected={this.props.filter.verified==="all"} value="all">All</option>
                </select>
                <br/>

                <label>Has images</label>
                <select onChange={this.onFilterChangeImages }>
                    <option selected={this.props.filter.images==="present"} value="present">Present</option>
                    <option selected={this.props.filter.images==="absent"} value="absent">Absent</option>
                    <option selected={this.props.filter.images==="all"} value="all">All</option>
                </select>

                <br/>

                <label>Has Notes</label>
                <select onChange={this.onFilterChangeNotes }>
                    <option selected={this.props.filter.notes==="present"} value="present">Present</option>
                    <option selected={this.props.filter.notes==="absent"} value="absent">Absent</option>
                    <option selected={this.props.filter.notes==="all"} value="all">All</option>
                </select>

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
        images:state.images.images_all,
        filter:state.corrections.filter,

    }
};

const mapDispatchToProps=dispatch=>{
    return {
        toggleChecked: (validation,data,checked)=>dispatch(actions.changeHistory(validation,data,checked)),
        notesChanged: (validation,data,text)=>dispatch(actions.notesChanged(validation,data,text)),
        setAllImages:()=>dispatch(actions.getAllImages()),
        setNotesModal: (open)=>dispatch(actions.setNotesModal(open)),
        setModalRow: (row)=>dispatch(actions.setModalRow(row)),
        setFilter: (filter)=>dispatch(actions.setFilter(filter))
    }
};


export default connect(mapStateToProps,mapDispatchToProps) (CorrectionTable);
