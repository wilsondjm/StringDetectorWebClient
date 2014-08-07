/**
 * Created by t_yuejial on 7/14/2014.
 */
// category element
var categoryAll ="#category_all";
var categoryCreated = "#category_created";
var categoryRunning = "#category_running";
var categoryCompleted = "#category_completed";
// datatable basic
var dtBasicInfo="#dt_basic_info";
var pageGroup="#page-group";
var jobTablePanel="#jobTabPanel";
var dtBasicWrapper='#dt_basic_wrapper';
var dtBasic="#dt_basic";
var actionToolBar="#action_top_toolbar";

// create job modal
var createJobModal='#createJobModal';
var jobName="#jobName";
var upstreamProject="#upstreamProject";
;

var seperator="--"
//top job action bar
var topJobStart="#top_start_jobs";
var topJobStop="#top_stop_jobs";
var topJobDelete="#top_delete_jobs";
// top job filter
var topJobFilter ="#top_jobs_filter"

// job status
var running="Running";
var created="Created";
var completed="Completed";

// validation job name
var validation="validation";
// top create job
var topCreateJob="#top_create_job";
var createJobCancel="#createJobCancel";
var createJobSubmit="#createJobSubmit";
var createJobForm="#createJobForm";
var createJobModal="#createJobModal";
// history table
var historyTable ="#dt_history"+seperator;

// hide div
var expandJobDetail ="#expand_job_detail"+seperator;

// tab head
var step1Head="#step1Head";
var step2Head="#step2Head";
var step3Head="#step3Head";
var step4Head="#step4Head";

// tab panel
var step1Body="#wizard-1-step1"+seperator;
var step2Body="#wizard-1-step2"+seperator;
var step3Body="#wizard-1-step3"+seperator;
var step4Body="#wizard-1-step4"+seperator;



// hide div project basic setting form
var basicSettingForm= "#basic-setting-form"+seperator;
var  editProjectBasicIcon='#edit-project-basic-icon'+seperator;
var  saveProjectBasicIcon='#save-project-basic-icon'+seperator;
var  viewProjectBasic = "#view-project-basic"+seperator;
var  viewProjectName ="#viewProjectName"+seperator;
var  jobNameInput ="#jobNameInput"+seperator;
var  viewTiming ="#viewTiming"+seperator;
var  timingInput = "#timingInput"+seperator;

// hide div project scm setting form
var scmSettingForm = "#scm-setting-form"+seperator;
var editScmIcon="#edit-scm-icon"+seperator;
var saveScmIcon ="#save-scm-icon"+seperator;
var viewScm="#view-scm"+seperator;
// perforce scm
var perforceScm="#perforceScm"+seperator;
var perforceScmType="StringDetectorService.ReqResModel.PerforceSettingDto, StringDetectorService";
var viewP4Username="#viewP4Username"+seperator;
var p4UsernameInput="#p4UsernameInput"+seperator;
var viewP4Password="#viewP4Username"+seperator;
var p4PasswordInput ="#p4PasswordInput"+seperator;
var viewP4Prot="#viewP4Port"+seperator;
var p4PortInput="#p4PortInput"+seperator;
var viewP4WorkspaceName="#viewP4WorkspaceName"+seperator;
var p4WorkspaceNameInput="#p4WorkspaceNameInput"+seperator;
var viewP4Viewmap ="#viewP4Viewmap"+seperator;
var p4ViewmapInput="#p4ViewmapInput"+seperator;
// git scm
var gitScm="#gitScm"+seperator;
var gitScmType="StringDetectorService.ReqResModel.GitSettingDto, StringDetectorService";
var viewGitRepositoryUrl="#viewGitRepositoryUrl"+seperator;
var gitRepositoryUrlInput ="#gitRepositoryUrlInput"+seperator;
var viewGitName="#viewGitName"+seperator;
var gitNameInput="#gitNameInput"+seperator;
var viewGitBranch="#viewGitBranch"+seperator;
var gitBrancheInput="#gitBranchInput"+seperator;
//svn scm
var svnScm ="#svnScm"+seperator;
var svnScmType="StringDetectorService.ReqResModel.SVNSettingDto, StringDetectorService";
var viewSvnRepositoryUrl="#viewSvnRepositoryUrl"+seperator;
var svnRepositoryUrlInput="#svnRepositoryUrlInput"+seperator;
var viewSvnLocalModuleDir="#viewSvnLocalModuleDir"+seperator;
var svnLocalModuleDirInput="#svnLocalModuleDirInput"+seperator;

// hide div project configuration form
var projectConfigForm ="#project-config-form"+seperator;
var editProjectConfigIcon="#edit-project-config-icon"+seperator;
var saveProjectConfigIcon="#save-project-config-icon"+seperator;
var uploadProjectConfigIcon="#upload-project-config-icon"+seperator;
var projectConfig="#project-config"+seperator;
var projectConfigFile="#project-configuration-file"+seperator;
var viewProjectConfig="#viewProjectConfig"+seperator;
var projectConfigInput="#projectConfigInput"+seperator;

// hide div project report form
var projectReportForm ="#project-report-form"+seperator;
var downloadProjectReprotIcon ="#download-project-report-icon"+seperator;
var popoutProjectReprotIcon ="#popout-project-report-icon"+seperator;
var projectReport ="#project-report"+seperator;
var viewProjectReport ="#viewProjectReport"+seperator;
var projectReportInput ="#projectReportInput"+seperator;

// table action button group
var jobStart="#job-start"+seperator;
var jobStop="#job-stop"+seperator;
var jobDelete="#job-delete"+seperator;


var viewPreBuild="#viewPreBuild";
var viewNextBuild="#viewNextBuild";
var returnBuildList ="#returnBuildList";

/* Formating function for row details */
function getJobDetails ( job )
{
    var jobName = job.JobName;
    var expandJobDetailObject= $(expandJobDetail).clone();
    //var expandRowNode = expandJobDetailObject[0];
    expandJobDetailObject.attr("id", expandJobDetailObject.attr("id")+jobName);

    // project basic form  and some action source
    var projectBasicFormObject= expandJobDetailObject.find(basicSettingForm);
    projectBasicFormObject.attr("id", projectBasicFormObject.attr("id")+jobName);
    var editBasicSpanObject= expandJobDetailObject.find(editProjectBasicIcon);
    editBasicSpanObject.attr("id", editBasicSpanObject.attr("id")+jobName);
    var saveBasicSpanObject= expandJobDetailObject.find(saveProjectBasicIcon);
    saveBasicSpanObject.attr("id", saveBasicSpanObject.attr("id")+jobName);

    var viewProjectBasicDivObject= expandJobDetailObject.find(viewProjectBasic);
    viewProjectBasicDivObject.attr("id", viewProjectBasicDivObject.attr("id")+jobName);
    var viewProjectNameDivObject= expandJobDetailObject.find(viewProjectName);
    viewProjectNameDivObject.attr("id", viewProjectNameDivObject.attr("id")+jobName);
    var jobNameInputObject= expandJobDetailObject.find(jobNameInput);
    jobNameInputObject.attr("id", jobNameInputObject.attr("id")+jobName);
    var viewTimingDivObject= expandJobDetailObject.find(viewTiming);
    viewTimingDivObject.attr("id", viewTimingDivObject.attr("id")+jobName);
    var timingInputObject= expandJobDetailObject.find(timingInput);
    timingInputObject.attr("id", timingInputObject.attr("id")+jobName);

    // project scm setting form and some action source
    var scmSettingFormObject= expandJobDetailObject.find(scmSettingForm);
    scmSettingFormObject.attr("id", scmSettingFormObject.attr("id")+jobName);
    var editScmSpanObject= expandJobDetailObject.find(editScmIcon);
    editScmSpanObject.attr("id", editScmSpanObject.attr("id")+jobName);
    var saveScmSpanObject= expandJobDetailObject.find(saveScmIcon);
    saveScmSpanObject.attr("id", saveScmSpanObject.attr("id")+jobName);


    var viewScmDivObject= expandJobDetailObject.find(viewScm);
    viewScmDivObject.attr("id", viewScmDivObject.attr("id")+jobName);

    // perforce input
    var perforceScmObject= expandJobDetailObject.find(perforceScm);
    perforceScmObject.attr("id", perforceScmObject.attr("id")+jobName);
    var viewP4UsernameDivObject= expandJobDetailObject.find(viewP4Username);
    viewP4UsernameDivObject.attr("id", viewP4UsernameDivObject.attr("id")+jobName);
    var p4UsernameInputObject= expandJobDetailObject.find(p4UsernameInput);
    p4UsernameInputObject.attr("id", p4UsernameInputObject.attr("id")+jobName);
    var viewP4PasswordDivObject= expandJobDetailObject.find(viewP4Password);
    viewP4PasswordDivObject.attr("id", viewP4PasswordDivObject.attr("id")+jobName);
    var p4PasswordInputObject= expandJobDetailObject.find(p4PasswordInput);
    p4PasswordInputObject.attr("id", p4PasswordInputObject.attr("id")+jobName);
    var viewP4PortDivObject= expandJobDetailObject.find(viewP4Prot);
    viewP4PortDivObject.attr("id", viewP4PortDivObject.attr("id")+jobName);
    var p4PortInputObject= expandJobDetailObject.find(p4PortInput);
    p4PortInputObject.attr("id", p4PortInputObject.attr("id")+jobName);
    var viewP4WorkspaceDivObject= expandJobDetailObject.find(viewP4WorkspaceName);
    viewP4WorkspaceDivObject.attr("id", viewP4WorkspaceDivObject.attr("id")+jobName);
    var p4WorkspaceNameInputObject= expandJobDetailObject.find(p4WorkspaceNameInput);
    p4WorkspaceNameInputObject.attr("id", p4WorkspaceNameInputObject.attr("id")+jobName);
    var viewP4ViewmapDivObject= expandJobDetailObject.find(viewP4Viewmap);
    viewP4ViewmapDivObject.attr("id", viewP4ViewmapDivObject.attr("id")+jobName);
    var p4ViewmapInputObject= expandJobDetailObject.find(p4ViewmapInput);
    p4ViewmapInputObject.attr("id", p4ViewmapInputObject.attr("id")+jobName);

    // git input
    var gitScmObject= expandJobDetailObject.find(gitScm);
    gitScmObject.attr("id", gitScmObject.attr("id")+jobName);
    var viewGitRepositoryUrlDivObject= expandJobDetailObject.find(viewGitRepositoryUrl);
    viewGitRepositoryUrlDivObject.attr("id", viewGitRepositoryUrlDivObject.attr("id")+jobName);
    var gitRepositoryUrlInputObject= expandJobDetailObject.find(gitRepositoryUrlInput);
    gitRepositoryUrlInputObject.attr("id", gitRepositoryUrlInputObject.attr("id")+jobName);
    var viewGitNameDivObject= expandJobDetailObject.find(viewGitName);
    viewGitNameDivObject.attr("id", viewGitNameDivObject.attr("id")+jobName);
    var gitNameInputObject= expandJobDetailObject.find(gitNameInput);
    gitNameInputObject.attr("id", gitNameInputObject.attr("id")+jobName);
    var viewGitBranchDivObject= expandJobDetailObject.find(viewGitBranch);
    viewGitBranchDivObject.attr("id", viewGitBranchDivObject.attr("id")+jobName);
    var gitBranchInputObject= expandJobDetailObject.find(gitBrancheInput);
    gitBranchInputObject.attr("id", gitBranchInputObject.attr("id")+jobName);

    // svn input
    var svnScmObject= expandJobDetailObject.find(svnScm);
    svnScmObject.attr("id", svnScmObject.attr("id")+jobName);
    var viewSvnRepositoryUrlDivObject= expandJobDetailObject.find(viewSvnRepositoryUrl);
    viewSvnRepositoryUrlDivObject.attr("id", viewSvnRepositoryUrlDivObject.attr("id")+jobName);
    var svnRepositoryUrlInputObject= expandJobDetailObject.find(svnRepositoryUrlInput);
    svnRepositoryUrlInputObject.attr("id", svnRepositoryUrlInputObject.attr("id")+jobName);
    var viewSvnLocalModuleDirDivObject= expandJobDetailObject.find(viewSvnLocalModuleDir);
    viewSvnLocalModuleDirDivObject.attr("id", viewSvnLocalModuleDirDivObject.attr("id")+jobName);
    var svnLocalModuleDirInputObject= expandJobDetailObject.find(svnLocalModuleDirInput);
    svnLocalModuleDirInputObject.attr("id", svnLocalModuleDirInputObject.attr("id")+jobName);


    // project Config Form and some action source
    var projectConfigFormObject= expandJobDetailObject.find(projectConfigForm);
    projectConfigFormObject.attr("id", projectConfigFormObject.attr("id")+jobName);
    var editConfigSpanObject= expandJobDetailObject.find(editProjectConfigIcon);
    editConfigSpanObject.attr("id", editConfigSpanObject.attr("id")+jobName);
    var saveConfigSpanObject= expandJobDetailObject.find(saveProjectConfigIcon);
    saveConfigSpanObject.attr("id", saveConfigSpanObject.attr("id")+jobName);
    var uploadConfigSpanObject= expandJobDetailObject.find(uploadProjectConfigIcon);
    uploadConfigSpanObject.attr("id", uploadConfigSpanObject.attr("id")+jobName);
    var projectConfigDivObject= expandJobDetailObject.find(projectConfig);
    projectConfigDivObject.attr("id", projectConfigDivObject.attr("id")+jobName);
    var projectConfigFileDivObject= expandJobDetailObject.find(projectConfigFile);
    projectConfigFileDivObject.attr("id", projectConfigFileDivObject.attr("id")+jobName);
    var viwProjectConfigDivObject= expandJobDetailObject.find(viewProjectConfig);
    viwProjectConfigDivObject.attr("id", viwProjectConfigDivObject.attr("id")+jobName);
    var projectConfigInputObject= expandJobDetailObject.find(projectConfigInput);
    projectConfigInputObject.attr("id", projectConfigInputObject.attr("id")+jobName);


    // project Report Form and some action source
    var projectReportFormObject= expandJobDetailObject.find(projectReportForm);
    projectReportFormObject.attr("id", projectReportFormObject.attr("id")+jobName);
    projectReportFormObject.find("header span:first").text(jobName+" Last Build");
    var downloadReportSpanObject= expandJobDetailObject.find(downloadProjectReprotIcon);
    downloadReportSpanObject.attr("id", downloadReportSpanObject.attr("id")+jobName);
    var popoutReportSpanObject= expandJobDetailObject.find(popoutProjectReprotIcon);
    popoutReportSpanObject.attr("id", popoutReportSpanObject.attr("id")+jobName);
    var projectReportDiv= expandJobDetailObject.find(projectReport);
    projectReportDiv.attr("id", projectReportDiv.attr("id")+jobName);
    var viwProjectReportDivObject= expandJobDetailObject.find(viewProjectReport);
    viwProjectReportDivObject.attr("id", viwProjectReportDivObject.attr("id")+jobName);
    var projectReportInputObject= expandJobDetailObject.find(projectReportInput);
    projectReportInputObject.attr("id", projectReportInputObject.attr("id")+jobName);

    expandJobDetailObject.find(viewPreBuild).attr("data-job-name",jobName);
    expandJobDetailObject.find(viewNextBuild).attr("data-job-name",jobName);
    expandJobDetailObject.find(returnBuildList).attr("data-job-name",jobName);


    // tab panel
    var step1BodyObject = expandJobDetailObject.find(step1Body);
    step1BodyObject.attr("id",step1BodyObject.attr("id")+jobName);
    var step2BodyObject = expandJobDetailObject.find(step2Body);;
    step2BodyObject.attr("id",step2BodyObject.attr("id")+jobName);
    var step3BodyObject = expandJobDetailObject.find(step3Body);;
    step3BodyObject.attr("id",step3BodyObject.attr("id")+jobName);
    var step4BodyObject = expandJobDetailObject.find(step4Body);;
    step4BodyObject.attr("id",step4BodyObject.attr("id")+jobName);

    var step1HeadObject = expandJobDetailObject.find(step1Head);
    step1HeadObject.attr("href",step1HeadObject.attr("href")+jobName);
    var step2HeadObject = expandJobDetailObject.find(step2Head);
    step2HeadObject.attr("href",step2HeadObject.attr("href")+jobName);
    var step3HeadObject = expandJobDetailObject.find(step3Head);
    step3HeadObject.attr("href",step3HeadObject.attr("href")+jobName);
    var step4HeadObject = expandJobDetailObject.find(step4Head);
    step4HeadObject.attr("href",step4HeadObject.attr("href")+jobName);

    // history datatables
    var historyTableObject=expandJobDetailObject.find(historyTable);
    historyTableObject.attr("id",historyTableObject.attr("id")+jobName);
    return expandJobDetailObject.html();
}