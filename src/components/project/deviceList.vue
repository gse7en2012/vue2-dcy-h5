<template>
	<div class="main">
		<van-nav-bar title="设备列表" @click-left="goBack" left-arrow />
		<form action="/" class="search-box">
			<div class="fliter" @click="show=true">{{current.name}}</div>
			<van-search v-model="keyword" placeholder="请输入设备名称" background="#fff" @search="getDeviceList">
				<!-- <div slot="action" @click="showprojectMapPopup()">
					<img src="@/assets/icons/map.png" class="map">
				</div> -->
			</van-search>
		</form>
		<div class="no-result" v-if="deviceList.length==0&&!showLoading">
			<img src="@/assets/icons/noresult.png">
		</div>
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="device-list">
					<div class="row" v-for="(item,i) in deviceList" @click="gotoDeviceDetail(item,i)">

						<div class="wrap">
							<div class="icon">
								<img src='@/assets/icons/device_icon.png'>
							</div>
							<div class="ctx">
								<p class="info">
									<span class="title">{{item.efairydevice_name}}</span>
									<span :class="item.className">{{item.state}}</span>
								</p>
								<p>
									<label>设备UUID：{{item.efairydevice_uuid}}
									</label>
								</p>

								<p class="status-box">
									<span class="left" :class="{green:item.efairydevice_is_online==1}">{{item.efairydevice_is_online==1?'在线':'离线'}}</span>
									<span class="right">
										<img src='@/assets/icons/device_status4.png' v-if="item.efairydevice_alarm_id==0">
										<img src='@/assets/icons/device_status1.png' v-if="item.efairydevice_alarm_id!=0&&item.efairydevice_csq_level==2">
										<img src='@/assets/icons/device_status2.png' v-if="item.efairydevice_alarm_id!=0&&item.efairydevice_csq_level==1">
										<img src='@/assets/icons/device_status3.png' v-if="item.efairydevice_alarm_id!=0&&item.efairydevice_csq_level==0"> 信号
									</span>
								</p>
							</div>
						</div>
					</div>
					<p class="loading-tips" v-if="listLoading&&!listFinished">正在加载...</p>
					<p class="loading-tips" v-if="listPage>1&&listFinished">没有更多</p>
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
import { mapState } from "vuex";

//0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常

export default {
    name: "deviceList",
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
            // query: this.$route.query,
            active: 0,
            keyword: "",
            listLoading: false,
            listPage: 1,
            listPagesize: 10,
            listFinished: false,
            alarmId: null,
            deviceStateList: [
                "离线",
                "火警",
                "预警",
                "故障",
                "启动",
                "屏蔽",
                "正常"
            ],
            deviceClassHash: [
                "grey",
                "red",
                "orange",
                "yellow",
                "green",
                "grey",
                "green"
            ],
            deviceList: [],
            show: false,
            current: { name: "全部" },
            actions: [
                //不传则返回所有状态，0-离线 1-火警 2-预警 3-故障 4-启动 5-屏蔽 6-正常
                { name: "全部", id: -1 },
                { name: "正常", id: 6 },
                { name: "故障", id: 3 },
                // { name: "屏蔽", id: 5 },
                { name: "火警", id: 1 },
                { name: "预警", id: 2 },
                { name: "离线", id: 0 },
                // { name: "启动", id: 4 }
            ]
        };
    },
    async mounted() {
        await this.getDeviceList();
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        async getDeviceList() {
            this.listPage = 1;
            this.deviceList = [];
            this.listFinished = false;
            const data = await this.$service.projectService.getDeviceList({
                efairyproject_id: this.$route.params.pid,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize,
                efairydevice_alarm_id: this.alarmId
            });
            this.deviceList = data.result.device_list;
            this.deviceList.forEach(item => {
                item.state = this.deviceStateList[item.efairydevice_alarm_id];
                item.className = this.deviceClassHash[
                    item.efairydevice_alarm_id
                ];
            });
        },
        async loadMoreDeviceList() {
            if (this.listFinished) return;
            this.listLoading = true;
            this.listPage++;
            const data = await this.$service.projectService.getDeviceList({
                efairyproject_id: this.$route.params.pid,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize,
                efairydevice_alarm_id: this.alarmId
            });
            data.result.device_list.forEach(item => {
                item.state = this.deviceStateList[item.efairydevice_alarm_id];
                item.className = this.deviceClassHash[
                    item.efairydevice_alarm_id
                ];
            });
            this.deviceList = this.deviceList.concat(data.result.device_list);
            this.listLoading = false;
            if (data.result.device_list.length < this.listPagesize)
                this.listFinished = true;

            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        setupBetterScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    tap: true,
                    click: true
                });
                this.scroll.on("scrollEnd", pos => {
                    if (pos.y < this.scroll.maxScrollY + 300) {
                        if (this.deviceList.length == 0) return;
                        this.loadMoreDeviceList();
                    }
                });
            } else {
                this.scroll.refresh();
            }
        },
        gotoDeviceDetail(item) {
            this.$router.push({ name: "deviceDetail",params:{did:item.efairydevice_id} });
        },
        onSelect(item) {
            // 点击选项时默认不会关闭菜单，可以手动关闭
            this.show = false;
            this.current = item;
            this.alarmId = item.id;
            if (item.id == -1) this.alarmId = null;
            this.getDeviceList();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

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
    // margin-top: 10px;
    // // top: 100px;
    // overflow: hidden;
    // width: 100%;
    // bottom: 0;
    // // height: calc(100% - 102px);
    // overflow: hidden;
    // position: relative;

    position: fixed;
    top: 100px;
    overflow: hidden;
    width: 100%;
    bottom: 0;
}

.no-result {
    img {
        width: 46%;
        margin: 100px auto;
        display: block;
    }
}

.device-list {
    padding-bottom: 30px;
    .loading-tips {
        text-align: center;
        margin: 8px 0;
        color: #999;
        font-size: 12px;
    }

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
                    color: #999;
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
                            background: #999;

                            top: 50%;
                            margin-top: -4px;
                        }
                        &.green {
                            &::before {
                                background: #3fb059;
                            }
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
