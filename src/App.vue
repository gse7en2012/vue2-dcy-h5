<template>
	<div id="app">
		<van-loading v-if="showLoading" />
		<div>
			<keep-alive>
				<router-view v-if="!$route.meta.nokeepAlive" v-transition />
			</keep-alive>
			<router-view v-if="$route.meta.nokeepAlive" v-transition />
		</div>
	</div>
</template>

<script>
import Bus from "@/service/bus";
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
import { mapState } from "vuex";

import wx from "weixin-js-sdk";

import rongCloudInit from "@/components/rongCloud/init";

// 测试版：vnroth0kvdmso
// 正式版：m7ua80gbmpi3m  zhongchengwul uwd1c0sxuvio1

console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV;
const rcAppKey = env === "production" ? "uwd1c0sxuvio1" : "vnroth0kvdmso";
// const rcAppKeyProduction = "uwd1c0sxuvio1";

export default {
    name: "App",
    components: {
        bottomTab
    },
    computed: {
        ...mapState({
            showLoading: state => state.isAjaxLoading
        })
    },
    data() {
        return {
            isWeixin: false,
            rcToken: this.$store.state.rcToken,
            msgList: this.$store.getters.getDeviceMsg
        };
    },
    async mounted() {
        Bus.$on("loginSuccess", msg => {
            this.initRc();
        });
        if (this.rcToken) this.initRc();
        this.setUpWxconfig();
    },
    methods: {
        async setUpWxconfig() {
            const data = await this.$service.userService.getJssdkConfig({
				jssdk_url:encodeURIComponent(location.origin+location.search)
			});
            const config = data.result;
            wx.config({
                debug: false, // 开启调试模式，true会alert所有api返回值
                appId: config.app_id, // 公众号唯一id
                timestamp: config.timestamp, // 生成签名的时间戳
                nonceStr: config.nonce_str, // 生成签名的随机串
                signature: config.signature, // 签名
                jsApiList: [
                    // 需要使用的js列表
                    "openLocation","onMenuShareAppMessage","onMenuShareTimeline","updateTimelineShareData","updateAppMessageShareData"
                ]
            });
        },
        loginSuccess(info) {
            this.initRc();
        },
        initRc() {
            const rcAppToken = this.rcToken;
            const params = {
                appKey: rcAppKey,
                token: rcAppToken
            };

            const callbacks = {
                getInstance: instance => {},
                getCurrentUser: userInfo => {
                    console.log(userInfo);
                },
                receiveNewMessage: message => {
                    //show(message);
                    const msg = message.content.extra;
                    this.addNewMsg(msg);
                }
            };

            rongCloudInit(params, callbacks);
            // }
        },
        addNewMsg(msg) {
            let isExist = false;
            // this.$store.dispatch("pushNewMsgToBottomNav", 2);
            Bus.$emit("getNewDeviceMsg", msg);

            this.msgList.forEach(item => {
                if (
                    item.efairydevicemsg_from_id == msg.efairydevicemsg_from_id
                ) {
                    isExist = true;
                    item.unread = true;
                    item.efairydevicemsg_time = msg.efairydevicemsg_time;
                    item.efairydevicemsg_content = msg.efairydevicemsg_content;
                }
            });
            if (!isExist) {
                msg.unread = true;
                if (this.msgList && this.msgList.length > 10) {
                    this.msgList.pop();
                }
                this.msgList.unshift(msg);
            }
            this.msgList.sort((a, b) => {
                return b.efairydevicemsg_time > a.efairydevicemsg_time;
            });
            this.$store.dispatch("pushNewMsgToBottomNav");
            this.$store.dispatch("setMsgToCache", this.msgList);
        },
        checkIsWeixin() {
            // return true;
            const ua = navigator.userAgent.toLowerCase();
            return /micromessenger/.test(ua) ? true : false;
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
