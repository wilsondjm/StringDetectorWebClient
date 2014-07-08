/**
 * Created by t_yuejial on 4/28/2014.
 */
// DO NOT REMOVE : GLOBAL FUNCTIONS!
// gloable varaiable
var  oTable;
var  jobsDto;
var  jobsMap={};
var  configurationsMap={};
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


// regist action listener
function registJobFormListener(jobName){
    // project info  
//  $(document).delegate(expandProjectInfoIcon+jobName,'click',expandProjectInfoClick);
//  $(document).delegate(collapseProjectInfoIcon+jobName,'click',collapseProjectInfoClick);
//  $(document).delegate(editProjectInfoIcon+jobName,'click',editProjectInfoClick);
//  $(document).delegate(saveProjectInfoIcon+jobName,'click',saveProjectInfoClick);
//
//  // project config
    $(document).delegate(expandProjectConfigIcon+jobName,'click',expandProjectConfigClick);
    $(document).delegate(collapseProjectConfigIcon+jobName,'click',collapseProjectConfigClick);
    $(document).delegate(editProjectConfigIcon+jobName,'click',editProjectConfigClick);
    $(document).delegate(saveProjectConfigIcon+jobName,'click',saveProjectConfigClick);
    $(document).delegate(uploadProjectConfigIcon+jobName,'click',uploadProjectConfigClick);
    $(document).delegate(projectConfigFile+jobName,'change',changeProjectConfigClick);
//
//  // project report
    $(document).delegate(expandProjectReportIcon+jobName,'click',expandProjectReportClick);
    $(document).delegate(collapseProjectReportIcon+jobName,'click',collapseProjectReportClick);
    $(document).delegate(downloadProjectReportIcon+jobName,'click',downloadProjectReportClick);
    $(document).delegate(refreshProjectReportIcon+jobName,'click',refreshProjectReportClick);

    //job  action
    $(document).delegate(jobStart+jobName,'click',jobStartClick);
    $(document).delegate(jobStop+jobName,'click',jobStopClick);

}

function editProjectConfigClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    // check the collapse-expand state
    if( $(projectConfigForm+jobName+" fieldset").is(":hidden")){
        $(projectConfigForm+jobName+" fieldset").slideToggle(500);
        $(expandProjectConfigIcon+jobName).hide();
        $(collapseProjectConfigIcon+jobName).show();
    }
    // toggle the edit-save icon
    $( editProjectConfigIcon+jobName).hide();
    $(saveProjectConfigIcon+jobName).show();
    // toggle the edit-view state
    $(projectConfig+jobName).removeAttr('disabled');
    $(projectConfig+jobName).focus();
}
function expandProjectConfigClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    $(projectConfigForm+jobName+" fieldset").slideToggle(500);
    var expandSpan = $(collapseProjectConfigIcon+jobName);
    $(this).hide();
    expandSpan.show();
}
function collapseProjectConfigClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    $(projectConfigForm+jobName+" fieldset").slideToggle(500);
    var expandSpan = $(expandProjectConfigIcon+jobName);
    $(this).hide();
    expandSpan.show();
}
function saveProjectConfigClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];

    // paste the exsisting content into input filed
    var configContent=$(projectConfig+jobName).val();
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
            $(projectConfig+jobName).prop('disabled',"true");

            // toggle the edit-save icon
            $(editProjectConfigIcon+jobName).show();
            $(saveProjectConfigIcon+jobName).hide();

        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
        }
    });
    
    $(projectConfig+jobName).prop('disabled',"true");

            // toggle the edit-save icon
            $(editProjectConfigIcon+jobName).show();
            $(saveProjectConfigIcon+jobName).hide();
}
function uploadProjectConfigClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr").prev()[0];
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
function expandProjectReportClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    $(projectReortForm+jobName+" fieldset").slideToggle(500);
    var expandSpan = $(collapseProjectReportIcon+jobName);
    $(this).hide();
    expandSpan.show();
}
function collapseProjectReportClick(){
	var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    $(projectReortForm+jobName+" fieldset").slideToggle(500);
    var expandSpan = $(expandProjectReportIcon+jobName);
    $(this).hide();
    expandSpan.show();
}
function downloadProjectReportClick(){}
function refreshProjectReportClick(){
	
}

// action listener of job action
function jobStartClick(){
  if(  $(this).hasClass("active")){
      return;
  }

    var spiltArray = $(this).attr("id").split("-");
    var jobNumber = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr")[0];

    // start the job
    $.ajax({
        type : "post",
        cache: false,
        url: "../api/jobs/" + jobNumber + "/start",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
         
            // 
            var aData = oTable.fnGetData(nTr);
            aData=transferToJobRecord(jobsMap[jobNumber]);
            oTable.fnUpdate(aData,nTr);

            // trigger expand row
            if ( !oTable.fnIsOpen(nTr) )
            {
                /* Open this row */
                //this.src = "../examples_support/details_close.png";
                aData = oTable.fnGetData( nTr );
                jobNumber = aData[0];
                var jobDto=jobsMap[jobNumber];
                oTable.fnOpen( nTr, fnFormatDetails(jobDto), 'JobDetail' );
            }

            // expand the report  and collapse the info and configuration form
            // collapse the project info
            if($(expandProjectInfoIcon+jobNumber).is(":hidden")){
                $(collapseProjectInfoIcon+jobNumber).trigger("click");
            }
            // collapse the project configuration
            if($(expandProjectConfigIcon+jobNumber).is(":hidden")){
                $(collapseProjectConfigIcon+jobNumber).trigger("click");
            }

            // expand the project report
            if($(collapseProjectReportIcon+jobNumber).is(":hidden")){
                $(expandProjectReportIcon+jobNumber).trigger("click");
            }

            // trigger refreshing
          //  $(refreshProjectReportIcon+jobNumber).trigger('click');
            timersMap[jobNumber].play();
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobNumber).removeClass("active");
        }
    });


}

function jobStopClick(){
    if(  $(this).hasClass("active")){
        return;
    }
    var spiltArray = $(this).attr("id").split("-");
    var jobName = spiltArray[spiltArray.length-1];
    var nTr = $(this).parents("tr")[0];
    
    $.ajax({
        type : "delete",
        cache: false,
        url: "../api/jobs/" + jobName + "/stop",
        data: null,
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success : function(data) {
        	alert("Job - " + jobName + " stop request accepted");
        	$(jobStart+jobNumber).removeClass("active");
    		$(jobStop+jobNumber).addClass("active");
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
            $(jobStart+jobNumber).removeClass("active");
        }
    });

    
}
//for datatables
function transferToJobRecord(job){
    var actionStr;
    var state =job.lastBuildStatus;

    var actionStr1 = '<div class="btn-group action" data-toggle="buttons">' +
                        '<label class="btn btn-default btn-xs action ' ;
      //  ' active'
    var actionStr2=     '" id="job-start-'+job.jobName+'" ><input type="radio" name="style-a1" id="style-a1"> ' +
                                     '<i class="fa fa-play action"></i>' +
                        '</label>' +
//                      '<label class="btn btn-default btn-xs action ' ;
//    //  'active'
//  var actionStr3=     '" id="job-pause-'+job.jobName+'" ><input type="radio" name="style-a2" id="style-a2"> ' +
//                                  '<i class="fa fa-pause action"></i>' +
//                       '</label>' +
                         '<label class="btn btn-default btn-xs action ' ;
     //   'active'
     var actionStr4=     '" id="job-stop-'+job.jobName+'" ><input type="radio" name="style-a2" id="style-a3">' +
                                 ' <i class="fa fa-stop action"></i>' +
                         '</label>' +
                     '</div>';
      if(!(state=="True" || state == "Completed")) {
          actionStr = actionStr1+'active'+actionStr2+
//        actionStr3+
          actionStr4;
          // do something such as refresh  report
      }
      else {
          actionStr = actionStr1+actionStr2+
//        actionStr3+
		  'active'+actionStr4;
          // do something such as stop refreshing
      }


    var record = [];
    record.push(job.jobName);
    record.push(job.lastBuildColor);
    record.push(job.lastBuildStatus);
    record.push(actionStr);
    return record;
}

function startContinusRefreshing(jobName){
    // alert("This message is  sent by  timer-"+jobNumber);
   var nTr= $(jobStart+jobName).parents("tr")[0];
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
			var completed = JobReportData.Completed;
			if( completed == "True"){
				jobsMap[jobName].lastBuildColor = "Red";
				jobsMap[jobName].lastBuildStatus = "Completed";
				UpdateProjectDisplayData(jobName, JobReportData.Report, true);
				$(refreshProjectReportIcon+JobReportData.jobName+" a i").removeClass("fa-spin");
				timersMap[jobName].stop();
			}else{
				jobsMap[jobName].lastBuildColor = "Green";
				jobsMap[jobName].lastBuildStatus = "Running";
				UpdateProjectDisplayData(jobName, JobReportData.Report, false);
			//	refreshProject((jobName, JobReportData.offset);
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
    $(projectReport + jobName).val(report);
    $(projectReport + jobName).scrollTop($(projectReport + jobName)[0].scrollHeight);
       
	var nTr= $(jobStart+jobName).parents("tr")[0];
	var aData = oTable.fnGetData(nTr);
    aData=transferToJobRecord(jobsMap[jobName]);
    oTable.fnUpdate(aData,nTr);
}

function LoadConfigurations(jobName)
{
	$.ajax({
        type : "get",
        cache: false,
        url: "../api/Configuration/" + jobName,
        cache :false,
        success : function(data) {
            var jobConfig=data;
            configurationsMap[jobConfig.jobName] = jobConfig.configuration;
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
                         	//
        }
    });
}

/*Functions to format the jobs data*/
function loadJobs(jobs){
    // use the fake data
    var  jobRecords=[];

    $.each(jobs,function(i,job){
        registJobFormListener(job.jobName);
// 		alert(index + ": " + value);
        jobRecords.push(transferToJobRecord(job));
        jobsMap[job.jobName]=job;
    });

    oTable= $('#dt_basic').dataTable({
        "sPaginationType" : "bootstrap_full",
        "aaData": jobRecords,
        "aoColumnDefs" : [
        	{"aTargets" : [3],
        	"bSortable": false,
        	"bSearchable": false
        	}
        ]
    });
    
    $.each(jobs,function(i,job){
    	LoadConfigurations(job.jobName);
    	var timer = $.timer(function(){
            startContinusRefreshing(job.jobName);
        });
        timer.set({time:3000,autostart:false});
        timersMap[job.jobName]=timer;
    });
}

/*Click Actions handlers*/
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
        var jobName = aData[0];
        var job=jobsMap[jobName];
        oTable.fnOpen( nTr, fnFormatDetails(job), 'JobDetail' );

    }
}

/* Formating function for row details */
function fnFormatDetails ( job )
{
    var jobName = job.jobName;
    var expandRowObject= $(expandJobRow).clone();
    var expandRowNode = expandRowObject[0];
    expandRowObject.attr("id", expandRowObject.attr("id")+jobName);

    // projectInfo Form and some action source
    var projectInfoFormObject= expandRowObject.find(projectInfoForm);
    projectInfoFormObject.attr("id", projectInfoFormObject.attr("id")+jobName);
    var expandInfoSpanObject= expandRowObject.find(expandProjectInfoIcon);
    expandInfoSpanObject.attr("id", expandInfoSpanObject.attr("id")+jobName);
    var collapseInfoSpanObject= expandRowObject.find(collapseProjectInfoIcon);
    collapseInfoSpanObject.attr("id", collapseInfoSpanObject.attr("id")+jobName);
    var editInfoSpanObject= expandRowObject.find(editProjectInfoIcon);
    editInfoSpanObject.attr("id", editInfoSpanObject.attr("id")+jobName);
    var saveInfoSpanObject= expandRowObject.find(saveProjectInfoIcon);
    saveInfoSpanObject.attr("id", saveInfoSpanObject.attr("id")+jobName);
    var editInfoDivObject= expandRowObject.find(editProjectInfo);
    editInfoDivObject.attr("id", editInfoDivObject.attr("id")+jobName);
    var editProjectNameDiv= expandRowObject.find(editProjectName);
    editProjectNameDiv.attr("id", editProjectNameDiv.attr("id")+jobName);
    var editSourcePathDiv= expandRowObject.find(editSourcePath);
    editSourcePathDiv.attr("id", editSourcePathDiv.attr("id")+jobName);
    var viewInfoDivObject= expandRowObject.find(viewProjectInfo);
    viewInfoDivObject.attr("id", viewInfoDivObject.attr("id")+jobName);
    var viewProjectNameDiv= expandRowObject.find(viewProjectName);
    viewProjectNameDiv.attr("id", viewProjectNameDiv.attr("id")+jobName);
    var viewSourcePathDiv= expandRowObject.find(viewSourcePath);
    viewSourcePathDiv.attr("id", viewSourcePathDiv.attr("id")+jobName);

    // project Config Form and some action source
    var projectConfigFormObject= expandRowObject.find(projectConfigForm);
    projectConfigFormObject.attr("id", projectConfigFormObject.attr("id")+jobName);
    var expandConfigSpanObject= expandRowObject.find(expandProjectConfigIcon);
    expandConfigSpanObject.attr("id", expandConfigSpanObject.attr("id")+jobName);
    var collapseConfigSpanObject= expandRowObject.find(collapseProjectConfigIcon);
    collapseConfigSpanObject.attr("id", collapseConfigSpanObject.attr("id")+jobName);
    var editConfigSpanObject= expandRowObject.find(editProjectConfigIcon);
    editConfigSpanObject.attr("id", editConfigSpanObject.attr("id")+jobName);
    var saveConfigSpanObject= expandRowObject.find(saveProjectConfigIcon);
    saveConfigSpanObject.attr("id", saveConfigSpanObject.attr("id")+jobName);
    var uploadConfigSpanObject= expandRowObject.find(uploadProjectConfigIcon);
    uploadConfigSpanObject.attr("id", uploadConfigSpanObject.attr("id")+jobName);
    var projectConfigDiv= expandRowObject.find(projectConfig);
    projectConfigDiv.attr("id", projectConfigDiv.attr("id")+jobName);
    var projectConfigFileDiv= expandRowObject.find(projectConfigFile);
    projectConfigFileDiv.attr("id", projectConfigFileDiv.attr("id")+jobName);

    // project Report Form and some action source
    var projectReportFormObject= expandRowObject.find(projectReortForm);
    projectReportFormObject.attr("id", projectReportFormObject.attr("id")+jobName);
    var expandReportSpanObject= expandRowObject.find(expandProjectReportIcon);
    expandReportSpanObject.attr("id", expandReportSpanObject.attr("id")+jobName);
    var collapseReportSpanObject= expandRowObject.find(collapseProjectReportIcon);
    collapseReportSpanObject.attr("id", collapseReportSpanObject.attr("id")+jobName);
    var downloadReportSpanObject= expandRowObject.find(downloadProjectReportIcon);
    downloadReportSpanObject.attr("id", downloadReportSpanObject.attr("id")+jobName);
    var refreshReportSpanObject= expandRowObject.find(refreshProjectReportIcon);
    refreshReportSpanObject.attr("id", refreshReportSpanObject.attr("id")+jobName);
    var projectReportDiv= expandRowObject.find(projectReport);
    projectReportDiv.attr("id", projectReportDiv.attr("id")+jobName);


    // initial the input fileds
    viewProjectNameDiv.html(job.jobName);
    viewSourcePathDiv.html("C:/dfdfdfd");

    projectConfigDiv.html(configurationsMap[job.jobName]);

    // get no data in the report
    projectReportDiv.html(job.Report);



    return expandRowObject.html();
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
            jobsDto=data;
            loadJobs(jobsDto);
        },
        error : function(XMLHttpRequest,
                         textStatus, errorThrown) {
                         	//
        }
    });
    
    /*Regist the row click action to expand the row details*/
    $(document).delegate('#dt_basic tbody tr.odd','click',expandableRowClick);
    $(document).delegate('#dt_basic tbody tr.even','click',expandableRowClick);

})