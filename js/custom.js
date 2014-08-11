/**
 * Created by t_yuejial on 4/28/2014.
 */
// DO NOT REMOVE : GLOBAL FUNCTIONS!
// gloable varaiable
// datatables  object
var  jobsObjTable;
var  historyObjTable;
var  hub;
var modeEnum={small:0,medium:1,large:2}
var mode=modeEnum.large;
var serviceUrl="http://vhwebdevserver.eng.citrite.net";
/*var serviceUrl="http://localhost:61586";*/
// signalR connection id
var connectionId;

// data map
var  jobsMap={};
// upstream project map
var upstreamProjectMap={};
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
                required :true//,
                //regex: "[^-]+(-[^-]+){4}",
                //customJobName:true
            },
            timing : {
                required :true,
                checkTiming:true
            }
        } ,
        submitHandler: function(form) {
            //createJobValidateCallBack();
            saveProjectBasicCallback(jobName);
        },
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
            },
            gitRepositoryUrl:{
                required:true,
                url:true
            },
            gitName:{
                required:true
            },
            gitBranch:{
                required:true
            },
            svnRepositoryUrl:{
                required:true,
                url:true
            },
            svnLocalModuleDir:{
                required:true
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

    // use ajax to put the change and update the jobsmap and jobsObjTable Data in success callback
    var putData={};
    putData.JobName=projectName;
    putData.BuildPeriody=timing;

    $.ajax({
        type : "put",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName+"/setting",
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            //update the settingMap
            var settingDto = data;
            var updateJobs= upstreamProjectMap[settingDto.JobName];
            $.each(updateJobs,function(i,updateJobName){
                jobsMap[updateJobName].Setting=settingDto;
            });

            // toggle the edit-save icon
            $(editProjectBasicIcon+jobName).show();
            $(saveProjectBasicIcon+jobName).hide();

            // change to view mode
            $(basicSettingForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            //  $(jobNameInput+jobName).prop("readonly",true);
              $(jobNameInput+jobName).removeClass("uneditable");
            $(timingInput+jobName).prop("readonly",true);
            $(timingInput+jobName).addClass("no-border");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
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

    $(gitRepositoryUrlInput+jobName).prop("readonly",false).removeClass("no-border");
    $(gitNameInput+jobName).prop("readonly",false).removeClass("no-border");
    $(gitBrancheInput+jobName).prop("readonly",false).removeClass("no-border");

    $(svnRepositoryUrlInput+jobName).prop("readonly",false).removeClass("no-border");
    $(svnLocalModuleDirInput+jobName).prop("readonly",false).removeClass("no-border");

}

function saveProjectScmClick(){
    var spiltArray = $(this).attr("id").split(seperator);
    var jobName = spiltArray[spiltArray.length-1];
    $(scmSettingForm+jobName).submit();
}

function saveProjectScmCallback(jobName){
    // paste the exsisting content into input filed
    var projectName=$(jobNameInput+jobName).val();
    var type =jobsMap[jobName].Setting.ScmSetting.$type;
    // use ajax to put the change and update the jobsmap and jobsObjTable Data in success callback
    var putData={};
    // the $type must put in first place for type name handler to deserialize in to object

    putData.JobName=projectName;
    var scmData={};
    scmData.$type=type;
    switch (type){
        case gitScmType:
            scmData.RepositoryUrl =$(gitRepositoryUrlInput+jobName).val();
            scmData.Name =$(gitNameInput+jobName).val();
            scmData.BranchSpecifier =$(gitBrancheInput+jobName).val();
            break;
        case svnScmType:
            scmData.RepositoryUrl =$(svnRepositoryUrlInput+jobName).val();
            scmData.LocalModulDir =$(svnLocalModuleDirInput+jobName).val();
            break;
        case perforceScmType:
            scmData.UserName =$(p4UsernameInput+jobName).val();
            scmData.Password =$(p4PasswordInput+jobName).val();
            scmData.SCMPort =$(p4PortInput+jobName).val();
            scmData.Workspace =$(p4WorkspaceNameInput+jobName).val();
            scmData.ViewMap =$(p4ViewmapInput+jobName).val();
            break;
    }
    putData.ScmSetting = scmData;

    $.ajax({
        type : "put",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName+"/setting",
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // the current api didn't return correct data to transfer the state
            // for the reason that the put operation didn't change the job name we don't need to update jobMap
            //update the settingMap
            var settingDto = data;
            var updateJobs= upstreamProjectMap[settingDto.JobName];
            $.each(updateJobs,function(i,updateJobName){
                jobsMap[updateJobName].Setting=settingDto;
            });
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
            $(gitRepositoryUrlInput+jobName).prop("readonly",true).addClass("no-border");
            $(gitNameInput+jobName).prop("readonly",true).addClass("no-border");
            $(gitBrancheInput+jobName).prop("readonly",true).addClass("no-border");
            $(svnRepositoryUrlInput+jobName).prop("readonly",true).addClass("no-border");
            $(svnLocalModuleDirInput+jobName).prop("readonly",true).addClass("no-border");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
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
        url: serviceUrl+"/api/jobs/" + jobName+"/configuration",
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // update jobs map
            jobsMap[jobName].Configuration = data;
            $(projectConfigForm+jobName).removeClass("custom-form-edit").addClass("custom-form");
            $(projectConfigInput+jobName).prop('readonly',"true").addClass("no-border");

            // toggle the edit-save icon
            $(editProjectConfigIcon+jobName).show();
            $(saveProjectConfigIcon+jobName).hide();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
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
    $.fileDownload("../api/jobs/"+jobName+"/report/lastBuild/file", {
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

    $.fileDownload("../api/jobs/"+jobName+"/report/"+buildNumber+"/file", {
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
        if(jobsMap[jobName].Result==running){
            return ;
        }
        var nTrObject=$(this).parents("tr");
        var nTr = nTrObject[0];
        // start the job
        $.ajax({
            type : "post",
            cache: false,
            url: serviceUrl+"/api/jobs/" + jobName + "/start?fields=status",
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
                var partialJob =data;
                jobsMap[jobName].Status=partialJob.Status;
                var job = jobsMap[jobName];
                job.Result=running;
                var aData=transferToJobRecord(job);
                $(jobStart+jobName).addClass("active");
                $(jobStop+jobName).removeClass("active");
                /* Open this row */
                jobName = aData[1];
                nTrObject.click();
                $(step4Head).click();
                $(projectReportInput+jobName).text("");
                // trigger refreshing
                hub.server.fetchJobReport(jobName);

                // we shall update the table at last ,the fnUpdate will trigger the current filter
                jobsObjTable.fnUpdate(aData,nTr);
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
    if(jobsMap[jobName].Result==running){
        return ;
    }
    var nTrObject=$(this).parents("tr");
    var nTr = nTrObject[0];

    // start the job
    $.ajax({
        type : "post",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName + "/start?fields=status",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
            var partialJob =data;
            jobsMap[jobName].Status=partialJob.Status;
            var job = jobsMap[jobName];
            job.Result=running;
            var aData=transferToJobRecord(job);
            $(jobStart+jobName).addClass("active");
            $(jobStop+jobName).removeClass("active");
            // Open this row
            jobName = aData[1];
            nTrObject.click();
            $(step4Head).click();
            $(projectReportInput+jobName).text("");
            // trigger refreshing

            hub.server.fetchJobReport(jobName);

            // we shall update the table at last ,the fnUpdate will trigger the current filter
            jobsObjTable.fnUpdate(aData,nTr);
            updateCategory();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobName).removeClass("active");
        }

    });

}

// multiple job selection for stop action
function batchJobStopClick(){
    $("input:checked", jobsObjTable.fnGetNodes()).each(function(){
        var jobName = $(this).attr("data-name");
        // check job current state
        if(jobsMap[jobName].Result!=running){
            return ;
        }
        var nTrObject=$(this).parents("tr");
        var nTr = nTrObject[0];
        $.ajax({
            type : "delete",
            cache: false,
            url: serviceUrl+"/api/jobs/" + jobName + "/stop?fields=jobName",
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
               // var job= data;
                $(jobStart+jobName).removeClass("active");
                $(jobStop+jobName).addClass("active");
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
    var nTr=nTrObject[0];
    
    $.ajax({
        type : "delete",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName + "/stop?fields=jobName",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
        	//var job =data;
            $(jobStart+jobName).removeClass("active");
            $(jobStop+jobName).addClass("active");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobName).removeClass("active");
        }
    });

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
            url: serviceUrl+"/api/jobs/" + jobName,
            data: null,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success : function(data) {
                var jobName =data;
                delete jobsMap[jobName];
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

    var nTr=nTrObject[0];
    var aPos = jobsObjTable.fnGetPosition(nTr);
    $.ajax({
        type : "delete",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName,
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
            var jobName =data;
           delete jobsMap[jobName];
           jobsObjTable.fnDeleteRow(aPos);
            updateCategory();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            alert("Deleted Failed");
        }
    });

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
    $.ajax({
        type : "get",
        cache: false,
        url: serviceUrl+"/api/views/SRC?fields=jobs(jobname)" ,
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
            var jobs =data.Jobs;
            $.each(jobs,function(i,job){
                var jobName= job.JobName;
                $(upstreamProject).append("<option value="+jobName+">"+jobName+"</option>");
            });
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            alert("Deleted Failed");
        },
        complete: function(){
            $(createJobModal).modal('show');
        }
    });

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
    jobData.JobName     = $(jobName).val();
    jobData.UpstreamProject = $(upstreamProject).val();


    var requestURL = serviceUrl+"/api/jobs/" + jobData["JobName"]+"?fields=jobName";
    var reqData = JSON.stringify(jobData);
    $.ajax({
        type : "post",
        cache: false,
        url: requestURL,
        contentType: "application/json",
        data : reqData,
        success : function(data) {
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
        ' id="job-toolbar'+seperator+job.JobName+'" data-toggle="tooltip" title="" type="button" class="btn btn-default btn-xs action" data-original-title="Action"><i class="fa fa-gear"></i></button>'+
        '</div>';
    var toolOptionStr ='<div class="hide"><div ' +
        'id="job-toolbar-options'+seperator+job.JobName+'"><a href="javascript:void(0)" ' +
        'id="action-start'+seperator+job.JobName+'"><i class="fa fa-play"></i></a><a href="javascript:void(0)"' +
        'id="action-stop'+seperator+job.JobName+'"><i class="fa fa-stop"></i></a><a href="javascript:void(0)"' +
        'id="action-delete'+seperator+job.JobName+'"><i class="fa fa-trash-o"></i></a></div></div> ';
    var actionStr;
    var state =job.Result;
    var checkBoxStr ='<div class="checkbox "><label><input type="checkbox" class="checkbox style-2" data-name="'+job.JobName+'"><span></span> </label></div>';

    var actionStr1 = '<div class="btn-group action" data-toggle="buttons">' +
                        '<label title="Start Job" class="btn btn-default btn-xs action ' ;
      //  ' active'
    var actionStr2=     '" id="job-start'+seperator+job.JobName+'" ><input type="radio" name="style-a1" id="style-a1"> ' +
                                     '<i class="fa fa-play action"></i>' +
                        '</label>' +
                     '<label title="Stop Job" class="btn btn-default btn-xs action ' ;
//      'active'
   var actionStr3=     '" id="job-stop'+seperator+job.JobName+'" ><input type="radio" name="style-a2" id="style-a2"> ' +
                                  '<i class="fa fa-stop action"></i>' +
                       '</label>' +
                         '<label title="Delete Job" class="btn btn-default btn-xs action ' ;
     //   'active'
     var actionStr4=     '" id="job-delete'+seperator+job.JobName+'" ><input type="radio" name="style-a2" id="style-a3">' +
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
    record.push(job.JobName);
    record.push(job.Status.Status);
    record.push(state);
    record.push(actionStr);
    record.push(actionToolBarStr+toolOptionStr);
    return record;
}

//for datatables
function transferToBuildRecord(build,jobName){
    var buildNumber =build.Number;
    var displayName = build.FullDisplayName;
    var timeStr = build.Id;
    var buildTime= timeStr.split('_')[0].concat(" ").concat(timeStr.split('_')[1].split('-').join(":"));
    var duration  = build.Duration+"s";
    var result = build.Result;

    var  displayNameLink='<a href="javascript:void(0)" data-build-number="'+buildNumber+'" data-job-name="'+jobName+'">'+displayName.replace(jobName,"Build")+'</a>';
    var record = [];
  /*  record.push(buildNumber);*/
    record.push(displayNameLink);
    record.push(buildTime);
    record.push(duration);
    record.push(result);
    record.push(buildNumber);
    return record;
}

function appendReportData(jobName,report){
    if($(projectReportInput+jobName).length==0){
        return;
    }
    var reportContent =$(projectReportInput+jobName).text();
    $(projectReportInput+jobName).text(reportContent+report);
    $(projectReportInput+jobName).animate({
            scrollTop:$(projectReportInput+jobName)[0].scrollHeight - $(projectReportInput+jobName).height()
        },2000,function(){
            // alert("done");
        }
    );
}

function updateReportCallback(jobName){
    $(jobStart+jobName).removeClass("active");
    $(jobStop+jobName).addClass("active");

    $.ajax({
        type : "get",
        cache: false,
        url: serviceUrl+"/api/jobs/" + jobName+"?fields=builds,status,report",
        cache :false,
        success : function(data) {
            var partialJob=data;
            // get last build color through ajax and update the status
            jobsMap[jobName].Status = partialJob.Status;
            jobsMap[jobName].Result = completed;
            jobsMap[jobName].Builds = partialJob.Builds;
            jobsMap[jobName].Report= partialJob.Report;
            // we shall update the table at last ,the fnUpdate will trigger the current filter
            var tableData=jobsObjTable.fnGetData();
            var index=0;
            for(var i=0;i<tableData.length;i++){
                if(tableData[i][1]==jobName){
                    index=i;
                    break;
                }
            }
            var job = jobsMap[jobName];
            var aData=transferToJobRecord(job);
            jobsObjTable.fnUpdate(aData,index);
            updateCategory();
            //update current show job detail hisory
            var splitArray=$(jobTablePanel+" .tab-content .tab-pane:first ").attr("id").split(seperator);
            var showName=splitArray[splitArray.length-1];
            if(jobName==showName&&historyObjTable!=undefined){
                //detectJobHistory(job);
                historyObjTable.fnClearTable();
                historyObjTable.fnDraw();
                var historyDto = job.Builds.JobHistories;
                var historyRecord=[];
                $.each(historyDto,function(i,build){
                    historyRecord.push(transferToBuildRecord(build,jobName));
                });
                historyObjTable.fnAddData(historyRecord);
            }
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {

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
        return job.JobName!=validation;
    })

    $.grep(jobs, function (job, i) {
        if (job.JobName==validation) { // or whatever
            return false;
        }
        // do your normal code on el
        return true; // keep the element in the array
    });

    // use the fake data
    var  jobRecords=[];
    $.each(jobs,function(i,job){
        registJobFormListener(job.JobName);
        job.Result=buildStatusMap[job.Status.Status];
        jobRecords.push(transferToJobRecord(job));
        jobsMap[job.JobName]=job;

    });
   /* var firstJob = jobs[0];*/
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



    updateCategory();
}

function loadHistory (jobName,builds){
    // use the fake data
    var historyRecord=[];
    if(builds!=undefined){
        $.each(builds,function(i,build){
            historyRecord.push(transferToBuildRecord(build,jobName));
        });
    }
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
    historyObjTable.fnAdjustColumnSizing();
    registBuildHistoryFormListener(jobName);

}


/*Click Actions handlers*/
function  showJobDetailClick(event){
    // do not expand or collapse when clicking the action labels: job-satart, job-pause,job-stop
    if(event.target.className.indexOf("action")>-1|event.target.className.indexOf("fa")>-1|event.target.tagName.toLowerCase()=="span"||event.target.tagName.toLowerCase()=="input"){
        return;
    }
    var nTr = $(this)[0];
    if ( $(this).hasClass('custom-selected') ) {
      //  $(this).removeClass('custom-selected');
    }
    else {
        jobsObjTable.$('tr.custom-selected').removeClass('custom-selected');
        $(this).addClass('custom-selected');

        var aData = jobsObjTable.fnGetData( nTr );
        var jobName = aData[1];
        var job=jobsMap[jobName];
        $(jobTablePanel).html(getJobDetails(job));
        // when clicking the job detail ,the setting tab will show as default  tab, so we will fetch setting data at first
        detectJobSetting(job);
        registeJobFormValidationListener(jobName);

    }
}
function detectJobSetting(job){
    if(job.Setting==undefined){
        $.ajax({
            type : "get",
            cache: false,
            url:serviceUrl+"/api/jobs/"+job.JobName+"?fields=setting",
            data : "",
            success : function(data) {
                job.Setting=data.Setting;
                var jobName=job.JobName;
                var settingJobName=job.Setting.JobName;
                jobsMap[jobName]=job;
                if(jobName!=settingJobName ){
                    if(upstreamProjectMap[settingJobName]!=undefined){
                        upstreamProjectMap[settingJobName].push(jobName);
                    }else {
                        upstreamProjectMap[settingJobName]=[];
                        upstreamProjectMap[settingJobName].push(jobName);
                    }
                }
                initSettingTabData(job);
            }
        });
    }else{
        initSettingTabData(job);
    }
}
function detectJobConfiguration(job){
    if(job.Configuration==undefined){
        $.ajax({
            type : "get",
            cache: false,
            url:serviceUrl+"/api/jobs/"+job.JobName+"?fields=configuration",
            data : "",
            success : function(data) {
                job.Configuration=data.Configuration;
                jobsMap[job.JobName]=job;
                initConfigurationTabData(job);
            }
        });
    }else {
        initConfigurationTabData(job);
    }
}

function detectJobHistory(job){
    if(job.Builds==undefined){
        $.ajax({
            type : "get",
            cache: false,
            url:serviceUrl+"/api/jobs/"+job.JobName+"?fields=builds",
            data : "",
            success : function(data) {
                job.Builds=data.Builds;
                jobsMap[job.JobName]=job;
                initHistoryTabData(job);
            }
        });
    }else {
        initHistoryTabData(job);
    }
}

function detectJobReport(job){
    if(job.Report==undefined){
        $.ajax({
            type : "get",
            cache: false,
            url:serviceUrl+"/api/jobs/"+job.JobName+"?fields=report",
            data : "",
            success : function(data) {
                job.Report=data.Report;
                jobsMap[job.JobName]=job;
                initReportTabData(job);
            }
        });
    }else {
        initReportTabData(job);
    }
}

function initSettingTabData(job){
    // initial the job setting fileds
    var jobSetting = job.Setting;
    var jobName = job.JobName;
    $(jobNameInput+jobName).attr("value",jobSetting.JobName);
    $(timingInput+jobName).attr("value",jobSetting.BuildPeriody);
    // detect scm type
    var scmSetting = jobSetting.ScmSetting;
    switch (scmSetting.$type){
        case gitScmType:
            $(perforceScm+jobName).hide();
            $(gitScm+jobName).show();
            $(svnScm+jobName).hide();
            $(gitRepositoryUrlInput+jobName).attr("value",scmSetting.RepositoryUrl);
            $(gitNameInput+jobName).attr("value",scmSetting.Name);
            $(gitBrancheInput+jobName).attr("value",scmSetting.BranchSpecifier);
            break;
        case svnScmType:
            $(perforceScm+jobName).hide();
            $(gitScm+jobName).hide();
            $(svnScm+jobName).show();
            $(svnRepositoryUrlInput+jobName).attr("value",scmSetting.RepositoryUrl);
            $(svnLocalModuleDirInput+jobName).attr("value",scmSetting.LocalModulDir);
            break;
        case perforceScmType:
            $(perforceScm+jobName).show();
            $(gitScm+jobName).hide();
            $(svnScm+jobName).hide();
            $(p4UsernameInput+jobName).attr("value",scmSetting.UserName);
            $(p4PasswordInput+jobName).attr("value",scmSetting.Password);
            $(p4PortInput+jobName).attr("value",scmSetting.SCMPort);
            $(p4WorkspaceNameInput+jobName).attr("value",scmSetting.Workspace);
            $(p4ViewmapInput+jobName).text(scmSetting.ViewMap);
            break;
    }
}
function initConfigurationTabData(job){
// init the configuration panel
    var jobName = job.JobName;
    $(projectConfigInput+jobName).text(job.Configuration.Configuration);
}
function initHistoryTabData(job){
    var historyDto = job.Builds.JobHistories;
    var jobName = job.JobName;
    loadHistory(jobName,historyDto);
}
function initReportTabData(job){
    var jobName = job.JobName;
    $(projectReportInput+jobName).text(job.Report.Report);
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
    if($(dtBasicWrapper).width()<$(dtBasic).width()||$(dtBasic).width()<320){
        mode=modeEnum.small;
        jobsObjTable.fnSetColumnVis(0,true);
        jobsObjTable.fnSetColumnVis(2,false);
        jobsObjTable.fnSetColumnVis(3,false);
        jobsObjTable.fnSetColumnVis(4,false);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).show();
    }
    else if($(dtBasic).width()<420){
        mode=modeEnum.medium;
        jobsObjTable.fnSetColumnVis(0,true);
        jobsObjTable.fnSetColumnVis(2,true);
        jobsObjTable.fnSetColumnVis(3,false);
        jobsObjTable.fnSetColumnVis(4,false);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).show();
    }
    else  if($(dtBasic).width()<630){
        mode=modeEnum.medium;
        jobsObjTable.fnSetColumnVis(0,true);
        jobsObjTable.fnSetColumnVis(2,true);
        jobsObjTable.fnSetColumnVis(3,true);
        jobsObjTable.fnSetColumnVis(4,false);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).show();
    }
    else {
        mode=modeEnum.large;
        jobsObjTable.fnSetColumnVis(0,false);
        jobsObjTable.fnSetColumnVis(2,true);
        jobsObjTable.fnSetColumnVis(3,true);
        jobsObjTable.fnSetColumnVis(4,true);
        jobsObjTable.fnSetColumnVis(5,false);
        $(actionToolBar).hide();
    }
}


$(document).ready(function() {
	pageSetUp();
    /*
     * Load the jobs when page initiated
     * we need to load the all jobs with job name and job status
     * */
     $.ajax({
        type : "get",
        cache: false,
        async: false,
        //url: "../api/jobs",
        url:serviceUrl+"/api/tools/faketool?fields=toolname,viewname,jobs(jobname,status)",
        data : "",
        success : function(data) {

            $(window).resize(windowResize);
            var jobsData =data.Jobs;
            loadJobs(jobsData);
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
        var jobName = e.target.href.split(seperator).slice(-1)[0];
        var inited= e.target.attributes["data-init"].value;

        if(inited=="true"){
            if(e.target.name=="History"&&historyObjTable!=undefined){
                historyObjTable.fnAdjustColumnSizing();
            }
            return;
        }
        var job =jobsMap[jobName];
        switch (e.target.name){
            case "Setting":
                detectJobSetting(job);
                break;
            case "Configure":
                detectJobConfiguration(job);
                break;
            case "History":
                detectJobHistory(job);

                break;
            case "Report":
                detectJobReport(job);
                break;
        }
        e.target.attributes["data-init"].value="true";

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
            var validationData={};
            validationData["Input"]=value;
            $.ajax({
                type: "post",
                url:  serviceUrl+"/api/validation/jenkins/jobname",
                data : JSON.stringify(validationData),
                dataType : "json",
                contentType:"application/json; charset=utf-8",
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
        "customJobName",
        function(value, element) {
            var  res=true;
            var validationData={};
            validationData["Input"]=value;
            $.ajax({
                type: "post",
                url:  serviceUrl+"/api/validation/custom/jobname",
                data : JSON.stringify(validationData),
                dataType : "json",
                contentType:"application/json; charset=utf-8",
                async: false,
                success: function(result)
                {
                    //If username exists, set response to true
                    res =  true;
                },
                error : function(XMLHttpRequest,
                                 textStatus, errorThrown) {
                    res=false;
                }
            });
            return res;
        },
         "Please input valid project name and tool name"
    );


    $.validator.addMethod(
        "checkTiming",
        function(value, element) {
            var  res=true;
            var validation={};
            validation["Input"]=value;
            $.ajax({
                type: "post",
                url:  serviceUrl+"/api/validation/jenkins/timing",
                data : JSON.stringify(validation),
                dataType : "json",
                contentType:"application/json; charset=utf-8",
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

    $.validator.addMethod(
      "regex",
      function(value,element,regexp){
          var regex = new RegExp(regexp);
          return this.optional(element)||regex.test(value);
      },
       "please name the job in order of  product name,version, component,tag,tool"
    );

    $(createJobForm).validate({
        rules: {
            jobName : {
                required :true,
                uniqueJobName:true,
                regex: "[^-]+(-[^-]+){4}",
                customJobName:true
            },
            upstreamProject : {
                required :true
            }

        } ,
        onkeyup: false,
        onfocusout: true,
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
    $(dtBasic+ ' tbody tr:first').click();
    $.connection.hub.url=serviceUrl+"/signalr";
    hub = $.connection.jobHub;
    hub.client.hello=function (message){
        alert(message);
    };
    hub.client.appendReport = appendReportData;
    hub.client.updateReportCallback =updateReportCallback;
    $.connection.hub.start().done(function(){
        for(var jobName in jobsMap){
            var job = jobsMap[jobName];
            if(job.Result==running){
                hub.server.fetchJobReport(jobName);
            }
        }
        connectionId=$.connection.hub.id;
        console.log('Now connected, connection ID=' + connectionId);
    }).fail(function (error){
        console.log("connect error");
    });
})