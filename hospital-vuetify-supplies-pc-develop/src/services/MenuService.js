import sysConfig from '../config'
import UtilsService from '../services/UtilsService'
import AuthenticationService from '../services/AuthenticationService'
import CommonService from "@/services/CommonService";

var getUserMenuList = function() {
    //jsonConditions {userId,tj}
	var user=AuthenticationService.getCurrentUser().userInfo;
    var jsonData = {
        dataType: "json",
       /* appName: sysConfig.appInfo.app_name,
        appProject: sysConfig.appInfo.app_project_oa,
        appVersion: sysConfig.appInfo.app_version,
        serviceName: "menuService",
        methodName: "getUserMenuList", */
        userId: AuthenticationService.getUserId(),
        tj: " and menu_type='"+sysConfig.defualtApp.menuType+"'",//elite用的
		// tj: "and b.menu_type_code = '"+sysConfig.defualtApp.menuType+"'  and a.site_id='"+user.site_id+"' "
    };

	return	CommonService.executeService("menuService", "getUserMenuList", jsonData, 'get');
					
    //return UtilsService.eliteHttpGet(jsonData, { cache: true }, { includeUserErpAuth: false });
}
var getMenuList = function(menuId) {
    //jsonConditions {userId,tj}
    var jsonData = {
        dataType: "json",
       /* appName: sysConfig.appInfo.app_name,
        appProject: sysConfig.appInfo.app_project_oa,
        appVersion: sysConfig.appInfo.app_version,
        serviceName: "menuService",
        methodName: "getMenuList", */
        menuId: menuId
    };
	
	return	CommonService.executeService("menuService", "getMenuList", jsonData, 'get');
    //return UtilsService.eliteHttpGet(jsonData, { cache: true }, { includeUserErpAuth: false });
}

export default {
    getUserMenuList: getUserMenuList,
    getMenuList: getMenuList
}