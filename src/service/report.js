import axios from './extend';

const reportService = {
	async getReportList(opts) {
		return await axios.get('/report_list', {
			params: opts
		})
	},
	async deleteReport(opts) {
		return await axios.delete('/report', {
			params: opts
		});
	},
	async buildReport(opts) {
		return await axios.post('/report', opts)
	},
	async getReportBasicInfo(opts) {
		return await axios.get('/report_basic_info', {
			params: opts
		})
	},
	async getReportIndexProjectList(opts) {
		return await axios.get('/report_project_info_list', {
			params: opts
		})
	},
	async getAreaList() {
		return await axios.get('/report_project_geo_list');
	},
	async getProjectList(opts) {
		return await axios.get('/report_project_list', {
			params: opts
		})
	},
	async getReportProjectDetail(opts) {
		return await axios.get('/report_project_detail_info', {
			params: opts
		})
	},
	async getReportDeviceList(opts) {
		return await axios.get('/report_project_device_list', {
			params: opts
		})
	},
	async getReportDeviceDetail(opts) {
		return await axios.get('/report_project_device_info', {
			params: opts
		})
	},
	async getReportDeviceAlarmList(opts) {
		return await axios.get('/report_project_device_alarm_list', {
			params: opts
		})
	},
	async saveReportTitle(opts){
		return await axios.post('/report_title',opts)
	}
}

export default reportService;
