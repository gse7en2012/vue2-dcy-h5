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
	async getDeviceList(opts){
		return await axios.get('/device_list', {
			params: opts
		})
	}
}

export default projectService;
