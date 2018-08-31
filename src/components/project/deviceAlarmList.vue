<template>
	<div class="main">
		<van-nav-bar title="设备报警列表" @click-left="goBack" left-arrow />
		<div class="top-box">
			<div class="tab">
				火警
			</div>
			<div class="tab">
				火警
			</div>
		</div>

		<div class="edit-bar">
			<div class="edit-bar-span" @click="editMessage()">
				<img src="@/assets/icons/edit.png">{{edit?'取消':'编辑'}}
			</div>
		</div>
		<div class="wrapper" ref="wrapper">
			<div class="device-list">
				<div class="row" v-for="(item,i) in deviceList" @click="chooseMsg(item,i)">

					<div class="ctrl" :class="{show:edit}">
						<div class="radio" :class="{chose:item.choose}"></div>
					</div>
					<div class="wrap">
						<div class="icon" :class="{unread:item.unread}">
							<img src='@/assets/icons/device_msg.png'>
						</div>
						<div class="ctx">
							<p class="info">
								<span class="title">{{item.title}}</span>
								<span class="date">{{item.time}}</span>
							</p>
							<p class="msg" :class="{show:edit}">{{item.msg}}</p>
						</div>
					</div>

				</div>
			</div>
			<div class="edit-button-box" :class="{show:edit}">
				<div class="dcy-radio" @click="chooseAll()">
					<div class="radio" :class="{chose:chooseAllFlag}"></div>全选
				</div>
				<a class="dcy-btn" @click="alertMsg('全部删除','确定删除将所选设备消息吗？')">删除</a>
				<a class="dcy-btn" @click="alertMsg('全部已读','确定将所选设备消息标记为已读吗？')">已读</a>
			</div>
		</div>
	</div>

</template>

<script>
import BScroll from "better-scroll";

export default {
    name: "deviceAlarmList",

    data() {
        return {
            // query: this.$route.query,
            active: 0,
            edit: true,
            chooseAllFlag: false,
            value: "",
            tmp: [],
            deviceList: [],
            calcHeight: 500,
            vuegConfig: {
                backAnim: "touchPoint",
                forwardAnim: "touchPoint", //options所有配置可以写在这个对象里，会覆盖全局的配置
                disable: false //对于嵌套路由，默认为关闭动画，需要在组件的data.vuegConfig中配置disable为false启用
            }
        };
    },
    async mounted() {
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
        this.deviceList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是标题紫薯很长很长很长很长很长很长很长`,
                time: "2018-09-11 11:22:33",
                msg: `${i}.这是消息主题内容啊啊啊啊啊${i}条哟哦哟33333333333`,
                choose: false,
                unread: true,
                id: i
            };
        });
    },
    methods: {
        goBack() {
            this.$router.back();
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

.wrapper {
    position: absolute;
    // margin-top: 10px;
    top: 46px;
    overflow: hidden;
    width: 100%;
    bottom: 0;
    // height: calc(100% - 102px);
    overflow: hidden;
}

.top-box {
    background: #fff;
    display: flex;
    .tab {
        flex: 1;
        text-align: center;
        font-size: 16px;
        line-height: 40px;
        height: 40px;
        position: relative;
        overflow: hidden;
        color: $dcyColor;
        &:nth-of-type(1) {
            &::before {
                content: "";
                background: #eee;
                width: 1px;
                height: 70%;
                position: absolute;
                right: 0;
                top: 15%;
            }
        }
        &::after {
            content: "";
            width: 8px;
            height: 8px;
            border: 2px solid $dcyColor;
            border-top: 0;
            border-right: 0;
            transform: rotate(-45deg);
            top: 0;
            right: 0;
            top: 14px;
            right: 30px;
            position: absolute;
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
    top: 86px;
    width: 100%;
    bottom:0;
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
    top: 46px;
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
