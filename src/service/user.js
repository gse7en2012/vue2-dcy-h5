import axios from './extend';

const userService = {
	checkIsLogin() {
		return localStorage.getItem('dcyAccessToken');
	},
	async loginViaPassword(phone, pass) {
		const result = await axios.get('/password_login', {
			params: {
				efairyuser_phonenumber: phone,
				efairyuser_password: pass
			}
		});
		return result;
	},
	async getLoginCheckCode(phone) {
		return await axios.get('/checkcode', {
			params: {
				efairy_phonenumber: phone
			}
		})
	},
	async loginViaCheckCode(phone, code) {
		return await axios.get('/checkcode_login', {
			params: {
				efairyuser_phonenumber: phone,
				check_code: code
			}
		})
	},
	async editUserInfo(opts) {
		return await axios.put('/user_info', {
			efairyuser_info: opts
		})
	},
	async getUserInfo() {
		return await axios.get('/user_info');
	},
	async getJssdkConfig() {
		return await axios.get('/jssdk_config');
	},
	async getQiniuToken() {
		return await axios.get('/qiniu_token');
	},
	async editPassword(opts) {
		return await axios.put('/password', opts)
	},
	async getUserSetting(opts){
		return await axios.get('/user_config');
	},
	async editUserSetting(opts){
		return await axios.put('/user_config',opts);
	}
}

export default userService;
