<template>
	<!-- <div class="nav-bar" v-if="!hideNavBar"> -->
	<van-tabbar v-model="active">
		<van-tabbar-item icon="shop" :to="{path:'/message'}">
			<!-- <i class="dot" v-if="newMessageCount>0">{{newMessageCount}}</i> -->
			<i class="dot" v-if="newMessageCount>0"></i>
			<span>设备消息</span>
			<img slot="icon" slot-scope="props" :src="props.active ? iconHash.message.active : iconHash.message.normal">
		</van-tabbar-item>
		<van-tabbar-item icon="chat" :to="{path:'/project'}">
			<span>项目</span>
			<img slot="icon" slot-scope="props" :src="props.active ? iconHash.device.active : iconHash.device.normal">
		</van-tabbar-item>
		<van-tabbar-item icon="records" :to="{path:'/report'}">
			<span>报告</span>
			<img slot="icon" slot-scope="props" :src="props.active ? iconHash.report.active : iconHash.report.normal">
		</van-tabbar-item>
		<van-tabbar-item icon="gold-coin" :to="{path:'/my'}">
			<span>我的</span>
			<img slot="icon" slot-scope="props" :src="props.active ? iconHash.mine.active : iconHash.mine.normal">
		</van-tabbar-item>
	</van-tabbar>
	<!-- </div> -->
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

import Bus from "@/service/bus";

export default {
    name: "bottomTab",
    props: ["hideNavBar"],

    data() {
        return {
            newMessageCount: this.$store.getters.getNewMsgCount,
            showNewMessage: this.$store.state.showNewMessage,
            active: 0,
            // showNavBar: true,
            iconHash: {
                message: {
                    active: messageIconS,
                    normal: messageIcon
                },
                device: {
                    active: deviceIconS,
                    normal: deviceIcon
                },
                report: {
                    active: reportIconS,
                    normal: reportIcon
                },
                mine: {
                    active: mineIconS,
                    normal: mineIcon
                }
            },
            uHash: {
                message: 0,
                project: 1,
                report: 2,
                my: 3
            }
        };
    },
    watch: {
        $route(to, from) {
            this.checkCurrentParentRoute();
        }
    },
    created() {
        console.log("created bottom");
    },
    async mounted() {
        console.log("mounted bottom");
        this.checkCurrentParentRoute();

        Bus.$on("getNewDeviceMsg", () => {
            console.log("goott");
            this.showNewMessage = true;
            this.newMessageCount++;
        });
        Bus.$on("hideNewDeviceMsg", () => {

            this.showNewMessage = false;
			this.newMessageCount = 0;
			console.log('on hidemsg',this.newMessageCount)
        });

        this.$nextTick(() => {
            //  this.checkCurrentParentRoute();
        });
    },
    methods: {
        hideBar() {
            console.log("hideBotBar");
            this.showNavBar = false;
        },
        showBar() {
            this.showNavBar = true;
        },
        checkCurrentParentRoute() {
            const path = this.$route.path;
            const parent = path.split("/")[1];
            this.active = this.uHash[parent];
        }
    }
};
</script>

<style lang="scss" scoped>
body {
    background-color: #f8f8f8;
}

.nav-bar {
    // z-index: -1;
    // height: 1px;
}
.van-tabbar-item {
    position: relative;
    .dot {
        position: absolute;
        min-width: 16px;
        height: 16px;
        min-width: 10px;
        height: 10px;
        border-radius: 10px;
        color: #fff;
        background: #ff0000;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        left: 55px;
        top: 5px;
        font-style: normal;
        padding: 0 4px;
        box-sizing: border-box;
    }
}
</style>
