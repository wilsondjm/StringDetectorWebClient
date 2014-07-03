/**
 * Created by t_yuejial on 4/28/2014.
 */
// DO NOT REMOVE : GLOBAL FUNCTIONS!
// gloable varaiable
var  oTable;
var  jobsDto;
var  jobsMap={};
var  timersMap={};
var  expandProjectInfoIcon='#expand-project-info-icon-';
var  collapseProjectInfoIcon='#collapse-project-info-icon-';
var  editProjectInfoIcon='#edit-project-info-icon-';
var  saveProjectInfoIcon='#save-project-info-icon-';
var expandProjectConfigIcon='#expand-project-config-icon-';
var collapseProjectConfigIcon='#collapse-project-config-icon-';
var editProjectConfigIcon='#edit-project-config-icon-';
var saveProjectConfigIcon='#save-project-config-icon-';
var uploadProjectConfigIcon='#upload-project-config-icon-';
var expandProjectReportIcon='#expand-project-report-icon-';
var collapseProjectReportIcon='#collapse-project-report-icon-';
var downloadProjectReportIcon='#download-project-report-icon-';
var refreshProjectReportIcon='#refresh-project-report-icon-';

var projectInfoForm= "#project-info-form-";
var editProjectInfo="#edit-project-info-";
var viewProjectInfo="#view-project-info-";

var projectConfigForm="#project-configuration-form-";
var projectReortForm="#project-report-form-";
var expandJobRow="#expand-job-row-";
var editProjectName="#editProjectName-";
var editSourcePath="#editSourcePath-";
var viewProjectInfo="#view-project-info-";
var viewProjectName="#viewProjectName-";
var viewSourcePath="#viewSourcePath-";
var projectConfig="#project-config-";
var projectConfigFile = "#project-configuration-file-";
var projectReport="#project-report-";

var jobStart="#job-start-";
var jobPause="#job-pause-";
var jobStop="#job-stop-";


// job status
var jobCreate ="JOB_CRATED";
var jobBeginLaunch="BEGIN_LAUNCH";
var jobRunning="RUNNING";
var jobTerminated="TERMINATED";
var jobEndWithSuccess="ENDS_WITH_SUCCESS";
var jobEndWithFailure="ENDS_WITH_FAILURE";

/*initialize the datatable*/
function loadJobs(jobs){
    // use the fake data
    var  jobRecords=[];

    $.each(jobs,function(i,job){
        registJobFormListener(job.JobNumber);
        jobRecords.push(transferToJobRecord(job));
        jobsMap[job.JobNumber]=job;
        var timer = $.timer(function(){
            startContinusRefreshing(job.JobNumber);
        });
        timer.set({time:3000,autostart:false});
        timersMap[job.JobNumber]=timer;
    })

    oTable= $('#dt_basic').dataTable({
        "sPaginationType" : "bootstrap_full",
        "aaData": jobRecords
    });
}

function transferToJobRecord(job){
    var actionStr;
    var state =job.JobState.JobStatus;

    var actionStr1 = '<div class="btn-group action" data-toggle="buttons">' +
                        '<label class="btn btn-default btn-xs action ' ;
      //  ' active'
    var actionStr2=     '" id="job-start-'+job.JobNumber+'" ><input type="radio" name="style-a1" id="style-a1"> ' +
                                     '<i class="fa fa-play action"></i>' +
                        '</label>' +
                        '<label class="btn btn-default btn-xs action ' ;
      //  'active'
    var actionStr3=     '" id="job-pause-'+job.JobNumber+'" ><input type="radio" name="style-a2" id="style-a2"> ' +
                                    '<i class="fa fa-pause action"></i>' +
                         '</label>' +
                         '<label class="btn btn-default btn-xs action ' ;
     //   'active'
     var actionStr4=     '" id="job-stop-'+job.JobNumber+'" ><input type="radio" name="style-a2" id="style-a3">' +
                                 ' <i class="fa fa-stop action"></i>' +
                         '</label>' +
                     '</div>';
      if(state==jobBeginLaunch||state==jobRunning) {
          actionStr = actionStr1+'active'+actionStr2+actionStr3+actionStr4;
          // do something such as refresh  report
      }
      else {
          actionStr = actionStr1+actionStr2+'active'+actionStr3+'active'+actionStr4;
          // do something such as stop refreshing
      }


    var record = [];
    record.push(job.JobNumber);
    record.push(job.ProjectName);
    record.push(job.JobState.JobStatus);
    record.push(actionStr);
    return record;
}


// regist action listener
function registJobFormListener(jobNumber){
    // project info  
    $(document).delegate(expandProjectInfoIcon+jobNumber,'click',expandProjectInfoClick);
    $(document).delegate(collapseProjectInfoIcon+jobNumber,'click',collapseProjectInfoClick);
    $(document).delegate(editProjectInfoIcon+jobNumber,'click',editProjectInfoClick);
    $(document).delegate(saveProjectInfoIcon+jobNumber,'click',saveProjectInfoClick);

    // project config
    $(document).delegate(expandProjectConfigIcon+jobNumber,'click',expandProjectConfigClick);
    $(document).delegate(collapseProjectConfigIcon+jobNumber,'click',collapseProjectConfigClick);
    $(document).delegate(editProjectConfigIcon+jobNumber,'click',editProjectConfigClick);
    $(document).delegate(saveProjectConfigIcon+jobNumber,'click',saveProjectConfigClick);
    $(document).delegate(uploadProjectConfigIcon+jobNumber,'click',uploadProjectConfigClick);
    $(document).delegate(projectConfigFile+jobNumber,'change',changeProjectConfigClick);

    // project report
    $(document).delegate(expandProjectReportIcon+jobNumber,'click',expandProjectReportClick);
    $(document).delegate(collapseProjectReportIcon+jobNumber,'click',collapseProjectReportClick);
    $(document).delegate(downloadProjectReportIcon+jobNumber,'click',downloadProjectReportClick);
    $(document).delegate(refreshProjectReportIcon+jobNumber,'click',refreshProjectReportClick);

    //job  action
    $(document).delegate(jobStart+jobNumber,'click',jobStartClick);
    $(document).delegate(jobPause+jobNumber,'click',jobPauseClick);
    $(document).delegate(jobStop+jobNumber,'click',jobStopClick);

}


// action listener of job action
function jobStartClick(){
  if(  $(this).hasClass("active")){
      return;
  }

    var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr")[0];

    // start the job
    $.ajax({
        type : "post",
        cache: false,
        url: "../api/jobs/" + jobName + "/task",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
            // update jobs map
            jobsMap[jobName] = data;

            // oTable
            var aData = oTable.fnGetData(nTr);
            aData=transferToJobRecord(jobsMap[jobName]);
            oTable.fnUpdate(aData,nTr);

            // trigger expand row
            if ( !oTable.fnIsOpen(nTr) )
            {
                /* Open this row */
                //this.src = "../examples_support/details_close.png";
                aData = oTable.fnGetData( nTr );
                jobNumber = aData[0];
                var jobDto=jobsMap[jobName];
                oTable.fnOpen( nTr, fnFormatDetails(jobDto), 'JobDetail' );
            }

            // expand the report  and collapse the info and configuration form
            // collapse the project info
            if($(expandProjectInfoIcon+jobName).is(":hidden")){
                $(collapseProjectInfoIcon+jobName).trigger("click");
            }
            // collapse the project configuration
            if($(expandProjectConfigIcon+jobNumber).is(":hidden")){
                $(collapseProjectConfigIcon+jobNumber).trigger("click");
            }

            // expand the project report
            if($(collapseProjectReportIcon+jobName).is(":hidden")){
                $(expandProjectReportIcon+jobName).trigger("click");
            }

            // trigger refreshing
          //  $(refreshProjectReportIcon+jobNumber).trigger('click');
            timerStart(jobName);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobName).removeClass("active");
        }
    });


}

function jobPauseClick(){
    if(  $(this).hasClass("active")){
        return;
    }
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr")[0];

    // timer action
    timerPause(jobNumber);

    // toggle the job action
    $(jobStart+jobNumber).removeClass("active");
    $(jobPause+jobNumber).addClass("active");
    $(jobStop+jobNumber).removeClass("active");
}

function jobStopClick(){
    if(  $(this).hasClass("active")){
        return;
    }
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr")[0];
    timerStop(jobNumber);

    $(jobStart+jobNumber).removeClass("active");
    $(jobPause+jobNumber).addClass("active");
    $(jobStop+jobNumber).addClass("active");
}

// action listener of project info
function collapseProjectInfoClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectInfoForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(expandProjectInfoIcon+jobNumber);
    $(this).hide();
    expandSpan.show();

}


function expandProjectInfoClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectInfoForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(collapseProjectInfoIcon+jobNumber);
    $(this).hide();
    expandSpan.show();
}

function editProjectInfoClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    // check the collapse-expand state
    if( $(projectInfoForm+jobNumber+" fieldset").is(":hidden")){
        $(projectInfoForm+jobNumber+" fieldset").slideToggle(500);
        $(expandProjectInfoIcon+jobNumber).hide();
        $(collapseProjectInfoIcon+jobNumber).show();
    }
    // toggle the edit-view state
    $(editProjectInfo+jobNumber).show();
    $(viewProjectInfo+jobNumber).hide();

    // toggle the edit-save icon

    $( editProjectInfoIcon+jobNumber).hide();
    $(saveProjectInfoIcon+jobNumber).show();

    // paste the exsisting content into input filed
    var projectName = $(viewProjectName+jobNumber).html();
    var sourcePath = $(viewSourcePath+jobNumber).html();
    $(editProjectName+jobNumber).val(projectName);
    $(editSourcePath+jobNumber).val(sourcePath);


}

function saveProjectInfoClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];
    // paste the exsisting content into input filed
     var projectName=$(editProjectName+jobNumber).val();
     var sourcePath =$(editSourcePath+jobNumber).val();
    // use ajax to put the change and update the jobsmap and oTable Data in success callback
    var putData={};
    putData["ProjectName"]=projectName;
    putData["SourcePath"]=sourcePath;
    $.ajax({
        type : "put",
        cache: false,
        url: "../api/jobs/" + jobNumber,
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // update jobMap
            jobsMap[jobNumber]=data;
            // toggle the edit-view state
            $(editProjectInfo+jobNumber).hide();
            $(viewProjectInfo+jobNumber).show();

            // toggle the edit-save icon
            $(editProjectInfoIcon+jobNumber).show();
            $(saveProjectInfoIcon+jobNumber).hide();

            //update the info
            $(viewProjectName+jobNumber).html(projectName);
            $(viewSourcePath+jobNumber).html(sourcePath);

           // oTable.
            var aData = oTable.fnGetData(nTr);
            aData=transferToJobRecord(jobsMap[jobNumber]);
            oTable.fnUpdate(aData,nTr);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        }
    });

}

// action listener of project configuration
function collapseProjectConfigClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectConfigForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(expandProjectConfigIcon+jobNumber);
    $(this).hide();
    expandSpan.show();
}


function expandProjectConfigClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectConfigForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(collapseProjectConfigIcon+jobNumber);
    $(this).hide();
    expandSpan.show();
}

function editProjectConfigClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    // check the collapse-expand state
    if( $(projectConfigForm+jobNumber+" fieldset").is(":hidden")){
        $(projectConfigForm+jobNumber+" fieldset").slideToggle(500);
        $(expandProjectConfigIcon+jobNumber).hide();
        $(collapseProjectConfigIcon+jobNumber).show();
    }
    // toggle the edit-save icon
    $( editProjectConfigIcon+jobNumber).hide();
    $(saveProjectConfigIcon+jobNumber).show();
    // toggle the edit-view state
    $(projectConfig+jobNumber).removeAttr('disabled');
    $(projectConfig+jobNumber).focus();

}

function saveProjectConfigClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];

    // paste the exsisting content into input filed
    var configContent=$(projectConfig+jobNumber).val();
    var putData={};
    putData["Configuration"]=configContent;
    $.ajax({
        type : "put",
        cache: false,
        url: "../api/jobs/" + jobNumber + "/configuration",
        data : JSON.stringify(putData),
        dataType : "json",
        contentType:"application/json; charset=utf-8",
        cache :false,
        success : function(data) {
            // update jobs map
            jobsMap[jobNumber].Configuration = data;
            var jobConfig =data;
            // toggle the edit-view state
            $(projectConfig+jobNumber).prop('disabled',"true");

            // toggle the edit-save icon
            $(editProjectConfigIcon+jobNumber).show();
            $(saveProjectConfigIcon+jobNumber).hide();

        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        }
    });

}

function uploadProjectConfigClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];
    $(editProjectConfigIcon+jobNumber).trigger("click");
    $(projectConfigFile+jobNumber).trigger("click");
}

function changeProjectConfigClick(event){
    // Check for the various File API support.
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
// action listener of project report
function collapseProjectReportClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectReortForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(expandProjectReportIcon+jobNumber);
    $(this).hide();
    expandSpan.show();
}


function expandProjectReportClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $(projectReortForm+jobNumber+" fieldset").slideToggle(500);
    var expandSpan = $(collapseProjectReportIcon+jobNumber);
    $(this).hide();
    expandSpan.show();
}

function downloadProjectReportClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    $.fileDownload("../api/jobs/" + jobNumber + "/report/file", {
        successCallback: function (url) {

        },
        failCallback: function (responseHtml, url) {

            alert("The report is empty");
        }
    });

}


function refreshProjectReportClick(){
    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];

    // check the job action if no action just refresh the reprot;
    if($(jobStart+jobNumber).hasClass("active")){
        timerStart(jobNumber);
       // refreshProjectStatus(jobNumber,nTr);
    }else {
        refreshProjectReport(jobNumber,nTr,false);
    }
 //   refreshProjectReport(jobNumber,nTr);

}

function timerStart(jobNumber){
    timersMap[jobNumber].play();
}

function timerPause(jobNumber){
    timersMap[jobNumber].pause();
}

function timerStop(jobNumber){
    timersMap[jobNumber].stop();
}

function startContinusRefreshing(jobNumber){
    // alert("This message is  sent by  timer-"+jobNumber);
   var nTr= $(jobStart+jobNumber).parents("tr")[0];
   refreshProjectStatus(jobNumber,nTr);

}

function refreshProjectReport(jobNumber,nTr,continusRefreshing){
    if(!continusRefreshing){
        $(refreshProjectReportIcon+jobNumber+" a i").addClass("fa-spin");
    }

    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs/" + jobNumber + "/report/text",
        data : null,
        dataType : "json",
        cache :false,
        success : function(data) {
            // update jobs map
            jobsMap[jobNumber].Report = data;
            var reportContent =data.ReportContent;
            $(projectReport + jobNumber).val(reportContent);
            $(projectReport + jobNumber).scrollTop($(projectReport + jobNumber)[0].scrollHeight);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        },
        complete: function(data){
           var timer =  $.timer(function(){
               if(!continusRefreshing){
                   $(refreshProjectReportIcon+jobNumber+" a i").removeClass("fa-spin");
               }
            });

            timer.set({time:2000 , autostart : true});
        }
    });
}



function refreshProjectStatus(jobNumber,nTr){
    $(refreshProjectReportIcon+jobNumber+" a i").addClass("fa-spin");
    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs/" + jobNumber + "/state",
        data : null,
        dataType : "json",
        cache :false,
        success : function(data) {
            // update jobs map
            jobsMap[jobNumber].JobState = data;

            // oTable.
            var aData = oTable.fnGetData(nTr);
            aData=transferToJobRecord(jobsMap[jobNumber]);
            oTable.fnUpdate(aData,nTr);


            var status = data.JobStatus; 
            if(status==jobBeginLaunch||status==jobRunning){
                refreshProjectReport(jobNumber,nTr,true);
            } else {
                timerStop(jobNumber);
                refreshProjectReport(jobNumber,nTr,false);
            }


        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        }
    });
}


function  expandableRowClick(event){

    // do not expand or collapse when clicking the action labels: job-satart, job-pause,job-stop
    if(event.target.className.indexOf("action")>0){
        return;
    }
    var nTr = $(this)[0];
    if ( oTable.fnIsOpen(nTr) )
    {
        /* This row is already open - close it */
        // this.src = "../examples_support/details_open.png";
        oTable.fnClose( nTr );
    }
    else
    {
        /* Open this row */
        //this.src = "../examples_support/details_close.png";
        var aData = oTable.fnGetData( nTr );
        var jobNumber = aData[0];
        var jobDto=jobsMap[jobNumber];
        oTable.fnOpen( nTr, fnFormatDetails(jobDto), 'JobDetail' );

    }
}

/* Formating function for row details */
function fnFormatDetails ( job )
{
    var jobNumber = job.JobNumber;
    var expandRowObject= $(expandJobRow).clone();
    var expandRowNode = expandRowObject[0];
    expandRowObject.attr("id", expandRowObject.attr("id")+jobNumber);

    // projectInfo Form and some action source
    var projectInfoFormObject= expandRowObject.find(projectInfoForm);
    projectInfoFormObject.attr("id", projectInfoFormObject.attr("id")+jobNumber);
    var expandInfoSpanObject= expandRowObject.find(expandProjectInfoIcon);
    expandInfoSpanObject.attr("id", expandInfoSpanObject.attr("id")+jobNumber);
    var collapseInfoSpanObject= expandRowObject.find(collapseProjectInfoIcon);
    collapseInfoSpanObject.attr("id", collapseInfoSpanObject.attr("id")+jobNumber);
    var editInfoSpanObject= expandRowObject.find(editProjectInfoIcon);
    editInfoSpanObject.attr("id", editInfoSpanObject.attr("id")+jobNumber);
    var saveInfoSpanObject= expandRowObject.find(saveProjectInfoIcon);
    saveInfoSpanObject.attr("id", saveInfoSpanObject.attr("id")+jobNumber);
    var editInfoDivObject= expandRowObject.find(editProjectInfo);
    editInfoDivObject.attr("id", editInfoDivObject.attr("id")+jobNumber);
    var editProjectNameDiv= expandRowObject.find(editProjectName);
    editProjectNameDiv.attr("id", editProjectNameDiv.attr("id")+jobNumber);
    var editSourcePathDiv= expandRowObject.find(editSourcePath);
    editSourcePathDiv.attr("id", editSourcePathDiv.attr("id")+jobNumber);
    var viewInfoDivObject= expandRowObject.find(viewProjectInfo);
    viewInfoDivObject.attr("id", viewInfoDivObject.attr("id")+jobNumber);
    var viewProjectNameDiv= expandRowObject.find(viewProjectName);
    viewProjectNameDiv.attr("id", viewProjectNameDiv.attr("id")+jobNumber);
    var viewSourcePathDiv= expandRowObject.find(viewSourcePath);
    viewSourcePathDiv.attr("id", viewSourcePathDiv.attr("id")+jobNumber);

    // project Config Form and some action source
    var projectConfigFormObject= expandRowObject.find(projectConfigForm);
    projectConfigFormObject.attr("id", projectConfigFormObject.attr("id")+jobNumber);
    var expandConfigSpanObject= expandRowObject.find(expandProjectConfigIcon);
    expandConfigSpanObject.attr("id", expandConfigSpanObject.attr("id")+jobNumber);
    var collapseConfigSpanObject= expandRowObject.find(collapseProjectConfigIcon);
    collapseConfigSpanObject.attr("id", collapseConfigSpanObject.attr("id")+jobNumber);
    var editConfigSpanObject= expandRowObject.find(editProjectConfigIcon);
    editConfigSpanObject.attr("id", editConfigSpanObject.attr("id")+jobNumber);
    var saveConfigSpanObject= expandRowObject.find(saveProjectConfigIcon);
    saveConfigSpanObject.attr("id", saveConfigSpanObject.attr("id")+jobNumber);
    var uploadConfigSpanObject= expandRowObject.find(uploadProjectConfigIcon);
    uploadConfigSpanObject.attr("id", uploadConfigSpanObject.attr("id")+jobNumber);
    var projectConfigDiv= expandRowObject.find(projectConfig);
    projectConfigDiv.attr("id", projectConfigDiv.attr("id")+jobNumber);
    var projectConfigFileDiv= expandRowObject.find(projectConfigFile);
    projectConfigFileDiv.attr("id", projectConfigFileDiv.attr("id")+jobNumber);

    // project Report Form and some action source
    var projectReportFormObject= expandRowObject.find(projectReortForm);
    projectReportFormObject.attr("id", projectReportFormObject.attr("id")+jobNumber);
    var expandReportSpanObject= expandRowObject.find(expandProjectReportIcon);
    expandReportSpanObject.attr("id", expandReportSpanObject.attr("id")+jobNumber);
    var collapseReportSpanObject= expandRowObject.find(collapseProjectReportIcon);
    collapseReportSpanObject.attr("id", collapseReportSpanObject.attr("id")+jobNumber);
    var downloadReportSpanObject= expandRowObject.find(downloadProjectReportIcon);
    downloadReportSpanObject.attr("id", downloadReportSpanObject.attr("id")+jobNumber);
    var refreshReportSpanObject= expandRowObject.find(refreshProjectReportIcon);
    refreshReportSpanObject.attr("id", refreshReportSpanObject.attr("id")+jobNumber);
    var projectReportDiv= expandRowObject.find(projectReport);
    projectReportDiv.attr("id", projectReportDiv.attr("id")+jobNumber);


    // initial the input fileds
    viewProjectNameDiv.html(job.ProjectName);
    viewSourcePathDiv.html(job.SourcePath);

    projectConfigDiv.html(job.Configuration.Configuration);

    // get no data in the report
    projectReportDiv.html(job.Report.ReportContent);



    return expandRowObject.html();
}


$(document).ready(function() {

    pageSetUp();

    $.root_.removeClassPrefix('smart-style')
            .addClass('smart-style-3');

    /*
     * BASIC
     */

    $.ajax({
        type : "get",
        cache: false,
        url: "../api/jobs",
        data : "",
        cache :false,
        success : function(data) {
            jobsDto=data;
            loadJobs(jobsDto.Items);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        }
    });
    // fake the data
//    loadJobs(null);
    /*the expand and collapse row */
    $(document).delegate('#dt_basic tbody tr.odd','click',expandableRowClick);
    $(document).delegate('#dt_basic tbody tr.even','click',expandableRowClick);

    /* END BASIC */



})
