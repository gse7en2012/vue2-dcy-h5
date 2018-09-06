<template>
	<div class="main">
		<van-nav-bar title="设备列表" @click-left="goBack" left-arrow />
		<form action="/" class="search-box">
			<div class="fliter" @click="show=true">{{current.name}}</div>
			<van-search v-model="value" placeholder="请输入项目名称" background="#fff">
				<!-- <div slot="action" @click="showprojectMapPopup()">
					<img src="@/assets/icons/map.png" class="map">
				</div> -->
			</van-search>
		</form>
		<div class="wrapper" ref="wrapper" :style="{height:calcHeight+'px'}">
			<div class="device-list">
				<div class="row" v-for="(item,i) in deviceList" @click="gotoDeviceDetail(item,i)">

					<div class="wrap">
						<div class="icon">
							<img src='@/assets/icons/device_icon.png'>
						</div>
						<div class="ctx">
							<p class="info">
								<span class="title">{{item.title}}</span>
								<span class="green">正常</span>
							</p>
							<p>
								<label>设备UUID：09283490182
								</label>
							</p>

							<p class="status-box">
								<span class="left green">
									在线</span>
								<span class="right">
									<img src='@/assets/icons/device_status1.png'> 信号
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>


		<van-actionsheet v-model="show" :actions="actions" @select="onSelect" />

	</div>

</template>

<script>
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
import { Toast } from "vant";



export default {
    name: "deviceList",
    components: {
        bottomTab,
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            value: "",
            tmp: [],
            deviceList: [],
            calcHeight: 500,
			show: false,
			current:{name:'全部'},
            actions: [
                { name: "全部" },
                {
                    name: "正常"
                    // subname: "描述信息"
                },
                { name: "故障" },
                {
                    name: "报警"
                    // disabled: true
                }
            ]
        };
    },
    async mounted() {
        this.deviceList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是项目标题测试自猪猪猪猪长很长很长`,
                nums: "14",
                msg: `这是地址啊啊啊啊啊${i}长很长很长长很长很长长很长很长`,
                choose: false,
                unread: true,
                id: i + 1
            };
        });
        this.$nextTick(() => {
            // document.title = "项目列表";
            this.calcHeight =
                document.querySelector(".main").offsetHeight -
                this.$refs.wrapper.offsetTop;
            this.setupBetterScroll();
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
        gotoDeviceDetail(item) {
            this.$router.push({ name: "deviceDetail" });
        },

        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
			this.show = false;
			this.current=item;
            Toast(item.name);
        }
    }
};
</script>

<style lang="scss" scoped>

@import '@/assets/color.scss';

.search-box {
    // margin-top: 46px;
    display: flex;
    .van-search {
        flex: 1;
    }
    .map {
        width: 16px;
        position: relative;
        top: 4px;
    }
    .fliter {
        width: 30px;
        background: #fff;
        line-height: 46px;
        font-size: 14px;
        color: #333;
        padding: 0 15px 0 10px;
        position: relative;
        &::after {
            content: "";
            width: 6px;
            height: 6px;
            border: 2px solid #aaa;
            border-top: 0;
            border-right: 0;
            transform: rotate(-45deg);
            top: 0;
            right: 0;
            top: 17px;
            right: 2px;
            position: absolute;
        }
    }
}

.wrapper {
    // position: absolute;
    margin-top: 10px;
    // top: 100px;
    overflow: hidden;
    width: 100%;
    bottom: 0;
    // height: calc(100% - 102px);
    overflow: hidden;
    position: relative;
}

.device-list {
    // padding-bottom: 20px;
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            padding: 3px 0;
            .icon {
                width: 70px;
                position: relative;
                text-align: center;
                img {
                    margin: 15px auto;
                    width: 36px;
                }
            }
            .ctx {
                flex: 2;
                margin-right: 10px;
                .nums {
                    line-height: 22px;
                    &-p {
                        width: 12px;
                        margin-left: 3px;
                        position: relative;
                        top: 1px;
                    }
                }
                .map-s {
                    width: 12px;
                    opacity: 0.5;
                    position: relative;
                    top: 3px;
                    margin-right: 6px;
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
                        font-size: 15px;
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
                .status-box {
                    margin: 0 0 10px;
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
                    .left {
                        flex: 1;
                        position: relative;
                        padding-left: 14px;
                        &::before {
                            content: "";
                            position: absolute;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            left: 0;
                            background: #3fb059;
                            top: 50%;
                            margin-top: -4px;
                        }
                    }
                    .right {
                        flex: 1;
                        text-align: right;
                        img {
                            height: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
