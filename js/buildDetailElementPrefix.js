/**
 * Created by t_yuejial on 7/16/2014.
 */

//build view
var downloadBuildReportIcon="#download-build-report-icon";
var popoutBuildReportIcon="#popout-build-report-icon";
var buildViewInput="#buildView";
var buildViewBody="#buildViewBody";
var buildViewInfo="#buildViewInfo";
var buildViewFooter="#buildViewFooter";

function updateBuildView(buildNumber,jobName,rowIndex,totalNum){

    $(buildViewBody).find(downloadBuildReportIcon).attr("data-build-number",buildNumber);
    $(buildViewBody).find(downloadBuildReportIcon).attr("data-job-name",jobName);
    $(buildViewBody).find(popoutBuildReportIcon).attr("data-build-number",buildNumber);
    $(buildViewBody).find(popoutBuildReportIcon).attr("data-job-name",jobName);
    $(buildViewBody).find(buildViewInput).attr("data-build-number",buildNumber);
    $(buildViewBody).find(buildViewInput).attr("data-job-name",jobName);
    $(buildViewBody).find(buildViewInfo).html(jobName+" #"+buildNumber);
    $(buildViewBody).find(buildViewInfo).attr("data-index",rowIndex);
    $(buildViewBody).find(buildViewInfo).attr("data-totalNum",totalNum);
    $(buildViewBody).find(buildViewInfo).attr("data-job-name",jobName);
    $(buildViewBody).find(buildViewInfo).attr("data-build-number",buildNumber);


    $(viewPreBuild).removeClass("active");
    $(viewNextBuild).removeClass("active");
    if(rowIndex==0){
        $(viewNextBuild).addClass("active");
    }
    if(rowIndex==totalNum-1){
        $(viewPreBuild).addClass("active");
    }

     $.ajax({
     type : "get",
     cache: false,
     url: serviceUrl+"/api/jobs/" + jobName+"/report/"+buildNumber,
     success : function(data) {
         var reportResult=data["Report"];
         $(buildViewInput).text(reportResult);
     },
     error : function(XMLHttpRequest,
     textStatus, errorThrown) {
     //
     }

     });
}