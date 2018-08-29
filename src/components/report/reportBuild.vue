<template>
	<div class="main">
		<div class="edit-bar">
			<div class="edit-bar-span" @click="editMessage()">
				<img src="@/assets/icons/edit.png">{{edit?'取消':'选择'}}
			</div>
		</div>
		<div class="wrapper" ref="wrapper">
			<div class="project-list">
				<div class="row" v-for="(item,i) in deviceList" @click="chooseMsg(item,i)">
					<div class="ctrl" :class="{show:edit}">
						<div class="radio" :class="{chose:item.choose}"></div>
					</div>
					<div class="wrap">
						<!-- <div class="icon" :class="{unread:item.unread}">
							<img src='@/assets/icons/device_msg.png'>
						</div> -->
						<div class="ctx">
							<p class="info">
								<span class="title">{{item.title}}</span>
								<span class="nums">{{item.nums}}<img src="@/assets/icons/nums.png" class="nums-p"></span>
							</p>
							<p class="msg">设备数 90</p>
						</div>
					</div>
				</div>
			</div>
			<div class="edit-button-box" :class="{show:edit}">
				<div class="dcy-radio" @click="chooseAll()">
					<div class="radio" :class="{chose:chooseAllFlag}"></div>全选
				</div>
				<a class="dcy-btn" @click="showPop()">下一步</a>
			</div>
		</div>
		<van-popup v-model="popShow" position="right" :overlay="false" class="report-popup">
			<report-popup v-on:close-popup="closePop" v-bind:project-list="tmp" />
		</van-popup>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import reportPopup from "./reportPopup";

export default {
    name: "messageIndex",
    components: {
        reportPopup
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            deviceList: [],
            edit: false,
            chooseAllFlag: false,
            popShow: false,
            tmp: []
        };
    },
    async mounted() {
        this.deviceList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是标题紫薯很长很长很长很长很长很长很长`,
                nums: "33",
                msg: `${i}.这是消息啊啊啊${i}条哟哦哟`,
                choose: false,
                unread: true,
                id: i
            };
        });
        this.$nextTick(() => {
            // document.title = "生成报告";
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });

            // let wrapper = document.querySelector(".wrapper");
            // let scroll = new BScroll(wrapper);
        });
    },

    methods: {
        onClickLeft() {},
        showPop() {
			this.popShow = true;
			this.$emit('hideBotBar');
            this.tmp = this.deviceList.filter(item=>item.choose);
		},
		closePop(){
			this.popShow=false;
			this.$emit('showBotBar');
		},
        editMessage() {
            this.edit = !this.edit;
        },
        chooseMsg(item, indexOfItem) {
            if (!this.edit) return;
            this.$set(item, "choose", !item.choose);
        },
        alertMsg(title, msg, type) {
            Dialog.confirm({
                title: title,
                message: msg
            })
                .then(() => {
                    // on confirm
                    console.log(this.deviceList.filter(item => item.choose));
                    if (type == 1) {
                    }
                })
                .catch(() => {
                    // on cancel
                });
        },
        chooseAll() {
            this.chooseAllFlag = !this.chooseAllFlag;
            this.deviceList.forEach(msg => {
                msg.choose = this.chooseAllFlag;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.report-popup {
    width: 100%;
	height: 100%;
	background: #eef0f3;
}

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
    padding: 8px 12px;
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
    position: fixed;
    top: 126px;
    width: 100%;
    bottom: 55px;
    overflow: hidden;
}

.nobar{
	.wrapper{
		top:88px;
	}
}

.project-list {
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
                margin: 0 12px;
                .nums {
                    line-height: 22px;
                    &-p {
                        width: 12px;
                        margin-left: 3px;
                        position: relative;
                        top: 1px;
                    }
                }
                p {
                    margin: 6px auto;
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
                    display: flex;
                    label {
                        flex: 1;
                        span {
                            font-weight: 300;
                        }
                    }
                }
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
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
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
    top: 44px;
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
