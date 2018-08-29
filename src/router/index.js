import Vue from 'vue';
import Router from 'vue-router';


import projectIndex from '@/components/project/projectIndex';
import projectMap from '@/components/project/projectMap';
import deviceList from '@/components/project/deviceList';
import deviceDetail from '@/components/project/deviceDetail';
import deviceCharts from '@/components/project/deviceCharts';
import deviceChat from '@/components/project/deviceChat';
import deviceAlarmList from '@/components/project/deviceAlarmList';

import messageIndex from '@/components/message/messageIndex';
import messageDetail from '@/components/message/messageDetail';
import myIndex from '@/components/my/myIndex';
import myAbout from '@/components/my/myAbout';
import myAddress from '@/components/my/myAddress';
import myCompany from '@/components/my/myCompany';
import reportIndex from '@/components/report/reportIndex';
import landPage from '@/components/landPage';

Vue.use(Router);


const dcyRoutes = [{
		path: '',
		// name: 'landPage',
		// component: landPage
		redirect: '/message'
	},
	{
		path: '/project',
		name: 'projectIndex',
		component: projectIndex
	},
	{
		path: '/project/map',
		name: 'projectMap',
		component: projectMap
	},
	{
		path: '/project/devices/:pid',
		name: 'deviceList',
		component: deviceList
	},
	{
		path: '/project/devices/:pid/detail',
		name: 'deviceDetail',
		component: deviceDetail
	},
	{
		path: '/project/devices/:pid/detail/charts',
		name: 'deviceCharts',
		component: deviceCharts
	},
	{
		path: '/project/devices/:pid/detail/chat',
		name: 'deviceChat',
		component: deviceChat
	},
	{
		path: '/project/devices/:pid/detail/chat/alarm',
		name: 'deviceAlarmList',
		component: deviceAlarmList
	},
	{
		path: '/message',
		name: 'messageIndex',
		component: messageIndex
	},
	{
		path: '/message/detail',
		name: 'messageDetail',
		component: messageDetail
	},
	{
		path: '/my',
		name: 'myIndex',
		component: myIndex
	},
	{
		path: '/my/address',
		name: 'myAddress',
		component: myAddress
	},
	{
		path: '/my/company',
		name: 'myCompany',
		component: myCompany
	},
	{
		path: '/my/about',
		name: 'myAbout',
		component: myAbout
	},
	{
		path: '/report',
		name: 'reportIndex',
		component: reportIndex
	},
];

const dcyRouter = new Router({
	mode: 'hash',
	base: '/dcy/',
	routes: dcyRoutes
});


export default dcyRouter;
