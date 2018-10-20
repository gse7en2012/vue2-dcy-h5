<template>
	<div class="main">
		<form action="/" class="search-box">
			<van-search v-model="keyword" placeholder="请输入关键词" @search="onSearch" background="#fff" />
		</form>
		<div class="device-list">
			<div class="row" v-if="deviceList.length==0">
				<div class="wrap">
					<div class="ctx">
						<p>没有数据</p>
					</div>
				</div>
			</div>
			<div class="row" v-for="(item,i) in deviceList">
				<div class="wrap">
					<div class="ctx">
						<p class="info">
							<span class="title" @click="gotoDetail(item,i)">{{item.efairydevice_name}}</span>
						</p>
						<div @click="gotoDetail(item,i)">
							<p>
								<label>设备类型：
									<span>{{item.efairydevice_device_type}}</span>
								</label>
							</p>
							<p>
								<label>火警/预警/故障：
									<i class="red">{{item.efairydevice_alarm_times}}</i>/<i class="yellow">{{item.efairydevice_alarm_times}}</i>
								</label>
							</p>
							<p>
								<label>设备uuid：
									<span>{{item.efairydevice_uuid}}</span>
								</label>
							</p>
							<p>
								<label>设备地址：
									<span>{{item.efairydevice_address}}</span>
								</label>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BScroll from "better-scroll";
import moment from "moment";
import { Dialog } from "vant";

export default {
    name: "reportProjectDeviceList",
    data() {
        return {
            deviceList: [],
            value: "",
            reportId: this.$route.params.rid,
            proejctId: this.$route.params.pid,
            keyword: "",
            page: 1,
            size: 200
        };
    },
    async mounted() {
        console.log(this.$route);
        await this.getDeviceList();
        this.$nextTick(() => {});
    },
    methods: {
        onSearch() {
            this.getDeviceList();
        },
        async getDeviceList() {
            const data = await this.$service.reportService.getReportDeviceList({
                efairyreport_id: this.reportId,
                efairyproject_id: this.proejctId,
                keyword: this.keyword,
                page: this.page,
                size: this.size
            });
            this.deviceList = data.result.efairyproject_device_list;
            // this.deviceList.forEach(item => {
            //     item.st = moment(item.efairyreport_start_time).format("MM/DD");
            //     item.et = moment(item.efairyreport_end_time).format("MM/DD");
            // });
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
        gotoDetail(item) {
            this.$router.push({
				name:'reportDeviceDetail',
				params:{
					did:item.efairydevice_id
				}
			});
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.device-list {
    padding-bottom: 10px;
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        margin: 8px;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            border-radius: 4px;
            .ctx {
                flex: 1;
                padding-bottom: 5px;
                p {
                    margin: 6px 10px;
                    font-size: 14px;
                    color: #333;
                    overflow: hidden;
                    display: flex;
                    label {
                        flex: 1;
                        display: flex;
                        span {
                            color: #666;
                            flex: 1;
                            // font-weight: 300;
                        }
                        i {
                            font-style: normal;
                        }
                    }
                }
                .info {
                    display: flex;
                    padding: 10px;
                    border-bottom: 1px solid #efefef;
                    margin: 0;
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
                    .del {
                        img {
                            width: 100%;
                        }
                        width: 14px;
                        position: relative;
                        top: 3px;
                    }
                }
            }
        }
    }
}
</style>
