import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vueg from 'vueg';

import theme from './theme/theme.json';
import ECharts from 'vue-echarts/components/ECharts.vue';
ECharts.registerTheme('ovilia-green', theme);

// // 手动引入 ECharts 各模块来减小打包体积
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'

// 注册组件后即可使用
Vue.component('chart', ECharts);

import 'vueg/css/transition-min.css'
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
	CellGroup,
	Popup,
	Picker,
	Loading,
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
	.use(Loading)
	.use(Field)
	.use(Switch)
	.use(SwitchCell)
	.use(Actionsheet)
	.use(DatetimePicker);




new Vue({
	el: '#app',
	router,
	render: h => h(App)
});
