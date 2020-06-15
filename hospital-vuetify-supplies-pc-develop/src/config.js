var appInfo = {

	//更新代码用（手机）(处方医疗卡查询用到)
	elite_url1: "https://www.lzyy.cn:5092/com.elite.mis/webapi/getData",
	//http://192.192.193.4:4980/com.elite.mis/webapi/getData", //脑壳内网 elite_url: "http://172.16.60.18:4980/com.elite.mis/webapi/getData", //脑科(菜单id为56)

	app_recipe_imgurl: "https://mapi.bbwyy.com.cn", //

	app_name: "com.elite.mis",
	app_elite: "com.elite.mis",
	app_project_oa: "oa",
	app_project_wms: "wms",
	app_project_erp: "erp",
	app_project_dtc: "dtc",
	app_version: ""
};

const appConfig = {
	userMenu: [], //用户授权菜单
	topMenu: [], //第一级菜单
	rootMenuId: 50,
	mainStyle: 'balanced', //'dark',//

	appSessionUserKey: "lzyyUser",
	pathPrefix: "v", //路径前缀
	canExitApp: false,
	isWeixinClient: false,
};

const appList = {
	'prescription': {
		systemName: '臻药网',
		version: 'v1.0',
		copyright: '版权所有 © 2018 广西柳州医药股份有限公司<br/>Corporation All rights reserved.',
		routerPath: 'projects/prescription/router',
		appPath: 'views/Main.vue',
		menuType: 'vue-rx',

		apiUrl: "https://papi.bbwyy.com.cn/com.magicbox.web.zkadmin/api/executeCall", //上线用
		addTRTC: true,
		faviconPath: 'assets/logo.png',
		elementUI: true
	},
	'supplies': {
		systemName: 'SPD耗材管理系统',
		version: 'v2.0',
		copyright: '版权所有 © 2020 广西柳州医药股份有限公司<br/>Corporation All rights reserved.',
		routerPath: 'router/index.js',
		appPath: 'views/Main.vue',
		menuType: 'vue-supplies-pc',
		//apiUrl: "http://13.10.123.159:4980/com.elite.mis/webapi/mobile",
		//apiUrl:"http://172.16.51.192:4980/com.elite.mis/webapi/mobile", //武宣人医
		apiUrl:"http://172.16.31.252:4980/com.elite.mis/webapi/mobile",
		faviconPath: 'assets/logo.png',
		elementUI: true,
		
	}
};
//更换不同的项目配置
const defualtApp = appList['supplies'];



export default {
	appInfo,
	appConfig,
	defualtApp
}