import sysConfig from '../config'
import UtilsService from '../services/UtilsService'
import AuthenticationService from '../services/AuthenticationService'

var getSiteList = function(siteId) {
    //jsonConditions {userId,tj}
    var jsonData = {
        dataType: "json",
        appName: sysConfig.appInfo.app_elite,
        appProject: sysConfig.appInfo.app_project_oa,
        appVersion: sysConfig.appInfo.app_version,
        serviceName: "siteService",
        methodName: "getSiteList",
		siteId:siteId
    };

    return UtilsService.eliteHttpGet(jsonData, { cache: true }, { includeUserErpAuth: false });
}


export default {
    getSiteList: getSiteList
}