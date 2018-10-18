import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

import projectIndex from '@/components/project/projectIndex';
import projectMap from '@/components/project/projectMap';
import deviceList from '@/components/project/deviceList';
import deviceDetail from '@/components/project/deviceDetail';
import deviceCharts from '@/components/project/deviceCharts';
import deviceChat from '@/components/project/deviceChat';
import deviceAlarmList from '@/components/project/deviceAlarmList';
import deviceAlarmHandle from '@/components/project/deviceAlarmHandle';
import deviceAlarmFixed from '@/components/project/deviceAlarmFixed';
import deviceConfig from '@/components/project/deviceConfig';

import messageIndex from '@/components/message/messageIndex';
import messageDetail from '@/components/message/messageDetail';
import myIndex from '@/components/my/myIndex';
import myAbout from '@/components/my/myAbout';
import myAddress from '@/components/my/myAddress';
import myCompany from '@/components/my/myCompany';
import myPhone from '@/components/my/myPhone';
import myEmail from '@/components/my/myEmail';

import reportIndex from '@/components/report/reportIndex';
import reportDetail from '@/components/report/reportDetail';
import reportProject from '@/components/report/reportProject';
import reportDeviceDetail from '@/components/report/reportDeviceDetail';

import loginPage from '@/components/landPage';
import VueCookies from '../service/cookies';

Vue.use(Router);

// const appId='wx7df072b8e5881faf';
const appId = 'wx1cb0950621818b8e';

const dcyRoutes = [{
		path: '',
		// name: 'landPage',
		// component: landPage
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'loginPage',
		component: loginPage
	},
	{
		path: '/project',
		name: 'projectIndex',
		component: projectIndex,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/project/map',
		name: 'projectMap',
		component: projectMap,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices',
		name: 'deviceList',
		component: deviceList,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail',
		name: 'deviceDetail',
		component: deviceDetail,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/charts',
		name: 'deviceCharts',
		component: deviceCharts,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/chat',
		name: 'deviceChat',
		component: deviceChat,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/chat/alarm',
		name: 'deviceAlarmList',
		component: deviceAlarmList,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/chat/alarm/handle',
		name: 'deviceAlarmHandle',
		component: deviceAlarmHandle,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/chat/alarm/fixed',
		name: 'deviceAlarmFixed',
		component: deviceAlarmFixed,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/project/:pid/devices/:did/detail/chat/config',
		name: 'deviceConfig',
		component: deviceConfig,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},

	{
		path: '/message',
		name: 'messageIndex',
		component: messageIndex,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/message/detail',
		name: 'messageDetail',
		component: messageDetail,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my',
		name: 'myIndex',
		component: myIndex,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/address',
		name: 'myAddress',
		component: myAddress,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/phone',
		name: 'myPhone',
		component: myPhone,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/email',
		name: 'myEmail',
		component: myEmail,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/company',
		name: 'myCompany',
		component: myCompany,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/about',
		name: 'myAbout',
		component: myAbout,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/report',
		name: 'reportIndex',
		component: reportIndex,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/report/:rid/detail',
		name: 'reportDetail',
		component: reportDetail,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/report/:rid/detail/:pid/project',
		name: 'reportProject',
		component: reportProject,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		},
	},
	{
		path: '/report/:rid/detail/:pid/project/:did/detail',
		name: 'reportDeviceDetail',
		component: reportDeviceDetail,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		}
	}
];

const dcyRouter = new Router({
	mode: 'hash',
	base: '/dcy/',
	routes: dcyRoutes
});

const checkRouterForwardOrBack = (to, from) => {
	let toDepth = to.path.split('/').length
	let fromDepth = from.path.split('/').length
	if (to.path.charAt(to.path.length - 1) !== '/')
		toDepth += 1
	if (from.path.charAt(from.path.length - 1) !== '/')
		fromDepth += 1
	const transitionType = toDepth > fromDepth ? 'forward' : 'back';
	// if (toDepth > fromDepth) {
	// 	to.meta.nokeepAlive = true;
	// } else {
	// 	to.meta.nokeepAlive = false;
	// }
}

const checkWeixinToken = (to, from) => {
	if (!VueCookies.get('efairywxuser_id')) {
		// const redirectUri=encodeURIComponent(location.origin+'/wechatapi/oauth_callback');
		const path = encodeURIComponent(to.path);
		const redirectUri = encodeURIComponent(`http://wechatts.cciotsz.com/wechatapi/oauth_callback?return_uri=${path}`);
		window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${Number(new Date())}#wechat_redirect`;
	}
}

dcyRouter.beforeEach((to, from, next) => {
	//check
	// checkRouterForwardOrBack(to,from);
	// checkWeixinToken(to, from);

	if (to.matched.some(r => r.meta.requireAuth)) {
		if (store.state.accessToken) {
			next();
		} else {
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				}
			})
		}
	} else {
		next();
	}
})

export default dcyRouter;
