import Vue from 'vue'
import vuetify from './plugins/vuetify';
import './plugins/element';
import './plugins/xlsx';

import config from './config'
import UtilsService from '@/services/UtilsService';
import CommonService from '@/services/CommonService';
import AuthenticationService from '@/services/AuthenticationService';

import echarts from 'echarts'


import router from "./router/"; //默认路由
import store from "./store/";
import filters from "./filters/" //过滤器


//加载自定义控件
import {
	MDialogPlugin,
	MSnackBarPlugin,
	TabViews,
	registeTabsView
} from 'magicbox-vuetify-components'; //magicbox-vuetify-components
Vue.use(MDialogPlugin, {
	vuetify
});
Vue.use(MSnackBarPlugin, {
	vuetify
});
registeTabsView(store.store);
Vue.component(TabViews.name, TabViews);


Vue.config.productionTip = false
Vue.prototype._sysConfig = config;

Vue.prototype.$utilsService = UtilsService;
Vue.prototype.$commonService = CommonService;
Vue.prototype.$authenticationService = AuthenticationService;


Vue.prototype.$echarts = echarts;
window.echarts=echarts;


//自定义过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
	// 当被绑定的元素插入到 DOM 中时……
	inserted: function (el, {
		value
	}) {
		if (value) {
			// 聚焦元素
			setTimeout(() => {
				el.children[1].children[0].focus()
			}, 500)
		}
	}
});

new Vue({
	vuetify,
	router,
	store: store.store,
	render(createElement) { //根据配置动态app组件
		let {
			appPath
		} = config.defualtApp
		return createElement(require("@/" + appPath).default);
	},
	mounted() {
		const faviconLink = document.querySelector("link[type='image/x-icon']"); //IE 8+ 兼容
		const title = document.querySelector("title"); //IE 8+ 兼容
		if (faviconLink && faviconLink.setAttribute) {
			faviconLink.setAttribute("href", require("@/" + config.app.faviconPath));
		}
		if (title && title.setAttribute) {
			//title.setAttribute("value", '111');
		}
	}
}).$mount("#app");