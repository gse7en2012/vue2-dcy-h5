import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

import projectIndex from '@/components/project/projectIndex';
import projectMap from '@/components/project/projectMap';
import deviceMap from '@/components/project/deviceMap';
import deviceList from '@/components/project/deviceList';
import deviceDetail from '@/components/project/deviceDetail';
import deviceCharts from '@/components/project/deviceCharts';
import deviceChat from '@/components/project/deviceChat';
import deviceAlarmList from '@/components/project/deviceAlarmList';
import deviceAlarmHandle from '@/components/project/deviceAlarmHandle';
import deviceAlarmFixed from '@/components/project/deviceAlarmFixed';
import deviceAlarmFixedFromMsg from '@/components/project/deviceAlarmFixedFromMsg';
import deviceConfig from '@/components/project/deviceConfig';

import messageIndex from '@/components/message/messageIndex';
import messageDetail from '@/components/message/messageDetail';
import myIndex from '@/components/my/myIndex';
import myAbout from '@/components/my/myAbout';
import myAddress from '@/components/my/myAddress';
import myCompany from '@/components/my/myCompany';
import myPhone from '@/components/my/myPhone';
import myEmail from '@/components/my/myEmail';
import myInfo from '@/components/my/myInfo';
import myName from '@/components/my/myName';
import myPass from '@/components/my/myPass';
import mySetting from '@/components/my/mySetting';
import myBook from '@/components/my/myBook';
import myDesc from '@/components/my/myDesc';
import myFeedback from '@/components/my/myFeedback';

import reportIndex from '@/components/report/reportIndex';
import reportDetail from '@/components/report/reportDetail';
import reportProject from '@/components/report/reportProject';
import reportDeviceDetail from '@/components/report/reportDeviceDetail';

import loginPage from '@/components/landPage';
import VueCookies from '../service/cookies';
import userService from '@/service/user';

import wx from "weixin-js-sdk";

Vue.use(Router);

const appId = 'wx7df072b8e5881faf';
const appIdTest = 'wx1cb0950621818b8e';

const isProdEnv = process.env.NODE_ENV == "production";


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
		path: '/project/:pid/devices/map',
		name: 'deviceMap',
		component: deviceMap,
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
		path: '/project/:pid/devices/:did/detail/chat/alarm/fixed_msg',
		name: 'deviceAlarmFixedFromMsg',
		component: deviceAlarmFixedFromMsg,
		meta: {
			nokeepAlive: true,
			requireAuth: true,
		}
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
			nokeepAlive: true
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
			nokeepAlive: true
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
		path: '/my/info',
		name: 'myInfo',
		component: myInfo,
		meta: {
			requireAuth: true,
			nokeepAlive: true
		},
	},
	{
		path: '/my/setting',
		name: 'mySetting',
		component: mySetting,
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/my/about/book',
		name: 'myBook',
		component: myBook,

	},
	{
		path: '/my/about/desc',
		name: 'myDesc',
		component: myDesc,

	},
	{
		path: '/my/about/fb',
		name: 'myFeedback',
		component: myFeedback,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/info/name',
		name: 'myName',
		component: myName,
		meta: {
			requireAuth: true,
		},
	},
	{
		path: '/my/info/pass',
		name: 'myPass',
		component: myPass,
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
	base: '/wxgzh/',
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

	if (!isProdEnv) return;

	const oauthApi = "http://efawxapi.cciotsz.com/wechatapi/oauth_callback";
	const oauthApiTest = "http://wechatts.cciotsz.com/wechatapi/oauth_callback";
	if (!VueCookies.get('efairywxuser_id')) {
		// const redirectUri=encodeURIComponent(location.origin+'/wechatapi/oauth_callback');
		const path = encodeURIComponent('/#' + to.path);
		const redirectUri = encodeURIComponent(`${oauthApi}?return_uri=${path}`);
		window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${Number(new Date())}#wechat_redirect`;
	}
}

const setupShareInfo = (to) => {
	const opts = {
		share_type: 10000,
		share_args: {}
	};
	switch (to.name) {
		case 'messageIndex':
			opts.share_type = 10000;
			break;
		case 'projectIndex':
			opts.share_type = 20000;
			break;
		case 'deviceDetail':
			opts.share_type = 20001;
			opts.share_args = {
				efairydevice_id: to.params.did
			}
			break;
		case 'reportIndex':
			opts.share_type = 30000;
			break;
		case 'reportDetail':
			opts.share_type = 30001;
			opts.share_args = {
				efairyreport_id: to.params.rid
			}
			break;
	}
	// return opts;
	userService.getWxShareInfo(opts).then((data) => {
		const config = data.result;
		wx.ready(() => {
			wx.updateAppMessageShareData({
				title: config.title, // 分享标题
				desc: config.desc, // 分享描述
				link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: config.img_url, // 分享图标
				success() {
					// 设置成功
				}
			});
			wx.updateTimelineShareData({
				title: config.title, // 分享标题
				desc: config.desc, // 分享描述
				link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: config.img_url, // 分享图标
				success() {
					// 设置成功
				}
			});
		})

	})
};


dcyRouter.beforeEach((to, from, next) => {
	//check
	// checkRouterForwardOrBack(to,from);
	checkWeixinToken(to, from);
	setupShareInfo(to);

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
