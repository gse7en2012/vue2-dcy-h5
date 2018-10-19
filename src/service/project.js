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
	async getDeviceChart(opts){
		return await axios.get('/device_waveform_data',{
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
	}
}

export default projectService;
