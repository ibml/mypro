import sysConfig from '../config'
import UtilsService from './UtilsService'

export default {
	getCurrentUser: function() {
		//JSON.parse(jsonstr); //可以将json字符串转换成json对象 
		return JSON.parse(window.sessionStorage.getItem(sysConfig.appConfig.appSessionUserKey));
	},
	setCurrentUser: function(user) {
		//console.log("-AuthenticationService---user-",user);
		window.sessionStorage.setItem(sysConfig.appConfig.appSessionUserKey, JSON.stringify(user)); //JSON.stringify(jsonobj); //可以将json对象转换成json对符串 
		//cookies.lastLoginUser=user.userInfo.user_code;
	},
	isLogged: function() {
		var user = this.getCurrentUser();
		if (user) {
			/* if (typeof(user.token) != "undefined" && user.token !== '') {
			   return true;
			 } */
			//console.log('user', user)
			if (typeof(user.userInfo) != "undefined" && typeof(user.userInfo.user_id) != "undefined" && user.userInfo.user_id !==
				'') {
				return true;
			}
		}
		return false;
	},
	getUserId: function() {
		return this.getCurrentUser().userInfo.user_id; //获取elite账号id
	},
	getUserCode: function() {
		return this.getCurrentUser().userInfo.user_code; //获取elite账号
	},
	getErpCode: function() {
		if (!UtilsService.isEmpty(this.getCurrentUser()) && !UtilsService.isEmpty(this.getCurrentUser().userErpAuth)) {
			return this.getCurrentUser().userErpAuth.code1; //获取erp账号
		} else {
			return null;
		}
	},
	getUserToken: function() {
		var user = this.getCurrentUser();
		if (user) {
			if (typeof(user.token) != "undefined" && user.token !== '') {
				return user.token;
			}
		}
		return '';
	},
	logout: function() {
		//window.sessionStorage.removeItem(sysConfig.appConfig.appSessionUserKey);
		UtilsService.initSessionStorage(); //初始化session数据
	}
}
