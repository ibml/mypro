import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import config from '../config/config'
import AuthenticationService from "../services/AuthenticationService";
import UtilsService from '../services/UtilsService';

var routes = function() {
	let {
		routerPath
	} = config.app
	return require("@/" + routerPath).default;
}

Vue.use(Router);
const router = new Router({
	routes: routes()
});

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error)
}
router.beforeEach(async (to, from, next) => {
	NProgress.start();
	//console.log('router',to,from)
	if (!router.getMatchedComponents(to.path).length) {
		try {
			next()
		} catch (error) {
			console.log(error)
			//出错跳到登录
			next({
				path: '/',// '/login'
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {
		if (to.matched.length === 0) {
			//匹配不到路由,取消导航(已经存在于路由表内，但是由于页面没有配置好会触发)
			return;
		} else {
			if (to.meta.requireAuth === true) { // 判断该路由是否需要登录权限
				if (AuthenticationService.isLogged()) {
					//将异步操作转为同步操作否则会影响参数初始化
					await UtilsService.initeParams(to)
					next();
				} else {
					next({
						path: '/', // '/login'
						query: {
							redirect: to => {
								return to.fullPath
							}
						} // 将跳转的路由path作为参数，登录成功后跳转到该路由
					});
				}
			} else {
				next();
			}
		}
	}
})

router.afterEach((to, from) => {
	NProgress.done();
});


export default router;
