import axios from 'axios';
import store from '../store';
import router from '../router';
import {
	Toast
} from "vant";

// axios 配置
axios.defaults.timeout = 50000;
axios.defaults.baseURL = '/wxluaapi';

// http request 拦截器
axios.interceptors.request.use(
	config => {
		// console.log(config);
		if (store.state.accessToken) {
			config.headers.Authorization = `token ${store.state.accessToken}`;
			if (!config.params) config.params = {};
			config.params.access_token = store.state.accessToken;
			config.params.efairyuser_id = store.state.userId;
		}
		store.commit('updateLoadingStatus', {
			isLoading: true
		})
		return config;
	},
	err => Promise.reject(err)
)

// http response 拦截器
axios.interceptors.response.use(
	response => {
		store.commit('updateLoadingStatus', {
			isLoading: false
		})
		return response.data
	},
	error => {
		console.log(error.response);
		store.commit('updateLoadingStatus', {
			isLoading: false
		})
		if (error.response) {
			switch (error.response.status) {
				case 400:
					break;
				case 444:
					// 444 清除token信息并跳转到登录页面
					store.commit('accountLogout')

					// 只有在当前路由不是登录页面才跳转
					router.currentRoute.path !== 'login' &&
						router.replace({
							name: 'loginPage',
							query: {
								redirect: router.currentRoute.path
							},
						})
			}
		}
		if (error.response.data)
			Toast(error.response.data.msg || '请求出错');
		// console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
		return Promise.reject(error.response.data);
	},
)





export default axios;
