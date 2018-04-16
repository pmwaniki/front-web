import React,{Component} from "react";


import NewImage from "../NewImage/NewImage";
import config from "../../../config";
const $ = require('jquery');
$.DataTable = require('datatables.net');



class ImageTable extends Component{

    selected_files=(uniqueId)=>{
        return this.props.records.filter(e=> e.uniqueId===uniqueId)
    };


    createTable=()=>{
      if ( $.fn.DataTable.isDataTable( '#corrTable' ) ) {
        $('#main').DataTable().destroy();
      }
      let columns=[
        {"data":"recordID",title:'Record ID'},
        {"data":"ipno","title":"Inpatient Number"}
      ];
      let table=$('#main').DataTable({
          "columns":columns,
          "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
          'columnDefs':[
              {
                  'targets':0,
                  'className':'recordID',
                  'render':function(data,type,row,meta){
                      return `<div><span key=${row.uniqueId} class="glyphicon glyphicon-expand expanded" style="margin-right: 10px;"></span>${data}</div>`
                  }

              }
          ]
      });

    };
    addData=()=>{
      let table=$('#main').DataTable();
      table.clear();
      table.rows.add(this.props.records);

      //add children nodes
      table.rows().eq(0).each(index=>{
        let row=table.row(index);
        let row_data=row.data();
        //console.log("Row data",row.data());
        let child = $('<div></div>');
        row_data.files.forEach(file=>{
          let image=$(`<img style="max-width: 100%;height: auto" src=${config.bandendURL}${file.file_path} />`);
          child.append(image);
        });
        //console.log("child appended",child.get(0));

        row.child(child);
      });
      table.draw();

      table.$('.expanded').on("click",(e)=>{
          let row_index=$(e.currentTarget);
          let row=table.row(row_index.parents("tr"));
          //console.log("row clicked",row.data());
          if(row.child.isShown()){
              row.child.hide();
              //row.removeClass("shown");
          } else {
              row.child.show();
              //row.addClass("shown");
          }
      });

      /*$('#main tbody').on("click","tr", e=>{
          console.log("Row clicked");
        let row=table.row(e.currentTarget);
        if(row.child.isShown()){
          row.child.hide();
          //row.removeClass("shown");
        } else {
          row.child.show();
          //row.addClass("shown");
        }
      });*/
    };


    componentDidMount=()=>{
      //console.log("Image component did mount");

        this.createTable();
        this.addData();


    };

    componentDidUpdate=()=>{
      //console.log("Image component did update");
      this.addData();
    };



    componentWillUnmount=()=>{
      //console.log("Image component will unmount");
        if ( $.fn.DataTable.isDataTable( '#main' ) ) {
            $('#main').DataTable().destroy();
        }


};

    shouldComponentUpdate() {
        return true;
    }




    render(){

    return(
      <div>
        <h1>{this.props.name.name}</h1>
          <div className="panel panel-danger" style={{backgroundColor:"#d0d4db"}}>
              <NewImage/>
          </div>
        <table className="table table-striped cell-border" id="main">

        </table>

      </div>
    );
  }
}



export default ImageTable;
