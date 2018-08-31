<template>
	<div class="main">
		<van-nav-bar title="设备详情" @click-left="goBack" left-arrow />
		<div class="wrapper" ref="wrapper">
			<div>
				<div class="main-box">
					<div class="title row">
						<span class="l">应再庆出租房总闸</span>
						<span class="r">V1.0032</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">应再庆出租房</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">应再庆出租房</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">应再庆出租房</span>
					</div>
					<div class="row">
						<span class="l">所属项目名称</span>
						<span class="r">广东省深圳市宝安区公明街道凤3337号广东省深圳市宝安区公明街</span>
					</div>
				</div>

				<van-cell-group class="my-list">
					<van-cell title="设备图表" is-link :to="{name:'deviceCharts'}" />
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-cell title="设备消息" is-link :to="{name:'deviceChat'}" />
				</van-cell-group>

				<!-- <van-cell-group class="my-list">
					<van-cell title="实时数据" />
				</van-cell-group> -->
				<div class="block-title">
					实时数据
				</div>
				<van-cell-group class="detail-list">
					<van-cell title="单元格">333</van-cell>
					<van-cell title="单元格" value="内容" />
					<van-cell title="单元格" value="内容" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="单元格" value="内容" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="温度通道1" value="29.0°C/70.0°C" />
					<van-cell title="单元格" value="内容" />
				</van-cell-group>
			</div>
		</div>
		<a href="tel:400-0000-688" class="phone">
			<img src="@/assets/icons/phone_big.png">
		</a>

	</div>

</template>

<script>
import BScroll from "better-scroll";

export default {
    name: "deviceDetail",

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
        font-size: 14px;
        line-height: 20px;
    }
}

.phone {
    position: fixed;
    width: 60px;
    right: 20px;
    bottom: 100px;
    z-index: 111;
    img {
        width: 100%;
        border-radius: 50%;
        box-shadow: 1p6x 1px 5px #bbb;
    }
}
</style>
