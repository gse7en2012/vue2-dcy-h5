<template>
	<div class="main">
		<form action="/" class="search-box">
			<van-search v-model="value" placeholder="请输入关键词" @search="onSearch" background="#fff" />
		</form>

		<div class="wrapper" ref="wrapper">
			<div class="report-list">
				<div class="row" v-for="(item,i) in reportList" @click="gotoDetail(item,i)">
					<div class="wrap">
						<div class="ctx">
							<p class="info">
								<span class="title">{{item.title}}</span>
								<span class="del">
									<img src="@/assets/icons/trash.png">
								</span>
							</p>
							<p>
								<label>报告编号：
									<span>#1</span>
								</label>
								<label>生成时间：
									<span>06/01-06/03</span>
								</label>
							</p>
							<p>
								<label>统计时间：
									<span>2018-08-01 11:22:11</span>
								</label>
							</p>
							<p>
								<label>点位总数：
									<span>90</span>
								</label>
								<label>项目数：
									<span>111</span>
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

export default {
    name: "reportList",
    data() {
        return {
            reportList: [],
            value: ""
        };
    },
    async mounted() {
        this.reportList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是项目标题测试自猪猪猪猪长很长很长`,
                nums: "14",
                msg: `这是地址啊啊啊啊啊${i}长很长很长长很长很长长很长很长`,
                choose: false,
                unread: true,
                id: i
            };
        });
        this.setupBetterScroll();
    },
    methods: {
        onSearch() {},
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
            // this.$router.push({ name: "reportDetail" });
            this.$router.push(`/report/${item.id}/detail`);
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;
// $red: #ff0000;
// $green: #3fb059;
// $orange: #ff7200;
// $yellow: #ffb900;

$color-list: #ff0000 #3fb059 #ff7200 #ffb900;
$color-name-list: red green orange yellow;

@each $color in $color-name-list {
    $i: index($color-name-list, $color);
    .#{$color} {
        color: nth($color-list, $i);
    }
}

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
