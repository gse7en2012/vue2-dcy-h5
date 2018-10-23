import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vueg from 'vueg';
import service from './service';
import theme from './theme/theme.json';
import westro from './theme/westro.json';
import rp1 from './theme/themeReport1.json';
import rp2 from './theme/themeReport2.json';
import ECharts from 'vue-echarts/components/ECharts.vue';


// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies);




import store from './store';
import 'vueg/css/transition-min.css'
// // 手动引入 ECharts 各模块来减小打包体积
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'

// 注册组件后即可使用
Vue.component('v-chart', ECharts);

Vue.directive('focus', {
	// 当绑定元素插入到 DOM 中。

	inserted: function (el) {
		// 聚焦元素
		el.focus()
	},
	//也可以用update,update就是当页面有操作的时候就触发，比如点击按钮，输入框输入都算。
	//有一个要注意的就是，就是你页面有几个input,比如一个input绑定了v-focus,一个没有绑定。你在没绑定v-focus的input输入时，绑定了v-focus的input就是自动获取焦点，这是个bug.
	//update: function (el) {
	//el.focus()
	//}
});


Vue.prototype.$service = service;
ECharts.registerTheme('ovilia-green', theme);
ECharts.registerTheme('westro', westro);
ECharts.registerTheme('rp1', rp1);
ECharts.registerTheme('rp2', rp2);
Vue.use(vueg, router, {
	sameDepthDisable: true,
	// duration: 5.2,
	firstEntryDisable: true,
	shadow: false,
	// backAnim:'slideInLeft',
	// forwardAnim:'slideInRight'
});



import {
	Tabbar,
	TabbarItem,
	Tab,
	Tabs,
	Toast,
	Field,
	NavBar,
	Icon,
	Dialog,
	Search,
	Cell,
	List,
	CellGroup,
	Popup,
	Uploader,
	Picker,
	Loading,
	Panel,
	ImagePreview,
	Switch,
	SwitchCell,
	DatetimePicker,
	Actionsheet
} from "vant";

import '@/assets/global.scss';

Vue.use(Tab)
	.use(Tabs)
	.use(NavBar)
	.use(Tabbar)
	.use(Toast)
	.use(TabbarItem)
	.use(Icon)
	.use(Dialog)
	.use(Search)
	.use(Cell)
	.use(CellGroup)
	.use(Popup)
	.use(Picker)
	.use(List)
	.use(Loading)
	.use(Field)
	.use(Panel)
	.use(ImagePreview)
	.use(Switch)
	.use(Uploader)
	.use(SwitchCell)
	.use(Actionsheet)
	.use(DatetimePicker);



//rc


import rongCloudInit from "@/components/rongCloud/init";

//appkey
// 测试版：vnroth0kvdmso
// 正式版：m7ua80gbmpi3m

// connectRongCloud();

function connectRongCloud() {
	var params = {
		appKey: "8w7jv4qb78a9y",
		token: "qyN3mb4PjM+ZXDOdW4f8KpltMLEfik9DxpqXaALr0RGROd6gPSiwQtBYfRPwWMBLjb+Q/sj37frDI5cUnfVAKg=="
	};

	var userId = "";

	var callbacks = {
		getInstance: function (instance) {},
		getCurrentUser: function (userInfo) {
			console.log(userInfo);
		},
		receiveNewMessage: function (message) {
			//show(message);
			console.log(message);
		}
	};

	rongCloudInit(params, callbacks);
}



new Vue({
	el: '#app',
	store,
	service,
	router,
	render: h => h(App)
});
