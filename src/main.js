import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vueg from 'vueg';
import service from './service';
import theme from './theme/theme.json';
import ECharts from 'vue-echarts/components/ECharts.vue';


import store from './store';
import 'vueg/css/transition-min.css'
// // 手动引入 ECharts 各模块来减小打包体积
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'

// 注册组件后即可使用
Vue.component('chart', ECharts);
Vue.prototype.$service = service;
ECharts.registerTheme('ovilia-green', theme);
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




new Vue({
	el: '#app',
	store,
	service,
	router,
	render: h => h(App)
});
