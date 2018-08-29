<template>
	<div id="app">
		<!-- <div class="main" :class="{nobar:isWeixin}"> -->
			<div>
				<!-- <keep-alive> -->
					<router-view v-on:hideBotBar="hideBar" v-on:showBotBar="showBar" v-transition/>
				<!-- </keep-alive> -->
			</div>
		<!-- </div> -->
		<!-- <bottom-tab/> -->

	</div>
</template>

<script>
import messageIcon from "@/assets/icons/message.png";
import messageIconS from "@/assets/icons/message_s.png";
import deviceIcon from "@/assets/icons/device.png";
import deviceIconS from "@/assets/icons/device_s.png";
import reportIcon from "@/assets/icons/report.png";
import reportIconS from "@/assets/icons/report_s.png";
import mineIcon from "@/assets/icons/my.png";
import mineIconS from "@/assets/icons/my_s.png";

import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";

export default {
    name: "App",
    components: {
        bottomTab
    },
    data() {
        return {
            active: 0,
            isWeixin: false,
            showNavBar: true,
        };
    },
    async mounted() {
        this.$nextTick(() => {
           // this.isWeixin = this.checkIsWeixin();
        });
    },
    methods: {
        checkIsWeixin() {
            // return true;
            const ua = navigator.userAgent.toLowerCase();
            return /micromessenger/.test(ua) ? true : false;
        },
        hideBar() {
            console.log("hideBotBar");
            this.showNavBar = false;
        },
        showBar() {
            this.showNavBar = true;
        }
    }
};
</script>

<style lang="scss" scoped>
body {
    background-color: #f8f8f8;
}
// #app{
// 	position: absolute;
// 	height:100%;
// 	width: 100%;
// 	left:0;
// 	top:0;
// }
.main {
    position: absolute;
    // bottom: 55px;
    bottom: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    background: #eef0f3;
    z-index: 9;
}
</style>
