<template>
	<div class="main">
		<van-nav-bar title="消息列表" @click-left="onClickLeft" fixed />
		<section class="page-main">
			<div class="edit-bar">
				<div class="edit-bar-span" @click="editMessage()" v-if="msgList.length!=0">
					<img src="@/assets/icons/edit.png">{{edit?'取消':'编辑'}}
				</div>
			</div>
			<div class="wrapper" ref="wrapper">
				<div class="device-list">
					<div class="row" v-if="msgList.length==0">
						<div class="wrap">
							<div class="ctx">
								<p class="msg" style="text-align:center;margin:10px 0;">没有新的消息</p>
							</div>
						</div>
					</div>
					<div class="row" v-for="(item,i) in msgList" @click="chooseMsg(item,i)">
						<div class="ctrl" :class="{show:edit}">
							<div class="radio" :class="{chose:item.choose}"></div>
						</div>
						<div class="wrap">
							<div class="icon" :class="{unread:item.unread}">
								<img src='@/assets/icons/device_msg.png'>
							</div>
							<div class="ctx">
								<p class="info">
									<span class="title">{{item.efairydevice_name}}</span>
									<span class="date">{{item.efairydevicemsg_time}}</span>
								</p>
								<p class="msg" :class="{show:edit}">{{item.efairydevicemsg_content}}</p>
							</div>
						</div>

					</div>
				</div>
				<div class="edit-button-box" :class="{show:edit}">
					<div class="dcy-radio" @click="chooseAll()">
						<div class="radio" :class="{chose:chooseAllFlag}"></div>全选
					</div>
					<a class="dcy-btn" @click="alertMsg(1,'全部删除','确定删除将所选设备消息吗？')">删除</a>
					<a class="dcy-btn" @click="alertMsg(2,'全部已读','确定将所选设备消息标记为已读吗？')">已读</a>
				</div>
			</div>

		</section>
		<bottom-tab :showNewMessage="showNewMessage" :newMessageCount="newMessageCount" />
	</div>
</template>

<script>
import Bus from "@/service/bus";
import { Dialog } from "vant";
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
import rongCloudInit from "@/components/rongCloud/init";

// 测试版：vnroth0kvdmso
// 正式版：m7ua80gbmpi3m

const rcAppKey = "vnroth0kvdmso";
const rcAppkeyProduction = "m7ua80gbmpi3m";

export default {
    name: "messageIndex",
    components: {
        bottomTab
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            msgList: this.$store.getters.getDeviceMsg,
            edit: false,
            chooseAllFlag: false,
            rcToken: this.$store.state.rcToken,
            showNewMessage: false,
            newMessageCount: 1
        };
    },
    async mounted() {
        // this.initRc();
        this.msgList.forEach(item => {
            item.unread = false;
        });
        this.$nextTick(() => {
            // document.title = "消息列表";
            this.setupBetterScroll();
        });
    },

    methods: {
        onClickLeft() {},
        initRc() {
            const rcAppToken = this.rcToken;
            // connectRongCloud();
            // function connectRongCloud() {
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
            this.$store.dispatch("pushNewMsgToBottomNav", 2);

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
            console.log(isExist);
            if (!isExist) {
				msg.unread = true;
				if(this.msgList.length>10) this.msgList.pop();
                this.msgList.unshift(msg);
            }
        },
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
        },
        editMessage() {
            this.edit = !this.edit;
        },

        chooseMsg(item, indexOfItem) {
            if (this.edit) {
                this.$set(item, "choose", !item.choose);
            } else {
                item.unread = false;
                Bus.$emit("hideNewDeviceMsg");
                this.$store.dispatch("cancelNewMsgToBottomNav");
                this.$router.push({
                    name: "deviceChat",
                    params: {
                        did: item.efairydevicemsg_from_id.replace(
                            "device_",
                            ""
                        ),
                        pid: 0
                    },
                    query: {
                        msgobj_id: item.efairymsg_from_id
                    }
                });
            }
        },
        alertMsg(type, title, msg) {
            Dialog.confirm({
                title: title,
                message: msg
            })
                .then(() => {
                    // on confirm
                    if (type == 2) {
                        this.msgList.forEach(item => {
                            console.log(item);
                            item.unread = false;
                            Bus.$emit("hideNewDeviceMsg");
                            this.$store.dispatch("cancelNewMsgToBottomNav");
                        });
                    }
                    if (type == 1) {
                        this.msgList = [];
                    }
                    this.edit = false;
                })
                .catch(() => {
                    // on cancel
                });
        },
        chooseAll() {
            this.chooseAllFlag = !this.chooseAllFlag;
            this.msgList.forEach(msg => {
                msg.choose = this.chooseAllFlag;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.dcy-btn {
    float: right;
    line-height: 32px;
    font-size: 15px;
    color: #fff;
    background: $dcyColor;
    text-align: center;
    min-width: 74px;
    margin: 9px;
    border-radius: 32px;
    font-weight: 300;
}

.dcy-radio {
    float: left;
    color: #3a3a3a;
    font-size: 12px;
    margin: 8px 12px;
    .radio {
        margin: auto;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid #364760;
        opacity: 0.2;
        position: relative;
        top: 7px;
        margin-right: 10px;
        display: inline-block;
        &.chose {
            opacity: 1;
            border-color: $dcyColor;
            &:before {
                content: "";
                position: absolute;
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                background: $dcyColor;
                border-radius: 50%;
                z-index: 2;
            }
        }
    }
}

.edit-button-box {
    position: absolute;
    z-index: 99;
    bottom: 0;
    background: #fff;
    width: 100%;
    box-shadow: 0px -1px 1px #efefef;
    height: 0;
    opacity: 0;
    transition: all 0.15s ease-in-out;
    overflow: hidden;
    &.show {
        height: 50px;
        opacity: 1;
    }
}

.wrapper {
    position: absolute;
    top: 40px;
    width: 100%;
    bottom: 55px;
}

.device-list {
    // margin-top: 88px;
    padding-bottom: 55px;
    overflow: hidden;
    .row {
        display: flex;
        margin: 8px;
        .ctrl {
            align-items: center;
            display: flex;
            overflow: hidden;
            width: 0;
            opacity: 0;
            transition: width 0.15s ease-in-out;
            &.show {
                width: 30px;
                margin-right: 8px;
                opacity: 1;
            }
            .radio {
                margin: auto;
                width: 20px;
                height: 20px;
                border-radius: 20px;
                border: 1px solid #364760;
                position: relative;
                display: inline-block;

                &.chose {
                    &:before {
                        content: "";
                        position: absolute;
                        width: 80%;
                        height: 80%;
                        top: 10%;
                        left: 10%;
                        background: $dcyColor;
                        border-radius: 50%;
                        z-index: 2;
                    }
                }
            }
        }
        .wrap {
            flex: 1;
            background: #fff;
            border-radius: 4px;
            display: flex;
            transition: all 0.3s ease-in-out;
            .icon {
                width: 60px;
                align-items: center;
                display: flex;
                text-align: center;
                position: relative;
                &.unread {
                    &::before {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        background: #ff2c2c;
                        border-radius: 8px;
                        right: 15px;
                        top: 15px;
                        content: "";
                    }
                }
                img {
                    margin: auto;
                    width: 36px;
                }
            }
            .ctx {
                flex: 2;
                margin-right: 10px;
                .info {
                    font-weight: normal;
                    display: flex;
                    margin: 10px 0 5px;
                    .title {
                        font-size: 16px;
                        color: #333;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        word-break: break-all;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        margin-right: 5px;
                        line-height: 22px;
                        flex: 1;
                    }
                    .date {
                        font-size: 12px;
                        color: #666;
                        word-break: keep-all;
                        white-space: nowrap;
                        line-height: 22px;
                    }
                }
                .msg {
                    margin: 0 0 10px;
                    font-size: 14px;
                    color: #666;
                    overflow: hidden;
                    &.show {
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }
}

.edit-bar {
    height: 35px;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 99;
    &-span {
        font-size: 12px;
        color: $dcyColor;
        float: right;
        line-height: 35px;
        margin-right: 8px;
        img {
            height: 12px;
            margin-right: 4px;
        }
    }
}
</style>
