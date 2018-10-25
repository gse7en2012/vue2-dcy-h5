import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		accessToken: localStorage.getItem('dcyAccessToken'),
		rcToken: localStorage.getItem('dcyRcToken'),
		userId: localStorage.getItem('dcyUserId'),
		userMsgId: localStorage.getItem('dcyUserMsgId'),
		count: 0,
		userAccountInfo: null,
		isAjaxLoading: false,
		tmpDeviceName: '',
		deviclAlarmListChooseList: [], //选择报警列表
		projectAreaSelectedQuery: null, //项目地区信息
		isLogin: false,
		userInfo: {},
		showNewMessage: false,
		newMessageCount: 0,
		// deviceMsgList: [],
		deviceMsgList: localStorage.getItem('dcyDevMsg')
	},
	getters: {
		deviclAlarmListChooseList(state) {
			return state.deviclAlarmListChooseList;
		},
		checkLogin() {
			console.log(Vue.$cookies);
			return 3;
		},
		getDeviceMsg(state) {
			if (state.deviceMsgList) return JSON.parse(state.deviceMsgList);
			return [];
		}
	},
	mutations: {
		increment: state => state.count++,
		decrement: state => state.count--,
		updateLoadingStatus(state, payload) {
			state.isAjaxLoading = payload.isLoading
		},
		accountLogin: (state, data) => {
			localStorage['dcyAccessToken'] = data.access_token;
			localStorage['dcyRcToken'] = data.rc_token;
			localStorage['dcyUserId'] = data.user_info.efairyuser_id;
			localStorage['dcyUserMsgId'] = data.user_info.efairyuser_msgobj_id;
			localStorage['dcyDevMsg'] = JSON.stringify([]);
			state.accessToken = data.access_token;
			state.userId = data.user_info.efairyuser_id;
			state.userMsgId = data.user_info.efairyuser_msgobj_id;
			state.rcToken = data.rc_token;
			state.userAccountInfo = data.user_info;
			state.deviceMsgList = [];

		},
		accountLogout: (state) => {
			localStorage.removeItem('dcyAccessToken');
			localStorage.removeItem('dcyRcToken');
			localStorage.removeItem('dcyUserId');
			localStorage.removeItem('dcyUserMsgId');
			localStorage.removeItem('dcyDevMsg');
			state.accessToken = null;
			state.rcToken = null;
			state.userId = null;
			state.userAccountInfo = null;
			state.userMsgId = null;
			state.deviceMsgList = [];
		},
		saveUserInfo: (state, data) => {
			state.userInfo = data;
		}
	},
	actions: {
		changeDeviclAlarmListChooseList(context, data) {
			context.state.deviclAlarmListChooseList = data;
		},
		setProjectAreaSelectedQuery(ctx, data) {
			ctx.state.projectAreaSelectedQuery = data;
		},
		saveCurrentDeviceName(ctx, data) {
			ctx.state.tmpDeviceName = data;
		},
		pushNewMsgToBottomNav(ctx, data) {
			ctx.state.showNewMessage = true;
			ctx.state.newMessageCount++;
		},
		cancelNewMsgToBottomNav(ctx, data) {
			ctx.state.showNewMessage = false;
			ctx.state.newMessageCount = 0;
		},
		setMsgToCache(ctx, data) {
			ctx.state.deviceMsgList = data;
			localStorage['dcyDevMsg'] = JSON.stringify(data);
			// const list = ctx.state.deviceMsgList;
			// if (!list) {
			// 	ctx.state.deviceMsgList = [];
			// 	localStorage['dcyDevMsg'] = [];
			// }
			// if (list.length > 10) {
			// 	list.shift();
			// }
			// list.push(data);
		}
	}
})
