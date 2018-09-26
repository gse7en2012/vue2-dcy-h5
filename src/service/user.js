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
	}
}

export default userService;
