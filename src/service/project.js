import axios from './extend';

const projectService = {

	async getAreaList() {
		return await axios.get('/project_geo_info_list');
	},
	async getProjectList(opts) {
		return await axios.get('/project_list', {
			params: opts
		})
	},
	async getDeviceList(opts) {
		return await axios.get('/device_list', {
			params: opts
		})
	},
	async getDeviceDetail(opts) {
		return await axios.get('/device_rt_info', {
			params: opts
		})
	},
	async getDeviceChart(opts) {
		return await axios.get('/device_waveform_data', {
			params: opts
		})
	},
	async getDeviceChatMsgList(opts) {
		return await axios.get('/device_msg_list', {
			params: opts
		})
	},
	async getDeviceAlarmUnhandleList(opts) {
		return await axios.get('/device_unhandle_alarm_msg_list', {
			params: opts
		})
	},
	async getDeviceSetting(opts) {
		return await axios.get('/device_setting', {
			params: opts
		})
	},
	async editDeviceChannelName(opts) {
		return await axios.post('/device_channel_setting', opts)
	},
	async editMultiDeviceChannelName(opts) {
		return await axios.post('/device_multi_channel_setting', opts)
	},
	async postDeviceMsg(opts) {
		return await axios.post('/device_control', opts)
	},
	async getDeviceAlarmHandledList(opts) {
		return await axios.get('/device_alarm_record_list', {
			params: opts
		})
	},
	async postDeviceAlarmHandle(opts) {
		return await axios.post('/device_alarm_record', opts)
	},
	async getDeviceAlarmFixedDetail(opts) {
		return await axios.get('/device_alarm_record', {
			params: opts
		})
	},
	async cacheAlramListId(opts) {
		return await axios.post('/cache_device_alarm_statistics_id_list', opts)
	},
	async getCacheAlarmListId(opts) {
		return await axios.get('/device_unhandle_alarm_statistics_list_by_id', {
			params: opts
		})
	}
}

export default projectService;
