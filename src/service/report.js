import axios from './extend';

const reportService = {
	async getReportList(opts) {
		return await axios.get('/report_list', {
			params: opts
		})
	},
}

export default reportService;
