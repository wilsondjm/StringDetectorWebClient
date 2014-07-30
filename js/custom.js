/**
 * Created by t_yuejial on 4/28/2014.
 */
// DO NOT REMOVE : GLOBAL FUNCTIONS!
// gloable varaiable
// datatables  object
var  jobsObjTable;
var  historyObjTable;
// data transfered object
var  jobsDto;
var  historyDto;

var modeEnum={small:0,middle:1,large:2}
var mode=modeEnum.large;

// data map
var  jobsMap={};
var  configurationsMap={};
var  jobSettingMap={};
var  jobReportMap={};
var  timersMap={};



// jenkins ballcolor  map
var buildStatusMap ={"Failed":completed,
                    "InProgress":running,
                     "Unstable":completed,
                     "Success":completed,
                     "Pending":completed,
                     "Disabled":completed,
                     "Aborted":completed,
                     "NotBuilt":created
}

// regist action listener
function registJobFormListener(jobName){
    // project basic seeting
    $(document).delegate(editProjectBasicIcon+jobName,'click',editProjectBasicClick);
    $(document).delegate(saveProjectBasicIcon+jobName,'click',saveProjectBasicClick);
    $(document).delegate(editScmIcon+jobName,'click',editProjectScmClick);
    $(document).delegate(saveScmIcon+jobName,'click',saveProjectScmClick);
//  // project config
    $(document).delegate(editProjectConfigIcon+jobName,'click',editProjectConfigClick);
    $(document).delegate(saveProjectConfigIcon+jobName,'click',saveProjectConfigClick);
    $(document).delegate(uploadProjectConfigIcon+jobName,'click',uploadProjectConfigClick);
    $(document).delegate(projectConfigFile+jobName,'change',changeProjectConfigClick);
//
//  // project report
    $(document).delegate(downloadProjectReprotIcon+jobName,'click',downloadProjectReportClick);
    $(document).delegate(popoutProjectReprotIcon+jobName,'click',popoutProjectReportClick);


    //job  action
    $(document).delegate(jobStart+jobName,'click',jobStartClick);
    $(document).delegate(jobStop+jobName,'click',jobStopClick);
    $(document).delegate(jobDelete+jobName,'click',jobDeleteClick);
    $(document).delegate(actionStart+jobName,'click',jobStartClick);
    $(document).delegate(actionStop+jobName,'click',jobStopClick);
    $(document).delegate(actionDelete+jobName,'click',jobDeleteClick);

    $(document).delegate(jobToolBar+jobName,'show',function(){
       // alert("change");
    })


}

function registBuildHistoryFormListener(jobName){
   /* $(document).delegate(historyTable+jobName +" tr ",'click',viewBiuldReportClick);*/
    // do not need the listener for anchor ,the click of anchor will trigger the td click listener
    $(document).delegate(historyTable+jobName +" tr td a",'click',viewBiuldReportClick);
    $(document).delegate(downloadBuildReportIcon,'click',downloadBuildViewReportClick);
    $(document).delegate(popoutBuildReportIcon,'click',popoutBuildViewReportClick);


}

function registeJobFormValidationListener(jobName){
    $(basicSettingForm+jobName).validate({
        rules: {
            jobName : {
                required :true
            },
            timing : {
                required :true,
                checkTiming:true
            }
        } ,
        submitHandler: function(form) {
            //createJobValidateCallBack();
            saveProjectBasicCallback(jobName);
        }
        ,
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
            element
                .addClass('valid')
                .addClass('background_none')
                .closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    });

    $(scmSettingForm+jobName).validate({
        rules: {
             p4Username : {
             required :true
             },
             p4Password : {
             required :true
             },
             p4Port : {
             required :true
             },
             p4WorkspaceName : {
             required :true
             },
             p4Viewmap : {
             required :true
             }
        } ,
        submitHandler: function(form) {
            saveProjectScmCallback(jobName);
        }
        ,
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
            element
                .addClass('valid')
                .addClass('background_none')
                .closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    });
}


// project basic setting
function editProjectBasicClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];

    // toggle the edit-save icon
    $(editProjectBasicIcon+jobName).hide();
    $(saveProjectBasicIcon+jobName).show();

   // change to edit mode
    $(basicSettingForm+jobName).removeClass("custom-form").addClass("custom-form-edit");
   // $(jobNameInput+jobName).prop("readonly",false);
    $(jobNameInput+jobName).addClass("uneditable");
    $(timingInput+jobName).prop("readonly",false);
    $(timingInput+jobName).removeClass("no-border");


}
function saveProjectBasicClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    $(basicSettingForm+jobName).submit();
}


function saveProjectBasicCallback(jobName){

    // paste the exsisting content into input filed
    var projectName=$(jobNameInput+jobName).val();
    var timing =$(timingInput+jobName).val();
    var p4Username =$(p4UsernameInput+jobName).val();
    var p4Password =$(p4PasswordInput+jobName).val();
    var p4Port =$(p4PortInput+jobName).val();
    var p4Workspace =$(p4WorkspaceNameInput+jobName).val();
    var p4Viewmap =$(p4ViewmapInput+jobName).val();

    // use ajax to put the change and update the jobsmap and jobsObjTable Data in success callback
    var putData={};
    putData["JobName"]=projectName;
    putData["buildPeriody"]=timing;
    putData["SCMPort"]=p4Port;
    putData["UserName"]=p4Username;
    putData["Passoword"]=p4Password;
    putData["Workspace"]=p4Workspace;
    putData["ViewMap"]=p4Viewmap;

    $.ajax({
        type : "put",
        cache: false,
        url: "../api/jobs/" + jobName,
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
    // the current api didn't return correct data to transfer the state
            // for the reason that the put operation didn't change the job name we don't need to update jobMap
            //update the settingMap
            var settings = jobSettingMap[jobName];
            settings.JobName=projectName;
            settings.buildPeriody=timing;
            settings.SCMPort = p4Port;
            settings.UserName=p4Username;
            settings.Passoword=p4Password;
            settings.Workspace=p4Workspace;
            settings.ViewMap=p4Viewmap;

            // toggle the edit-save icon
            $(editProjectBasicIcon+jobName).show();
            $(saveProjectBasicIcon+jobName).hide();

           /* var aData = jobsDto.fnGetData(nTr);
            aData=transferToJobRecord(jobsMap[jobName]);
            oTable.fnUpdate(aData,nTr);*/

            // change to view mode
            $(basicSettingForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            //  $(jobNameInput+jobName).prop("readonly",true);
              $(jobNameInput+jobName).removeClass("uneditable");
            $(timingInput+jobName).prop("readonly",true);
            $(timingInput+jobName).addClass("no-border");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        },
        complete: function(){
            var settings = jobSettingMap[jobName];
            settings.JobName=projectName;
            settings.buildPeriody=timing;
            settings.SCMPort = p4Port;
            settings.UserName=p4Username;
            settings.Passoword=p4Password;
            settings.Workspace=p4Workspace;
            settings.ViewMap=p4Viewmap;

            // toggle the edit-save icon
            $(editProjectBasicIcon+jobName).show();
            $(saveProjectBasicIcon+jobName).hide();

            // change to view mode
            $(basicSettingForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            //  $(jobNameInput+jobName).prop("readonly",true);
            $(jobNameInput+jobName).removeClass("uneditable");
            $(timingInput+jobName).prop("readonly",true);
            $(timingInput+jobName).addClass("no-border");
        }
    });

}
function editProjectScmClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    // toggle the edit-save icon
    $(editScmIcon+jobName).hide();
    $(saveScmIcon+jobName).show();
    // change to edit mode
    $(scmSettingForm+jobName).removeClass("custom-form").addClass("custom-form-edit");
    $(p4UsernameInput+jobName).prop("readonly",false).removeClass("no-border");
    $(p4PasswordInput+jobName).prop("readonly",false).removeClass("no-border");
    $(p4PortInput+jobName).prop("readonly",false).removeClass("no-border");
    $(p4WorkspaceNameInput+jobName).prop("readonly",false).removeClass("no-border");
    $(p4ViewmapInput+jobName).prop("readonly",false).removeClass("no-border");

}

function saveProjectScmClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    $(scmSettingForm+jobName).submit();
}

function saveProjectScmCallback(jobName){
    // paste the exsisting content into input filed
    var projectName=$(jobNameInput+jobName).val();
    var timing =$(timingInput+jobName).val();
    var p4Username =$(p4UsernameInput+jobName).val();
    var p4Password =$(p4PasswordInput+jobName).val();
    var p4Port =$(p4PortInput+jobName).val();
    var p4Workspace =$(p4WorkspaceNameInput+jobName).val();
    var p4Viewmap =$(p4ViewmapInput+jobName).val();

    // use ajax to put the change and update the jobsmap and jobsObjTable Data in success callback
    var putData={};
    putData["JobName"]=projectName;
    putData["buildPeriody"]=timing;
    putData["SCMPort"]=p4Port;
    putData["UserName"]=p4Username;
    putData["Passoword"]=p4Password;
    putData["Workspace"]=p4Workspace;
    putData["ViewMap"]=p4Viewmap;

    $.ajax({
        type : "put",
        cache: false,
        url: "../api/jobs/" + jobName,
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // the current api didn't return correct data to transfer the state
            // for the reason that the put operation didn't change the job name we don't need to update jobMap
            //update the settingMap
            var settings = jobSettingMap[jobName];
            settings.JobName=projectName;
            settings.buildPeriody=timing;
            settings.SCMPort = p4Port;
            settings.UserName=p4Username;
            settings.Passoword=p4Password;
            settings.Workspace=p4Workspace;
            settings.ViewMap=p4Viewmap;


            // toggle the edit-save icon
            $(editProjectBasicIcon+jobName).show();
            $(saveProjectBasicIcon+jobName).hide();

            /* var aData = jobsDto.fnGetData(nTr);
             aData=transferToJobRecord(jobsMap[jobName]);
             oTable.fnUpdate(aData,nTr);*/

            // change to view mode
            $(scmSettingForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            $(p4UsernameInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4PasswordInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4PortInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4WorkspaceNameInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4ViewmapInput+jobName).prop("readonly",true).addClass("no-border");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        },
        complete: function(){
            var settings = jobSettingMap[jobName];
            settings.JobName=projectName;
            settings.buildPeriody=timing;
            settings.SCMPort = p4Port;
            settings.UserName=p4Username;
            settings.Passoword=p4Password;
            settings.Workspace=p4Workspace;
            settings.ViewMap=p4Viewmap;

            // toggle the edit-save icon
            $(editScmIcon+jobName).show();
            $(saveScmIcon+jobName).hide();
            // change to view mode
            $(scmSettingForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            $(p4UsernameInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4PasswordInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4PortInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4WorkspaceNameInput+jobName).prop("readonly",true).addClass("no-border");
            $(p4ViewmapInput+jobName).prop("readonly",true).addClass("no-border");
        }
    });
}

// project configuration
function editProjectConfigClick(){
	var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    // toggle the edit-save icon
    $( editProjectConfigIcon+jobName).hide();
    $(saveProjectConfigIcon+jobName).show();
    // toggle the edit-view state
    $(projectConfigForm+jobName).removeClass("custom-form").addClass("custom-form-edit");
    $(projectConfigInput+jobName).prop('readonly',false).removeClass("no-border");
    $(projectConfigInput+jobName).focus();
}
function saveProjectConfigClick(){
	var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = jobsObjTable.$('tr.custom-selected')[0];


    // paste the exsisting content into input filed
    var configContent=$(projectConfigInput+jobName).val();
    var putData={};
    putData["jobName"]=jobName;
    putData["configuration"]=configContent;
    $.ajax({
        type : "put",
        cache: false,
        url: "../api/Configuration/" + jobName,
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // update jobs map
//          jobsMap[jobNumber].Configuration = data;
//          var jobConfig =data;
            // toggle the edit-view state

            // update jobs configuration map
            configurationsMap[jobName]=configContent;
            $(projectConfigForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            $(projectConfigInput+jobName).prop('readonly',"true").addClass("no-border");

            // toggle the edit-save icon
            $(editProjectConfigIcon+jobName).show();
            $(saveProjectConfigIcon+jobName).hide();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        },
        complete: function(){
            configurationsMap[jobName]=configContent;
            $(projectConfigForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            $(projectConfigInput+jobName).prop('readonly',"true").addClass("no-border");
            // toggle the edit-save icon
            $(editProjectConfigIcon+jobName).show();
            $(saveProjectConfigIcon+jobName).hide();
        }
    });

}
function uploadProjectConfigClick(){
	var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = jobsObjTable.$('tr.custom-selected')[0];
    $(editProjectConfigIcon+jobName).trigger("click");
    $(projectConfigFile+jobName).trigger("click");
}
function changeProjectConfigClick(event){
	var fileChoose = $(this);
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e){
            var contents = e.target.result;
            fileChoose.prev().val(contents);
        }
        reader.readAsText(file);
    } else {
        alert('The File APIs are not fully supported by your browser.');
    }
}

// project report
function downloadProjectReportClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    //download(jobName+"_latest_report.txt",$(projectReportInput+jobName).html());
    $.fileDownload("../api/jobs/"+jobName+"/Report/file/lastBuild", {
        successCallback: function (url) {

        },
        failCallback: function (responseHtml, url) {

            alert("The report is empty");
        }
    });
}

function downloadBuildViewReportClick(){
    var jobName = $(this).attr("data-job-name");
    var buildNumber =  $(this).attr("data-build-number");

    $.fileDownload("../api/jobs/"+jobName+"/Report/file/"+buildNumber, {
        successCallback: function (url) {

        },
        failCallback: function (responseHtml, url) {

            alert("The report is empty");
        }
    });
}


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}


function popoutProjectReportClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    alert("popout "+jobName+" lastBuild");
}
function popoutBuildViewReportClick(){
    var jobName = $(this).attr("data-job-name");
    var buildNumber =  $(this).attr("data-build-number");
    alert("popout "+jobName+" #"+buildNumber);
}

function viewPrevBuildClick() {
    if($(this).hasClass("active")){
        return;
    }

    var jobName=$(buildViewInfo).attr("data-job-name");
    // when the string "0" +1  the result is "01", the "0"++ the result is 0
    var rowIndex = parseInt($(buildViewInfo).attr("data-index"),10);
    var totalNum=$(buildViewInfo).attr("data-totalNum");
    var historyRecord = historyObjTable.fnGetData();
    rowIndex++;
    var buildNumber = historyRecord[rowIndex][4];

    updateBuildView(buildNumber,jobName,rowIndex,totalNum);
}

function viewNextBuildClick() {
    if($(this).hasClass("active")){
        return;
    }
    var jobName=$(buildViewInfo).attr("data-job-name");
    var rowIndex = parseInt($(buildViewInfo).attr("data-index"),10);
    var totalNum=$(buildViewInfo).attr("data-totalNum");
    var historyRecord = historyObjTable.fnGetData();
    rowIndex--;
    var buildNumber = historyRecord[rowIndex][4];

    updateBuildView(buildNumber,jobName,rowIndex,totalNum);
}

function returnBuildListClick(){
    var jobName= $(this).attr("data-job-name");
    $(buildViewFooter).hide();
    $(historyTable+jobName+"_wrapper").css('display','');
    $(buildViewBody).hide();
    historyObjTable.fnAdjustColumnSizing();
}

// multiple job selection for start action
function batchJobStartClick(){
    $("input:checked", jobsObjTable.fnGetNodes()).each(function(){

        var jobName = $(this).attr("data-name");
        // check job current state
        if(jobsMap[jobName].lastBuildStatus==running){
            return ;
        }
        var nTrObject=$(this).parents("tr");
        var nTr = nTrObject[0];
        // start the job
        $.ajax({
            type : "post",
            cache: false,
            url: "../api/jobs/" + jobName + "/start",
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
                var job= jobsMap[jobName];
                job.lastBuildStatus=running;
                var aData=transferToJobRecord(jobsMap[jobName]);
                $(jobStart+jobName).addClass("active");
                $(jobStop+jobName).removeClass("active");
                /* Open this row */
                jobName = aData[1];
                nTrObject.click();
                $(step4Head).click();
                $(projectReportInput+jobName).text("");
                // trigger refreshing
                timersMap[jobName].play();

                // we shall update the table at last ,the fnUpdate will trigger the current filter
                jobsObjTable.fnUpdate(aData,nTr);
                $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
                updateCategory();

            },
            error : function(XMLHttpRequest,
                             textStatus, errorThrown) {
                $(jobStart+jobName).removeClass("active");
            }

        });
    });
}

// action listener of job action
function jobStartClick(){

   // alert("start")
     if(  $(this).hasClass("active")){
          return;
     }
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];

    // check job current state
    if(jobsMap[jobName].lastBuildStatus==running){
        return ;
    }

    var nTrObject=$(this).parents("tr");
    // judge the event source
    if(mode==modeEnum.middle){
        nTrObject = $(jobToolBar+jobName).parents("tr");
    }

    var nTr = nTrObject[0];

    // start the job
    $.ajax({
        type : "post",
        cache: false,
        url: "../api/jobs/" + jobName + "/start",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
            var job= jobsMap[jobName];
            job.lastBuildStatus=running;
            var aData=transferToJobRecord(jobsMap[jobName]);
            $(jobStart+jobName).addClass("active");
            $(jobStop+jobName).removeClass("active");
            // Open this row
            jobName = aData[1];
            nTrObject.click();
            $(step4Head).click();
            $(projectReportInput+jobName).text("");
            // trigger refreshing
            timersMap[jobName].play();

            // we shall update the table at last ,the fnUpdate will trigger the current filter
            jobsObjTable.fnUpdate(aData,nTr);
            $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
            updateCategory();

        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobName).removeClass("active");
        }

    });

     // judge the event source
     if($(this).attr("id").split('-')[0]=="action"){
         $(this).parent().parent().hide();
         $(jobToolBar+jobName).removeClass("pressed");
     }


}

// multiple job selection for stop action
function batchJobStopClick(){
    $("input:checked", jobsObjTable.fnGetNodes()).each(function(){
        var jobName = $(this).attr("data-name");
        // check job current state
        if(jobsMap[jobName].lastBuildStatus!=running){
            return ;
        }
        var nTrObject=$(this).parents("tr");
        var nTr = nTrObject[0];
        $.ajax({
            type : "delete",
            cache: false,
            url: "../api/jobs/" + jobName + "/stop",
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
                //alert("Job - " + jobName + " stop request accepted");
                $(jobStart+jobName).removeClass("active");
                $(jobStop+jobName).addClass("active");
                timersMap[jobName].stop();
                $.ajax({
                    type : "get",
                    cache: false,
                    url: "../api/jobs/" + jobName+"/status",
                    cache :false,
                    success : function(data) {
                        var jobStatusDto=data;
                        // get last build color through ajax and update the status
                        jobsMap[jobName].lastBuildColor = jobStatusDto.Color;
                        jobsMap[jobName].lastBuildStatus = completed;

                        // we shall update the table at last ,the fnUpdate will trigger the current filter
                        var tableData=jobsObjTable.fnGetData();
                        var index=0;
                        for(var i=0;i<tableData.length;i++){
                            if(tableData[i][1]==jobName){
                                index=i;
                                break;
                            }
                        }
                        var aData=transferToJobRecord(jobsMap[jobName]);
                        jobsObjTable.fnUpdate(aData,index);
                        $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
                        updateCategory();

                    },
                    error : function(XMLHttpRequest,
                                     textStatus, errorThrown) {

                    }
                });
            },
            error : function(XMLHttpRequest,
                             textStatus, errorThrown) {
                $(jobStart+jobName).removeClass("active");
            }
        });
    });
}

function jobStopClick(){
    //alert("stop");
    if(  $(this).hasClass("active")){
        return;
    }
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    var nTrObject=$(this).parents("tr");
    if(mode==modeEnum.middle){
        nTrObject = $(jobToolBar+jobName).parents("tr");
    }
    var nTr=nTrObject[0];
    
    $.ajax({
        type : "delete",
        cache: false,
        url: "../api/jobs/" + jobName + "/stop",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
        	//alert("Job - " + jobName + " stop request accepted");
            $(jobStart+jobName).removeClass("active");
            $(jobStop+jobName).addClass("active");
            timersMap[jobName].stop();
            $.ajax({
                type : "get",
                cache: false,
                url: "../api/jobs/" + jobName+"/status",
                cache :false,
                success : function(data) {
                    var jobStatusDto=data;
                    // get last build color through ajax and update the status
                    jobsMap[jobName].lastBuildColor = jobStatusDto.Color;
                    jobsMap[jobName].lastBuildStatus = completed;

                    // we shall update the table at last ,the fnUpdate will trigger the current filter
                    var tableData=jobsObjTable.fnGetData();
                    var index=0;
                    for(var i=0;i<tableData.length;i++){
                        if(tableData[i][1]==jobName){
                            index=i;
                            break;
                        }
                    }
                    var aData=transferToJobRecord(jobsMap[jobName]);
                    jobsObjTable.fnUpdate(aData,index);
                    $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
                    updateCategory();


                },
                error : function(XMLHttpRequest,
                                 textStatus, errorThrown) {

                }
            });
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobName).removeClass("active");
        }
    });
    // judge the event source
    if($(this).attr("id").split('-')[0]=="action"){
        $(this).parent().parent().hide();
        $(jobToolBar+jobName).removeClass("pressed");
    }
}

// multiple job selection  for delete action
function batchJobDeleteClick(){
    $("input:checked", jobsObjTable.fnGetNodes()).each(function(){
        var jobName = $(this).attr("data-name");
        var nTrObject=$(this).parents("tr");
        var nTr = nTrObject[0];
        var aPos = jobsObjTable.fnGetPosition(nTr);
        $.ajax({
            type : "delete",
            cache: false,
            url: "../api/jobs/" + jobName,
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
                jobsObjTable.fnDeleteRow(aPos);
                updateCategory();
            },
            error : function(XMLHttpRequest,
                             textStatus, errorThrown) {
                alert("Deleted Failed");
            }
        });
    });
}

function jobDeleteClick(){
   // alert("delete");
    if(  $(this).hasClass("active")){
        return;
    }
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    var nTrObject=$(this).parents("tr");
    if(mode==modeEnum.middle){
        nTrObject = $(jobToolBar+jobName).parents("tr");
    }
    var nTr=nTrObject[0];
    var aPos = jobsObjTable.fnGetPosition(nTr);
    $.ajax({
        type : "delete",
        cache: false,
        url: "../api/jobs/" + jobName,
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
           jobsObjTable.fnDeleteRow(aPos);
            updateCategory();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            alert("Deleted Failed");
        }
    });
    // judge the event source
    if($(this).attr("id").split('-')[0]=="action"){
        $(this).parent().parent().hide();
        $(jobToolBar+jobName).removeClass("pressed");
    }
}

// load specific build report
function viewBiuldReportClick(){

    var buildNumber = $(this).attr("data-build-number");
    var jobName= $(this).attr("data-job-name");
    var rowIndex = historyObjTable.fnGetPosition( $(this).closest('tr')[0] );
    var totalNum = historyObjTable.fnGetData().length;
    $(buildViewFooter).show();
    $(historyTable+jobName+"_wrapper").hide();
    $(buildViewBody).show();
    updateBuildView(buildNumber,jobName,rowIndex,totalNum);
  /*  $()*/

}


// new job button click
function createJobClick() {
    $(createJobModal).modal('show');
}

// cancel button in create job form
function createJobCancelClick(){
    $(createJobModal).modal('hide');
}

// submit button in create job form
function createJobSubmitClick(){
     $(createJobForm).submit();
}

function createJobValidateCallBack(){
    var jobData = {};
    jobData["JobName"]      = $(jobName).val();
    jobData["buildPeriody"] = $(timing).val();
    jobData["SCMPort"]      = $(p4Port).val();
    jobData["UserName"]     = $(p4Username).val();
    jobData["Passoword"]	= $(p4Password).val();
    jobData["Workspace"]	= $(p4WrokspaceName).val();
    jobData["ViewMap"]		= $(p4Viewmap).val();
    jobData["Configuration"]= "To Be Defined";

    var requestURL = "../api/jobs/" + jobData["JobName"];
    var reqData = JSON.stringify(jobData);
    $.ajax({
        type : "post",
        cache: false,
        url: requestURL,
        contentType: "application/json",
        data : reqData,
        success : function(data, textStatus, request) {
            $(createJobModal).modal('hide');
            location.reload(true);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            var status = textStatus;
        },
        complete:function(){
            location.reload(true);
        }
    });
}



//for datatables
function transferToJobRecord(job){
    var actionToolBarStr ='<div class="btn-group action" data-toggle="buttons"> <button ' +
        ' id="job-toolbar'+seperator+job.jobName+'" data-toggle="tooltip" title="" type="button" class="btn btn-default btn-xs action" data-original-title="Action"><i class="fa fa-gear"></i></button>'+
        '</div>';
    var toolOptionStr ='<div class="hide"><div ' +
        'id="job-toolbar-options'+seperator+job.jobName+'"><a href="javascript:void(0)" ' +
        'id="action-start'+seperator+job.jobName+'"><i class="fa fa-play"></i></a><a href="javascript:void(0)"' +
        'id="action-stop'+seperator+job.jobName+'"><i class="fa fa-stop"></i></a><a href="javascript:void(0)"' +
        'id="action-delete'+seperator+job.jobName+'"><i class="fa fa-trash-o"></i></a></div></div> ';
    var actionStr;
    var state =job.lastBuildStatus;
    var checkBoxStr ='<div class="checkbox "><label><input type="checkbox" class="checkbox style-2" data-name="'+job.jobName+'"><span></span> </label></div>';

    var actionStr1 = '<div class="btn-group action" data-toggle="buttons">' +
                        '<label title="Start Job" class="btn btn-default btn-xs action ' ;
      //  ' active'
    var actionStr2=     '" id="job-start'+seperator+job.jobName+'" ><input type="radio" name="style-a1" id="style-a1"> ' +
                                     '<i class="fa fa-play action"></i>' +
                        '</label>' +
                     '<label title="Stop Job" class="btn btn-default btn-xs action ' ;
//      'active'
   var actionStr3=     '" id="job-stop'+seperator+job.jobName+'" ><input type="radio" name="style-a2" id="style-a2"> ' +
                                  '<i class="fa fa-stop action"></i>' +
                       '</label>' +
                         '<label title="Delete Job" class="btn btn-default btn-xs action ' ;
     //   'active'
     var actionStr4=     '" id="job-delete'+seperator+job.jobName+'" ><input type="radio" name="style-a2" id="style-a3">' +
                                 ' <i class="fa fa-trash-o action"></i>' +
                         '</label>' +
                     '</div>';
      if(!(state==created || state == completed)) {
          actionStr = actionStr1+
          'active'+
          actionStr2+
          actionStr3+
          actionStr4;
          // do something such as refresh  report
      }
      else {
          actionStr = actionStr1+
          actionStr2+
          'active'+
          actionStr3+
          actionStr4;
          // do something such as stop refreshing
      }

    var record = [];
    record.push(checkBoxStr);
    record.push(job.jobName);
    record.push(job.lastBuildColor);
    record.push(state);
    record.push(actionStr);
    record.push(actionToolBarStr+toolOptionStr);
    $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
    return record;
}

//for datatables
function transferToBuildRecord(build,jobName){
    var buildNumber =build.number;
    var displayName = build.fullDisplayName;
    var timeStr = build.id;
    var buildTime= timeStr.split('_')[0].concat(" ").concat(timeStr.split('_')[1].split('-').join(":"));
    var duration  = build.duration+"s";
    var result = build.result;

    var  displayNameLink='<a href="javascript:void(0)" data-build-number="'+buildNumber+'" data-job-name="'+jobName+'">'+displayName+'</a>';
    var record = [];
  /*  record.push(buildNumber);*/
    record.push(displayNameLink);
    record.push(buildTime);
    record.push(duration);
    record.push(result);
    record.push(buildNumber);
    return record;
}

function startContinusRefreshing(jobName){
    // alert("This message is  sent by  timer-"+jobNumber);
   refreshProject(jobName, 0);
}

function refreshProject(jobName, offset){
	
	var requestUrl = "../api/jobs/" + jobName + "/Report/lastBuild?offset=" + offset;
	$.ajax({
		type:"get",
		url:requestUrl,
		async:true,
		cache :false,
		success: function(JobReportData){
			var isCompleted = JobReportData.Completed;
			if( isCompleted == "True"){
                UpdateProjectDisplayData(jobName, JobReportData.Report, true);
                //$(refreshProjectReportIcon+JobReportData.jobName+" a i").removeClass("fa-spin");
                timersMap[jobName].stop();
                $(jobStart+jobName).removeClass("active");
                $(jobStop+jobName).addClass("active");

                $.ajax({
                    type : "get",
                    cache: false,
                    url: "../api/jobs/" + jobName+"/status",
                    cache :false,
                    success : function(data) {
                        var jobStatusDto=data;
                        // get last build color through ajax and update the status
                        jobsMap[jobName].lastBuildColor = jobStatusDto.Color;
                        jobsMap[jobName].lastBuildStatus = completed;

                        // we shall update the table at last ,the fnUpdate will trigger the current filter
                        var tableData=jobsObjTable.fnGetData();
                        var index=0;
                        for(var i=0;i<tableData.length;i++){
                            if(tableData[i][1]==jobName){
                                index=i;
                                break;
                            }
                        }
                        var aData=transferToJobRecord(jobsMap[jobName]);
                        jobsObjTable.fnUpdate(aData,index);
                        $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
                        updateCategory();


                    },
                    error : function(XMLHttpRequest,
                                     textStatus, errorThrown) {

                    }
                });

                //update current show job detail hisory
                var splitArray=$(jobTablePanel+" .tab-content .tab-pane:first ").attr("id").split(seperator);
                var showName=splitArray[splitArray.length-1];
                if(jobName==showName){
                    historyObjTable.fnClearTable();
                    historyObjTable.fnDraw();
                    $.ajax({
                        type : "get",
                        cache: false,
                        url: "../api/Jobs/"+jobName+"/History" ,
                        cache :false,
                        success : function(data) {
                            var historyResult=data;
                            var historyDto = historyResult["jobHistories"];
                            var historyRecord=[];

                            $.each(historyDto,function(i,build){
                                historyRecord.push(transferToBuildRecord(build,jobName));
                            });
                            historyObjTable.fnAddData(historyRecord);
                        },
                        error : function(XMLHttpRequest,
                                         textStatus, errorThrown) {
                            configurationsMap[jobName] = null;
                        }
                    });
                }

			}else{
				UpdateProjectDisplayData(jobName, JobReportData.Report, false);
			}
		},
		error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
                         	//
        }
	});
}

function UpdateProjectDisplayData(jobName, report, completed){
	
    var reportContent =report;
    if($(projectReportInput+jobName).length==0){
        return;
    }
    $(projectReportInput+jobName).text(reportContent);
    $(projectReportInput+jobName).animate({
            scrollTop:$(projectReportInput+jobName)[0].scrollHeight - $(projectReportInput+jobName).height()
        },2000,function(){
        // alert("done");
    }
    );
}

function loadConfigurations(jobName)
{
	$.ajax({
        type : "get",
        cache: false,
        url: "../api/Configuration/" + jobName,
        cache :false,
        success : function(data) {
            var jobConfig=data;
            configurationsMap[jobName] = jobConfig.configuration;
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            configurationsMap[jobName] = "";          	//
        },
        complete : function(){

        }
    });


}

function loadJobSetting(jobName){
    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs/" + jobName,
        cache :false,
        success : function(data) {
            var jobSetting=data;
            jobSettingMap[jobName] = jobSetting;
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            jobSettingMap[jobName] = {"JobName":jobName,"buildPeriody":"","SCMPort":"","UserName":"","Passoword":"","ViewMap":"","Workspace":""};
        },
        complete: function(){

        }
    });

}

function loadJobReport(jobName){
    if(jobsMap[jobName].lastBuildStatus==created){
        jobReportMap[jobName] = {"Report":""};
        return
    }
    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs/" + jobName+"/Report/lastBuild",
        cache :false,
        success : function(data) {
            var jobReport=data;
            jobReportMap[jobName] = jobReport;
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            jobReportMap[jobName] = {"Report":""};
        },
        complete: function(){

        }
    });

}


function getRowIndexByContent(content,columnIndex){
    var data=jobsObjTable.fnGetData();
    $.each(data,function(i,item){
        if(item[columnIndex]==content){
            return i;
        }
    });
    return -1;
}


// update category count number
function updateCategory(){
    // category item numbers
    var totalJobsNum;
    var createdJobsNum=0;
    var runningJobsNum=0;
    var completedJobsNum=0;
    var data=jobsObjTable.fnGetData();
    //compute the all categories jobs num

    totalJobsNum=data.length;
    $.each(data,function(i,item){
        switch (item[3]){
            case created:
                createdJobsNum++;
                break;
            case running:
                runningJobsNum++;
                break;
            case completed :
                completedJobsNum++;
                break;
        }
    })

    // update the category numbers
    $(categoryAll).find("span").html(totalJobsNum);
    $(categoryCreated).find("span").html(createdJobsNum);
    $(categoryRunning).find("span").html(runningJobsNum);
    $(categoryCompleted).find("span").html(completedJobsNum);
}

function categoryAllClick(){
    $(categoryCreated).removeClass('active');
    $(categoryRunning).removeClass('active');
    $(categoryCompleted).removeClass('active');
    $(categoryAll).addClass('active');
    jobsObjTable.fnFilter("",3);
    jobsObjTable.fnFilter("");


}

function categoryCreatedClick(){
    $(categoryAll).removeClass('active');
    $(categoryRunning).removeClass('active');
    $(categoryCompleted).removeClass('active');
    $(categoryCreated).addClass('active');

    var oSettings = jobsObjTable.fnSettings();
    jobsObjTable.fnFilter("",3,true);
    jobsObjTable.fnFilter(created,3,true);
}
function categoryRunningClick(){
    $(categoryAll).removeClass('active');
    $(categoryCreated).removeClass('active');
    $(categoryCompleted).removeClass('active');
    $(categoryRunning).addClass('active');

    jobsObjTable.fnFilter("",3,true);
    jobsObjTable.fnFilter(running,3,true);

}
function categoryCompleteClick(){
    $(categoryAll).removeClass('active');
    $(categoryCreated).removeClass('active');
    $(categoryRunning).removeClass('active');
    $(categoryCompleted).addClass('active');

    jobsObjTable.fnFilter("",3,true);
    jobsObjTable.fnFilter(completed,3,true);
}

function htmlEncode(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function htmlDecode(value){
    return $('<div/>').html(value).text();
}

/*Functions to format the jobs data*/
function loadJobs(jobs){
    // remove the 'validation' job from jobs
    jobs=jobs.filter(function(job){
        return job.jobName!=validation;
    })
    $.grep(jobs, function (job, i) {
        if (job.jobName==validation) { // or whatever
            return false;
        }
        // do your normal code on el
        return true; // keep the element in the array
    });

    // use the fake data
    var  jobRecords=[];
    $.each(jobs,function(i,job){

        registJobFormListener(job.jobName);
        job.lastBuildStatus=buildStatusMap[job.lastBuildColor];
        jobRecords.push(transferToJobRecord(job));
        jobsMap[job.jobName]=job;
    });


    jobsObjTable= $(dtBasic).dataTable({
        "sPaginationType" : "bootstrap_two_button",
        "sDom":'tip',
        'iDisplayLength':15,
        "bAutoWidth": false,
        "oLanguage":{
          'sInfo':'Showing _START_ to _END_ of total _TOTAL_ Jobs',
          'sInfoFiltered': ""
        },
        "fnDrawCallback": function (oSettings) {
            $(dtBasicInfo).appendTo($(pageGroup));
            $(dtBasicInfo).addClass("pull-right margin-right margin-top");
           $('.dataTables_paginate').prependTo($(pageGroup))
        },
        'fnInitComplete':function(oSettings){
            for( var jobName in jobsMap){
                // toolbar plugin  effect
                $(jobToolBar+jobName).toolbar({content: jotToolBarOption+jobName, position: 'top',hideOnClick:true});
            }
        },
        "aaData": jobRecords,
        "aoColumnDefs" : [
            {"aTargets" : [0],
                "bSortable": false,
                "bSearchable": false,
                "bVisible": false
            },
        	{"aTargets" : [4],
        	"bSortable": false,
        	"bSearchable": false,
            "bVisible": false
        	},
            {"aTargets" : [5],
                "bSortable": false,
                "bSearchable": false,
                "bVisible": true
            }
        ]
    });

    $.each(jobs,function(i,job){
       if(i==0){
           initDefault(job.jobName);
       }
        else {
           loadJobSetting(job.jobName);
           loadConfigurations(job.jobName);
           loadJobReport(job.jobName);
       }
    	var timer = $.timer(function(){
            startContinusRefreshing(job.jobName);
        });
        timer.set({time:2000,autostart:false});
        timersMap[job.jobName]=timer;
        if(jobsMap[job.jobName].lastBuildStatus==running){
            timersMap[job.jobName].play();
        }
    });
    updateCategory();

}

function initDefault(jobName){
    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs/" + jobName,
        cache :false,
        success : function(data) {
            var jobSetting=data;
            jobSettingMap[jobName] = jobSetting;
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            jobSettingMap[jobName]=null;
        },
        complete: function(){
            $.ajax({
                type : "get",
                cache: false,
                url: "../api/Configuration/" + jobName,
                cache :false,
                success : function(data) {
                    var jobConfig=data;
                    configurationsMap[jobName] = jobConfig.configuration;
                },
                error : function(XMLHttpRequest,
                                 textStatus, errorThrown) {
                    configurationsMap[jobName] = null;
                },
                complete : function(){
                    $.ajax({
                        type : "get",
                        cache: false,
                        url: "../api/jobs/" + jobName+"/Report/lastBuild",
                        cache :false,
                        success : function(data) {
                            var jobReport=data;
                            jobReportMap[jobName] = jobReport;
                        },
                        error : function(XMLHttpRequest,
                                         textStatus, errorThrown) {
                            //
                        },
                        complete: function(){
                            // show the first job as default
                            jobsObjTable.$('tr:first').click();
                        }
                    });

                }
            });
        }
    });
}

function loadHistory (jobName,builds){
    // use the fake data
    var historyRecord=[];

    $.each(builds,function(i,build){
        historyRecord.push(transferToBuildRecord(build,jobName));
    });

    historyObjTable= $(historyTable+jobName).dataTable({
        "sDom":'t',
        "sScrollY": "550",
        "sScrollXInner": "100%",
        "sScrollYInner": "100%",
        'bScrollCollapse':true,
        "bPaginate": false,
        "aaSorting":[[1,'desc']],
        "aaData": historyRecord,
        "aoColumns": [
            {"bSortable":false},
            {"bSortable":false},
            {"bSortable": false },
            {"bSortable":false},
            {"bSortable":false, "bVisible":false}
        ]
    });

    registBuildHistoryFormListener(jobName);

}




/*Click Actions handlers*/
function  showJobDetailClick(event){
    // do not expand or collapse when clicking the action labels: job-satart, job-pause,job-stop
    if(event.target.className.indexOf("action")>-1|event.target.className.indexOf("fa")>-1|event.target.tagName.toLowerCase()=="span"||event.target.tagName.toLowerCase()=="input"){
        return;
    }
    var nTr = $(this)[0];
    /*if ( $(this).hasClass('custom-selected') ) {
      //  $(this).removeClass('custom-selected');
    }
    else*/ {
        jobsObjTable.$('tr.custom-selected').removeClass('custom-selected');
        $(this).addClass('custom-selected');

        var aData = jobsObjTable.fnGetData( nTr );
        var jobName = aData[1];
        var job=jobsMap[jobName];
        $(jobTablePanel).html(getJobDetails(job));
        registeJobFormValidationListener(jobName)
        $.ajax({
            type : "get",
            cache: false,
            url: "../api/Jobs/"+jobName+"/History" ,
            cache :false,
            success : function(data) {
                var historyResult=data;
                var historyDto = historyResult["jobHistories"];
                loadHistory(jobName,historyDto);
            },
            error : function(XMLHttpRequest,
                             textStatus, errorThrown) {
                configurationsMap[jobName] = null;
            }
        });
    }
}



function oTableFilter(){
    jobsObjTable.fnFilter($(this).val());
}

function oTableLengthChange(){
    jobsObjTable.fnSettings()._iDisplayLength= $(this).val();
    jobsObjTable.fnSettings()._iDisplayStart = 1;
    jobsObjTable.fnDraw();
}

var update_size = function() {
    if(historyObjTable!=undefined){
        $(historyObjTable).css({ width: $(historyObjTable).parent().width() });
        historyObjTable.fnAdjustColumnSizing();
    }
}

function windowResize(){
    clearTimeout(window.refresh_size);
    window.refresh_size = setTimeout(function() { update_size(); }, 10);
    if($(dtBasicWrapper).width()<$(dtBasic).width()){
        mode=modeEnum.small;
        jobsObjTable.fnSetColumnVis(0,true);
        jobsObjTable.fnSetColumnVis(4,false);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).show();
    }
    else  if($(dtBasic).width()<420){
        mode=modeEnum.middle;
        jobsObjTable.fnSetColumnVis(0,false);
        jobsObjTable.fnSetColumnVis(4,false);
        jobsObjTable.fnSetColumnVis(5,true);
        $(actionToolBar).hide();
    }
    else {
        mode=modeEnum.large;
        jobsObjTable.fnSetColumnVis(0,false);
        jobsObjTable.fnSetColumnVis(4,true);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).hide();
    }
}

$(document).ready(function() {
	pageSetUp();

    $.root_.removeClassPrefix('smart-style')
            .addClass('smart-style-3');

    /*
     * Load the jobs when page initiated
     * 
     * */
    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs",
        data : "",
        success : function(data) {
            $(window).resize(windowResize);
            loadJobs(data);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {

        },
        complete: function (){
        }
    });




    $(document).delegate(topJobFilter,'keyup',oTableFilter);
    $(document).delegate(categoryAll,'click',categoryAllClick);
    $(document).delegate(categoryCreated,'click',categoryCreatedClick);
    $(document).delegate(categoryRunning,'click',categoryRunningClick);
    $(document).delegate(categoryCompleted,'click',categoryCompleteClick);
    $(document).delegate(dtBasic+" tbody tr",'click',showJobDetailClick);
    $(document).delegate(topCreateJob,'click',createJobClick);
    $(document).delegate(createJobCancel,'click',createJobCancelClick);
    $(document).delegate(createJobSubmit,'click',createJobSubmitClick);
    $(document).delegate(viewPreBuild,'click',viewPrevBuildClick);
    $(document).delegate(viewNextBuild,'click',viewNextBuildClick);
    $(document).delegate(returnBuildList,'click',returnBuildListClick);
    $(document).delegate(topJobStart,'click',batchJobStartClick);
    $(document).delegate(topJobStop,'click',batchJobStopClick);
    $(document).delegate(topJobDelete,'click',batchJobDeleteClick);

    $(document).on( 'shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        if(e.target.name=="History"){
            if(historyObjTable!=undefined){
                historyObjTable.fnAdjustColumnSizing();
            }
        }
    });

    // clear the modal content and validation style after hiden
    $(createJobModal).on('hidden.bs.modal', function (e) {
        $(this)
            .find("input,textarea,select")
            .val('')
            .removeClass("valid")
            .end()
            .find("em")
            .hide()
            .end()
            .find("state-success")
            .removeClass("state-success")
            .end()
            .find(".form-group")
            .removeClass("has-error")
            .removeClass("has-success")
            .end()
            .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();

    });

    var uniqueJobMessage;
    var checkTimingMessage;
    function uniqueJobNameMessageFunc(){
       return uniqueJobMessage;
    }
    function checkTimingMessageFunc(){
        return checkTimingMessage;
    }
    $.validator.addMethod(
        "uniqueJobName",
        function(value, element) {
            var  res=true;
            var validation={};
            validation["Input"]=value;
            $.ajax({
                type: "post",
                url:  "../api/validation/jobname/",
                data: validation,
                async: false,
                success: function(result)
                {
                    //If username exists, set response to true

                    uniqueJobMessage=result['Message'];
                    res = ( result['Type'] == 'ok' ) ? true : false;
                },
                error : function(XMLHttpRequest,
                                 textStatus, errorThrown) {
                    res=false;
                    return "JobName input is invalid"
                }
            });
            return res;
        },
       // "JobName is Already Taken"
        uniqueJobNameMessageFunc
    );

    $.validator.addMethod(
        "checkTiming",
        function(value, element) {
            var  res=true;
            var validation={};
            validation["Input"]=value;
            $.ajax({
                type: "post",
                url:  "../api/validation/timing/",
                data:   validation,
                async: false,
                success: function(result)
                {
                    checkTimingMessage= result['Message'];
                    //If username exists, set response to true
                    res = ( result['Type'] == 'ok' ) ? true : false;

                },
                error : function(XMLHttpRequest,
                                 textStatus, errorThrown) {
                    res=false;
                    checkTimingMessage="Timing input is not valid";
                }

            });
            return res;
        },
        //"Timing input is not valid"
        checkTimingMessageFunc
    );

    $(createJobForm).validate({
        rules: {
            jobName : {
                required :true,
                uniqueJobName:true
            },
            timing : {
                required :true,
                checkTiming:true
            },
            p4Username : {
                required :true
            },
            p4Password : {
                required :true
            },
            p4Port : {
                required :true
            },
            p4WorkspaceName : {
                required :true
            },
            p4Viewmap : {
                required :true
            }
        } ,
        submitHandler: function(form) {
            createJobValidateCallBack();
        }
        ,
        highlight: function(element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
            element
                .addClass('valid')
                .addClass('background_none')
                .closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    });

    $(".minifyme").click();
})