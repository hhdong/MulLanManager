/**
 * Created by code8 on 16/10/24.
 */

//
//  converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//



function DataConverter() {

    //---------------------------------------
    // PUBLIC PROPERTIES
    //---------------------------------------

    this.outputDataType         = "jsonArrayCols";


    this.inputTextArea          = {};
    this.outputTextArea         = {};

    this.inputHeader            = {};
    this.outputHeader           = {};


    this.inputText              = "";
    this.outputText             = "";

    this.newLine                = "\n";
    this.indent                 = "  ";

    this.headersProvided        = true;
    this.downcaseHeaders        = true;
    this.upcaseHeaders          = false;
    this.includeWhiteSpace      = true;
    this.useTabsForIndent       = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h) {
    var self = this;
    return self
}


DataConverter.prototype.convert = function(inputtext) {

    this.inputText = inputtext;
    this.outputText = "";


    //make sure there is input data before converting...
    if (this.inputText.length > 0) {

        if (this.includeWhiteSpace) {
            this.newLine = "\n";
            // console.log("yes")
        } else {
            this.indent = "";
            this.newLine = "";
            // console.log("no")
        }

        CSVParser.resetLog();
        var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

        var dataGrid = parseOutput.dataGrid;
        var headerNames = parseOutput.headerNames;
        var headerTypes = parseOutput.headerTypes;
        var errors = parseOutput.errors;

        this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);


        return this.outputText;
    }; //end test for existence of input text
    return "";
}



$(function(){
    initTable();
    $('#dlg').dialog('close')
})
var tabData=[];
function  handlechange(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        if (file.type=="text\/csv") {
            reader.onload = function() {
                tabData=[];
                var convert=new DataConverter().create();
                console.log(convert.convert(this.result));
                var jsondata=JSON.parse(convert.convert(this.result));
                for(var k in jsondata)
                {
                    var keys=k.split(";");
                    var arrs=jsondata[k];

                    for(var i=0;i<arrs.length;i++)
                    {
                        var valuestr=arrs[i];
                        var values=valuestr.split(";");
                        var res = {};
                        for(var j=0;j<keys.length;j++)
                        {
                            var key=keys[j];
                            if(values[j]!="")
                            {
                                res[key]=values[j];
                            }
                        }
                        tabData.push(res);
                    }


                }


                $('#dg').datagrid({
                    data: tabData
                });
            }
            reader.readAsText(file);
        }
    }
}
function initTable() {
    $('#dg').datagrid({
        rownumbers:true,
        singleSelect:true,
        pagination:true,
        onClickCell: onClickCell,
        columns:[[
            {field:'key',title:'key',width:200},
            {field:'en',title:'en',width:200},
            {field:'ch',title:'ch',width:200,align:'right'}
        ]]
    });
}
function onClickCell(index){
    editIndex = index;
    $('#dg').datagrid('selectRow', editIndex);
}
function confirm() {
    var httpHost ="http://"+location.host;
    console.log(httpHost);
    var data=   $('#dg').datagrid('getData').rows;
    var jsonstr=JSON.stringify(data)
    $.post(httpHost+"/updatelanbyarray",{jsonstr:jsonstr},function (data) {
        if(data.code=="200")
        {
            console.log(data.lans)
            var obj = document.getElementById('upload') ;
            obj.outerHTML=obj.outerHTML;
            tabData=[];
            $('#dg').datagrid({
                data: []
            });
            alert("导入成功");
        }
    });

}

function removeit() {
    if (editIndex == undefined){return}
    $('#dg').datagrid('cancelEdit', editIndex)
        .datagrid('deleteRow', editIndex);
    editIndex = undefined;
    $('#dg').datagrid('acceptChanges');
}

function editit() {
    $('#dlg').dialog('open')
    var row = $('#dg').datagrid('getSelected');
    if (row){
        var data=row;
        document.getElementById("txtKey").value=data.key;
        document.getElementById("txtEn").value=data.en;
        document.getElementById("txtCh").value=data.ch;
        $('#dlg').dialog('open')
    }
}

function addLanRes()
{
    $('#dlg').dialog('close')
    var httpHost ="http://"+location.host;
    console.log(httpHost);

    var key=document.getElementById("txtKey").value || "";
    var ch=document.getElementById("txtCh").value || "";
    var en=document.getElementById("txtEn").value || "";
    if (editIndex == undefined){return true}
    if ($('#dg').datagrid('validateRow', editIndex)){
       key
        $('#dg').datagrid('getRows')[editIndex]['key'] = key;
        $('#dg').datagrid('getRows')[editIndex]['en'] = en;
        $('#dg').datagrid('getRows')[editIndex]['ch'] = ch;
        $('#dg').datagrid('endEdit', editIndex);
        $('#dg').datagrid('acceptChanges');
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}
function onCancle()
{
    $('#dlg').dialog('close')
}
