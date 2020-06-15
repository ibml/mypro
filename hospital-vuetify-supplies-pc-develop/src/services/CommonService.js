import sysConfig from '../config'
import UtilsService from '../services/UtilsService'
import AuthenticationService from '../services/AuthenticationService'

//jsonConditions：cache=true使用缓存，includeUserErpAuth=true包含erp参数
var executeService = function(serviceName, methodName, jsonConditions, isHttpGet, apiUrl) {
	var jsonData = {
		appName: sysConfig.appInfo.app_name,
		appVersion: sysConfig.appInfo.app_version,
		code1: AuthenticationService.getErpCode(),
		serviceName: serviceName,
		methodName: methodName
	};

	Object.assign(jsonData, jsonConditions) //合并json

	var httpConfig = {}
	var userConfig = {}
	httpConfig.cache = true; //是否缓存
	if (!UtilsService.isUndefined(jsonConditions.cache)) {
		httpConfig.cache = jsonConditions.cache;
	}
	userConfig.includeUserErpAuth = false;
	if (!UtilsService.isUndefined(jsonConditions.includeUserErpAuth)) {
		userConfig.includeUserErpAuth = jsonConditions.includeUserErpAuth;
	}
	var _apiUrl = sysConfig.defualtApp.apiUrl;
	if (apiUrl && apiUrl != '') {
		_apiUrl = apiUrl;
	}

	var _isHttpGet=true;//默认get
	if (typeof (isHttpGet) !== "boolean") {
		if(isHttpGet.toLowerCase()=='post'){
			_isHttpGet=false;
		}
	}else{
		_isHttpGet=isHttpGet;
	}
	return UtilsService.getDataByHttp(_apiUrl, jsonData, httpConfig, userConfig, _isHttpGet);
}

export default {
	executeService: executeService
}
