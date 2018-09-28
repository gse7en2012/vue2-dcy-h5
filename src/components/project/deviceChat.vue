<template>
	<div class="main">
		<van-nav-bar title="设备对话框" @click-right="goBack">
			<span slot="right" class="bar-close">&times;</span>
		</van-nav-bar>
		<div class="wrapper" ref="wrapper">
			<div class="chat-box">
				<div class="block" v-for="(msg,i) in chatList" :id="'msg'+msg.efairymsg_id">
					<div class="chat-time">{{msg.efairymsg_add_time}}</div>
					<div class="chat-message" :class="{my:msg.isMine}">
						<div class="avatar">
							<img src="@/assets/icons/device_chat.png" v-if="!msg.isMine">
							<img src="@/assets/icons/avatar.png" v-if="msg.isMine">
						</div>
							<div class="ctx">{{msg.ctx.text}}</div>
							<div class="status" v-if="!msg.isMine">
								<img src="@/assets/icons/fixed_chat.png" v-if="msg.efairymsg_ishandle==1">
								<img src="@/assets/icons/warning_chat.png" v-if="msg.efairymsg_ishandle==0">
						</div>
							</div>
						</div>
					</div>
				</div>
				<router-link :to="{name:'deviceAlarmList'}" class="alarm-list-btn">
					报警列表
				</router-link>
				<van-tabbar class="device-chat-tabbar">
					<van-tabbar-item @click="sendMsg()">消音</van-tabbar-item>
					<van-tabbar-item @click="sendMsg()">复位</van-tabbar-item>
					<van-tabbar-item @click="gotoConfig()">配置</van-tabbar-item>
				</van-tabbar>
			</div>

</template>

<script>
import BScroll from "better-scroll";
import moment, { max } from "moment";

export default {
    name: "deviceChat",
    //0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常
    data() {
        return {
            query: this.$route.query,
            deviceId: this.$route.params.did,
            userMsgId: this.$store.state.userMsgId,
            chatList: [],
            lastId: 0,
            page: 1,
            pageSize: 10,
            statusHash: ["离线", "火警", "预警", "故障", "启动", "屏蔽", "正常"]
        };
    },
    async mounted() {
        this.getChatMsgList();
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        async getChatMsgList() {
            const data = await this.$service.projectService.getDeviceChatMsgList(
                {
                    efairyuser_msgobj_id: this.userMsgId,
                    efairydevice_msgobj_id: this.query.msgobj_id,
                    size: this.pageSize
                }
            );
            this.chatList = data.result.msg_list.reverse();
            this.chatList.forEach((item, index) => {
                item.ctx = JSON.parse(item.efairymsg_content);
                if (index == 0) this.lastId = item.efairymsg_id;
            });
        },
        sendMsg() {
            this.chatList.push({
                isMine: 1,
                efairymsg_add_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                ctx: {
                    text: "复位"
                },
                efairymsg_ishandle: 1
            });
            this.scroll.refresh();
            setTimeout(() => {
                this.scroll.scrollTo(0, this.scroll.maxScrollY);
            }, 0);
        },
        goBack() {
            this.$router.back();
        },
        gotoConfig() {
            this.$router.push({ name: "deviceConfig", query: { q: 3 } });
        },
        async setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true,
                pullDownRefresh: {
                    threshold: 0,
                    stop: 0
                }
            });
            this.scroll.on("pullingDown", () => {
                this.loadEarlyMsgList();
            });
            setTimeout(() => {
                this.scroll.scrollTo(0, this.scroll.maxScrollY);
            }, 1000);
        },
        async loadEarlyMsgList() {
            const tmpLastId = this.lastId;
            const data = await this.$service.projectService.getDeviceChatMsgList(
                {
                    efairyuser_msgobj_id: this.userMsgId,
                    efairydevice_msgobj_id: this.query.msgobj_id,
                    size: this.pageSize,
                    page: ++this.page,
                    last_id: this.lastId
                }
            );
            const chatList = data.result.msg_list.reverse();
            chatList.forEach((item, index) => {
                item.ctx = JSON.parse(item.efairymsg_content);
                if (index == 0) this.lastId = item.efairymsg_id;
            });
            this.chatList = chatList.concat(this.chatList);
            this.scroll.finishPullDown();
            this.$toast("已加载更早前的消息");
            setTimeout(() => {
                this.scroll.refresh();
                this.scroll.scrollToElement("#msg" + tmpLastId, 0, 0, -20);
            }, 0);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.bar-close {
    font-size: 24px;
    font-weight: 300;
}

.van-tabbar-item {
    border-right: 1px solid #ddd;
    &:nth-last-of-type(1) {
        border: 0;
    }
}

.wrapper {
    position: absolute;
    top: 46px;
    overflow: hidden;
    width: 100%;
    bottom: 50px;
    overflow: hidden;
}
.chat-box {
    padding-top: 5px;
    padding-bottom: 100px;
    .chat-time {
        background: rgba(0, 0, 0, 0.08);
        color: #fff;
        width: 120px;
        font-size: 12px;
        margin: 15px auto;
        text-align: center;
        padding: 4px;
        border-radius: 4px;
    }
    .chat-message {
        display: flex;
        padding: 0 15px 15px;
        .avatar {
            width: 34px;
            min-width: 34px;
            img {
                width: 100%;
                display: block;
            }
        }
        .ctx {
            // flex: 1;
            background: #fff;
            color: #555;
            font-size: 14px;
            margin: 0 10px;
            padding: 5px 8px;
            border-radius: 4px;
            line-height: 24px;
            position: relative;
            &::after {
                content: "";
                width: 0;
                height: 0;
                position: absolute;
                left: -12px;
                top: 12px;
                border: 6px solid transparent;
                border-right: 6px solid #fff;
            }
        }
        .status {
            width: 26px;
            min-width: 26px;
            // margin-left: 5px;
            img {
                width: 80%;
                margin-top: 4px;
            }
        }
        &.my {
            flex-direction: row-reverse;
            .ctx {
                background: #a0e75a;
                &::after {
                    content: "";
                    width: 0;
                    height: 0;
                    position: absolute;
                    left: auto;
                    right: -12px;
                    top: 12px;
                    border: 6px solid transparent;
                    border-left: 6px solid #a0e75a;
                }
            }
        }
    }
}
.main-box {
    background: #fff;
    padding-bottom: 5px;
    .row {
        display: flex;
        padding: 6px 15px;
        color: #333;
        span {
            flex: 1;
            font-size: 14px;
            &.r {
                text-align: right;
                color: #666;
                flex: 2;
            }
        }
        &.title {
            font-size: 16px;
            line-height: 28px;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
            .l {
                // font-weight: bold;
                font-size: 16px;
                flex: 2;
                color: #000;
            }
        }
    }
}

.my-list {
    margin-top: 10px;
    .van-cell {
        font-size: 15px;
        height: 45px;
        line-height: 30px;
    }
}

.block-title {
    background: #fff;
    margin-top: 10px;
    line-height: 26px;
    position: relative;
    color: $dcyColor;
    font-size: 15px;
    padding: 10px 15px;
    &:after {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        height: 16px;
        margin-top: -8px;
        width: 6px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: $dcyColor;
    }
}

.detail-list {
    .van-cell {
        font-size: 13px;
        line-height: 20px;
    }
}

.alarm-list-btn {
    position: fixed;
    left: 10px;
    bottom: 70px;
    z-index: 111;
    background: $dcyColor;
    color: #eee;
    font-size: 14px;
    padding: 5px 15px;
    border-radius: 20px;
    box-shadow: 1px 1px 5px #bbb;
}
</style>
