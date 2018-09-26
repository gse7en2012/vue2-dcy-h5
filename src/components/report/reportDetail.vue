<template>
	<div class="main">
		<van-nav-bar title="报告详情" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="title-box">
					<div class="title-editable">
						这里是报告标题
						<span class="right">编辑</span>
					</div>
				</div>
				<div class="main-box">

					<div class="row">
						<span class="l">报告时间</span>
						<span class="r">2012.11.11</span>
					</div>
					<div class="row">
						<span class="l">报警点位</span>
						<span class="r">90/180</span>
					</div>
					<div class="row">
						<span class="l">项目总数</span>
						<span class="r">90/180</span>
					</div>
					<div class="row">
						<span class="l">项目总数</span>
						<span class="r">90/180</span>
					</div>
					<div class="row">
						<span class="l">项目总数</span>
						<span class="r">90/180</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">最高分133</span>
					</div>
				</div>
				<form action="/" class="search-box">
					<van-search v-model="value" placeholder="请输入项目名称" show-action @search="showprojectMapPopup" background="#fff">
						<div slot="action" @click="showprojectMapPopup()">
							<span class="point">评分</span>
						</div>
					</van-search>
				</form>

				<div class="box">
					<div class="title">
						在庆出租房
						<span class="score orange">评分87</span>
					</div>
					<div class="ctx">
						<div class="intro">
							项目负责人：
							<span>王大壮</span>
							<a class="icon"><img src="@/assets/icons/phone_big.png" /></a>
						</div>
						<div class="table">
							<table>
								<tr>
									<th>设备类型</th>
									<th>点位总数</th>
									<th>报警点位数</th>
									<th>预警点位数</th>
									<th>故障点位</th>
								</tr>
								<tr>
									<td>DDHZ4738X</td>
									<td>90</td>
									<td class="red">66</td>
									<td class="orange">66</td>
									<td class="yellow">66</td>
								</tr>
								<tr>
									<td>DDHZ4738X</td>
									<td>90</td>
									<td class="red">66</td>
									<td class="orange">66</td>
									<td class="yellow">66</td>
								</tr>
								<tr>
									<td>DDHZ4738X</td>
									<td>90</td>
									<td class="red">66</td>
									<td class="orange">66</td>
									<td class="yellow">66</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div class="box">
					<div class="title">在庆出租房</div>
					<div class="ctx">
						33333
					</div>
				</div>
				<div class="box">
					<div class="title">在庆出租房</div>
					<div class="ctx">
						33333
					</div>
				</div>
				<div class="box">
					<div class="title">在庆出租房</div>
					<div class="ctx">
						33333
					</div>
				</div>

			</div>
		</div>

	</div>

</template>

<script>
import BScroll from "better-scroll";

export default {
    name: "reportDetail",

    data() {
        return {
            // query: this.$route.query,
            active: 0,
            addressLoading: true,
            showAddressPicker: false,
            showprojectMap: false,
            value: "",
            tmp: [],
            deviceList: [],
            calcHeight: 500
        };
    },
    async mounted() {
        // console.log(this.$store.getters.deviclAlarmListChooseList);
        this.$nextTick(() => {
            // document.title = "项目列表";
            // this.calcHeight =
            //     document.querySelector(".main").offsetHeight -
            //     this.$refs.wrapper.offsetTop;
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

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

.title-box {
    padding-top: 10px;
    .title-editable {
        background: #28a8ff;
        box-shadow: 0 4px 12px 0 rgba(101, 183, 239, 0.4);
        border-radius: 4px;
        width: 94%;
        margin: 0 auto;
        color: #fff;
        font-size: 16px;
        line-height: 50px;
        padding: 0 15px;
        box-sizing: border-box;
        position: relative;
        .right {
            float: right;
            font-size: 14px;
        }
    }
}
.main-box {
    background: #fff;
    padding-bottom: 5px;
    margin-top: -30px;
    padding-top: 40px;
    border-bottom: 1px solid #eee;
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

.search-box {
    // margin-top: 46px;
    .map {
        width: 16px;
        position: relative;
        top: 4px;
    }
    .point {
        position: relative;
        right: 5px;
        &::after {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border: 4px solid transparent;
            border-bottom: 5px solid $dcyColor;
            right: -12px;
            top: -2px;
        }
        &::before {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border: 4px solid transparent;
            border-top: 5px solid #ccc;
            right: -12px;
            bottom: -3px;
        }
    }
}

.box {
    margin: 8px;
    overflow: hidden;
    border-radius: 5px;
    background: #fff;
    .van-cell {
        padding: 8px 15px;
        color: #666;
    }
    .van-cell:not(:last-child)::after {
        left: 0;
    }
    .van-cell-text {
        max-width: 90px;
        flex: 1;
        color: #666;
    }
    .van-cell-box {
        flex: 1;
        display: flex;
        flex-flow: row-reverse;
    }

    .ctx {
        padding: 8px 15px;
        font-size: 14px;
        color: #333;
        letter-spacing: 0;
        line-height: 1.5;
    }
    .title {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        font-size: 15px;
        color: #333;
        .score {
            float: right;
        }
    }
    .intro {
        margin: 10px 0;
        span {
            color: #666;
        }
        .icon {
            width: 24px;
            height: 24px;
			float: right;
			margin-top: -2px;
            img {
                width: 100%;
            }
        }
    }
    table {
        margin: 15px 0 10px;
        font-size: 12px;
        border-collapse: collapse;
        border-radius: 4px;
        width: 100%;
        overflow: hidden;
        th {
            font-weight: normal;
            background: #f9f9fa;
            padding: 6px 4px;
        }
        td {
            text-align: center;
            background: #f2f2f4;
            padding: 6px 4px;
        }
    }
}
</style>
