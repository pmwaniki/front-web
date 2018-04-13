import React , {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../store/actions/index";
import config from "../../config";
import $ from 'jquery'

//import 'datatables.net'
//import 'datatables.net-buttons'

import 'datatables.net-bs' ;
import 'datatables.net-buttons-bs' ;
import 'datatables.net-buttons/js/buttons.colVis.js' ;
import 'datatables.net-buttons/js/buttons.flash.js';
import 'datatables.net-buttons/js/buttons.html5.js' ;
import 'datatables.net-buttons/js/buttons.print.js' ;




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
    getImageMap=(validation)=>{
      let val=this.props.validations.filter((e)=>e.validation_id===validation);
      return val[0].mapping;
    };

    onCheckHandler=(row)=>{
        //console.log("Checkbox clicked",row);
        let data={};
        let val=this.props.validations.filter((e)=>e.validation_id===this.props.validation);
        val=val[0]['field_unique'];
        val.forEach((v)=>{
            data[v]=this.props.issues.data[row][v]
        });
        //console.log(data);
        this.props.toggleChecked(this.props.validation,data);
    };

    formatData=(data,schema)=>{
        return data.map((row,index)=>{
            let checked=this.checked(row,this.props.history,this.getUniqueVars(this.props.validation));
            row["__checked__"]=checked;
            row["__index__"]=index;

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
          buttons: [
              'copy', 'csv', 'excel', 'pdf', 'print'
          ],


        //"data":data,
        "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
        "columnDefs":[
          {"targets":0,

          "className": "validated",
          "render": function(data, type, row, meta){
            if (row['__checked__']){
              return `<div><span key=${row.__index__} style="margin-right:10px;" class="glyphicon glyphicon-expand expanded"></span><input key=${row.__index__} type='checkbox' checked /></div>`;
            }
            return `<div><span key=${row.__index__} style="margin-right:10px;" class="glyphicon glyphicon-expand expanded"></span><input key=${row.__index__} type='checkbox'  /></div>`;
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


            /*Object.keys(mapping_var).map(issue_var=>{
                let images_var=mapping_var[issue_var];
                images=images.filter(e=> {
                    //console.log("comparing",e[images_var],"and",row_data[issue_var]);

                    return e[images_var]===row_data[issue_var]});
                //console.log("val",images_var,issue_var);
            });*/

            //console.log("Filtered images:", images);

            let children = $("<div></div>");
            matches.forEach(im=>{
                let image=$(`<img className="img-fluid" src=${config.bandendURL}${im.file_path} />`);
                children.append(image);
            });

            if(matches.length===0){
                children.append($(`<p style="color:red"><strong>No images available</strong></p>`));
            }

            row.child(children);



        });
        table.draw();

        /*$('#corrTable tbody').on("click","tr", e=>{
            let row=table.row(e.currentTarget);
            if(row.child.isShown()){
                row.child.hide();
                //row.removeClass("shown");
            } else {
                row.child.show();
                //row.addClass("shown");
            }
        });*/
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



        table.$('.validated').on("change", (e)=>{
            let index=table.cell(e.currentTarget).data();
            //console.log("checkbox clicked", index);
            this.onCheckHandler(index);
        });
    };

    componentDidMount=()=>{
        //console.log("Component did mount");
        //this.createTable();
        //this.updateTable();


    };
    componentWillMount=()=>{
        this.props.setAllImages();
    }

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

      return this.props.issues.data !==  nextProps.issues.data;

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
                <table id="corrTable" className={"table table-striped cell-border"}>


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
        history: state.corrections.history,
        images:state.images.images_all

    }
};

const mapDispatchToProps=dispatch=>{
    return {
        toggleChecked: (validation,data)=>dispatch(actions.changeHistory(validation,data)),
        setAllImages:()=>dispatch(actions.getAllImages())
    }
};


export default connect(mapStateToProps,mapDispatchToProps) (CorrectionTable);
