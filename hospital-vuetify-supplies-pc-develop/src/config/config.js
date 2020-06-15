var oauth = {
	//baseOAuthUrl: "http://172.17.30.221:9098/",
	//请求授权地址
	userAuthorizationUri: process.env.VUE_APP_OAUTH_URI,
	//accessToken请求地址
	accessTokenUri: "/oauth/token",
	//用户信息请求地址
	userInfoUri: "/user/userinfo",
	//登出请求地址
	logoutUri: process.env.VUE_APP_LOGOUT_URI,
	//项目地址
	localUri: process.env.VUE_APP_API_LOCAL_URI,
	redirectUri: process.env.VUE_APP_REDIRECT_URI,//"http://localhost:8080/login",//
	//案例资源服务器地址
	//resUri: "http://172.17.30.221:9093",
	//客户端相关标识，请从认证服务器申请
	clientId:  process.env.VUE_APP_CLIENT_ID,
	clientSecret: "123456",
	//申请的权限范围
	scope: "read",
	//可选参数，客户端的当前状态，可以指定任意值，用于校验，此次案例不做相关认证
	state: "",
	//一些固定的请求参数
	responseType: "code",
	grantType: "authorization_code",
	code: "",
}

var app = {
	name: 'TMS管理系统',
	abbreviationName: '运输系统',
	version: 'v1.0.0',
	copyright: '版权所有 © 2019 广西柳州医药股份有限公司<br/>Corporation All rights reserved.',
	routerPath: 'router/paths',
	appPath: 'views/Main.vue',
	menuType: 'vue-tms',
	apiUrl: "",
	faviconPath: 'assets/logo.svg',
	logoPath: 'assets/logo.svg',
	gridListStyle: 'grid-list-sm',
	toolbarColor: 'blue darken-3',
	
	userMenu: [], //用户授权菜单
	topMenu: [], //第一级菜单
	rootMenuId: 50,
	mainStyle: 'balanced', //'dark',//
	
	appSessionUserKey: "lzyyUser",
	pathPrefix: "v", //路径前缀
	canExitApp: false,
	isWeixinClient: false,
}

export default {
	oauth,
	app
};
