<template>
	<div class="main">
		<form action="/" class="search-box">
			<van-search v-model="value" placeholder="请输入报告标题" @search="onSearch" background="#fff" />
		</form>

		<div class="wrapper" ref="wrapper">
			<div class="report-list">
				<div class="row" v-for="(item,i) in reportList">
					<div class="wrap">
						<div class="ctx">
							<p class="info">
								<span class="title" @click="gotoDetail(item,i)">{{item.efairyreport_title||'待编辑'}}</span>
								<span class="del" @click="deleteReport(item)">
									<img src="@/assets/icons/trash.png">
								</span>
							</p>
							<div @click="gotoDetail(item,i)">
								<p>
									<label>报告编号：
										<span>#{{item.efairyreport_id}}</span>
									</label>
									<label>统计时间：
										<span>{{item.st}}-{{item.et}}</span>
									</label>
								</p>
								<p>
									<label>生成时间：
										<span>{{item.efairyreport_add_time}}</span>
									</label>
								</p>
								<p>
									<label>点位总数：
										<span>{{item.efairyreport_device_number}}</span>
									</label>
									<label>项目数：
										<span>{{item.efairyreport_project_number}}</span>
									</label>
								</p>
							</div>
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
    name: "reportList",
    data() {
        return {
            reportList: [],
            scroll: null,
            refresh: this.$route.query.refresh == 1,
            value: ""
        };
    },
    watch: {
        refresh(val) {
            this.getReportList();
        }
    },
    async mounted() {
        await this.getReportList();
        this.$nextTick(() => {
            this.setupBetterScroll();
        });
    },
    methods: {
        onSearch() {},
        async getReportList() {
            const data = await this.$service.reportService.getReportList({});
            this.reportList = data.result.report_list;
            this.reportList.forEach(item => {
                item.st = moment(item.efairyreport_start_time).format("MM/DD");
                item.et = moment(item.efairyreport_end_time).format("MM/DD");
            });
            if (this.scroll) this.scroll.finishPullDown();
        },
        async deleteReport(report) {
            const config = {
                message: `是否删除《${report.efairyreport_title || "待编辑"}》`
            };
            Dialog.confirm(config)
                .then(() => {
                    this.$service.reportService
                        .deleteReport({
                            efairyreport_id_list: JSON.stringify([
                                report.efairyreport_id
                            ])
                        })
                        .then(() => {
                            this.$toast("删除成功！");
                            this.getReportList();
                        });
                })
                .catch(() => {
                    // on cancel
                });
        },
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true,
                pullDownRefresh: {
                    threshold: 0,
                    stop: 0
                }
            });
            this.scroll.on("pullingDown", () => {
                this.getReportList();
            });
            // setTimeout(() => {
            //     this.scroll.refresh();
            // }, 1000);
        },
        gotoDetail(item) {
            // this.$router.push({ name: "reportDetail" });
            this.$router.push(`/report/${item.efairyreport_id}/detail`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.nobar {
    .wrapper {
        top: 88px;
    }
}

.wrapper {
    position: fixed;
    top: 140px;
    overflow: hidden;
    width: 100%;
    bottom: 55px;
}

.report-list {
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
                p {
                    margin: 6px 10px;
                    font-size: 14px;
                    color: #333;
                    overflow: hidden;
                    display: flex;
                    label {
                        flex: 1;
                        span {
                            color: #666;
                            // font-weight: 300;
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
