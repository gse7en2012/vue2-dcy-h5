import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		accessToken: localStorage.getItem('dcyAccessToken'),
		rcToken: localStorage.getItem('dcyRcToken'),
		userId: localStorage.getItem('dcyUserId'),
		count: 0,
		userAccountInfo: null,
		isAjaxLoading: false,
		deviclAlarmListChooseList: [], //选择报警列表
		projectAreaSelectedQuery: null //项目地区信息
	},
	getters: {
		deviclAlarmListChooseList(state) {
			return state.deviclAlarmListChooseList;
		}
	},
	mutations: {
		increment: state => state.count++,
		decrement: state => state.count--,
		updateLoadingStatus(state, payload) {
			state.isAjaxLoading = payload.isLoading
		},
		accountLogin: (state, data) => {
			localStorage.dcyAccessToken = data.access_token;
			localStorage.dcyRcToken = data.rc_token;
			localStorage.dcyUserId = data.user_info.efairyuser_id;
			state.accessToken = data.access_token;
			state.userId=data.user_info.efairyuser_id;
			state.rcToken = data.rc_token;
			state.userAccountInfo = data.user_info;
		},
		accountLogout: (state) => {
			localStorage.removeItem('dcyAccessToken');
			localStorage.removeItem('dcyRcToken');
			localStorage.removeItem('dcyUserId');
			state.accessToken = null;
			state.rcToken = null;
			state.userId = null;
			state.userAccountInfo = null;
		}
	},
	actions: {
		changeDeviclAlarmListChooseList(context, data) {
			context.state.deviclAlarmListChooseList = data;
		},
		setProjectAreaSelectedQuery(ctx, data) {
			ctx.state.projectAreaSelectedQuery = data;
		}
	}
})
