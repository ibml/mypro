export default [{
		path: '/login',
		name: 'Login',
		meta: {
			requireAuth: false, //是否需要授权
			public:true
		},
		component: () => import(
			`@/views/Login.vue`
		)
	},
	{
		path: '/',
		meta: {
			public:true
		},
		name: 'Root',
		redirect: {
			path: '/login'
		}
	},
	{
		path: '/home',
		name: 'Home',
		meta: {
			title:'主页',
			requireAuth: false, //是否需要授权
			affix:true
		},
		component: () => import(
			`@/views/Home.vue`
		)
	},
	{
		path: '*',
		name: '*',
		meta:{
			title:'404'
		},
		component: () => import(
			`@/components/NotFoundComponent.vue`
		)
	},
	{
		path: '/supplies/DashPane',
		name: 'DashPane',
		meta:{
			title:'SPD运营中心'
		},
		component: () => import(
			`@/views/supplies/DashPane.vue`
			)
	}
];