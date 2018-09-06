import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		count: 0,
		deviclAlarmListChooseList: [], //选择报警列表
	},
	getters: {
		deviclAlarmListChooseList(state) {
			return state.deviclAlarmListChooseList;
		}
	},
	mutations: {
		increment: state => state.count++,
		decrement: state => state.count--
	},
	actions: {
		changeDeviclAlarmListChooseList(context, data) {
			context.state.deviclAlarmListChooseList = data;
		}
	}
})
