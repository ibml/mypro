module.exports = {
	lintOnSave: false,
	publicPath: './',
	devServer: {
		proxy: {
			'/admin': {
				target: process.env.VUE_APP_API_ADMIN_URI,//'http://172.17.30.221:9093',
				ws: true, //是否代理websockets
				changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
				pathRewrite:{
					'^/admin':'/admin'//代理的路径
				}
			},
			'/tms': {
				target: process.env.VUE_APP_API_TMS_URI,//'http://172.17.30.221:9095',
				ws: true, //是否代理websockets
				changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
				pathRewrite:{
					'^/tms':'/tms'//代理的路径
				}
			},
			'/oauth': {
				target: process.env.VUE_APP_OAUTH_URI,//'http://172.17.30.221:9098',
				ws: true, //是否代理websockets
				changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
			},
			'/user': {
				target: process.env.VUE_APP_OAUTH_URI,//'http://172.17.30.221:9098',
				ws: true, //是否代理websockets
				changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL
			}
		}
	},
	"transpileDependencies": [
		"vuetify"
	],

}
