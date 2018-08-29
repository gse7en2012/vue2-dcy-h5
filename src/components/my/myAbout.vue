<template>
	<div class="main">
		<van-nav-bar title="关于电次元" @click-left="goBack" fixed left-arrow fixed />
		<!-- <section class="page-main" ref="wrapper"> -->
			<div class="box">
				<div class="logo-info">
					<img src="@/assets/icons/avatar.png" class="logo"/>
					<p class="ver">V1.0</p>
				</div>

				<van-cell-group class="my-list">
					<van-cell title="查看功能特性" is-link />
					<van-cell title="查看服务条款" is-link />
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-cell title="意见反馈" is-link />
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-switch-cell v-model="checked" title="接收消息提醒" />
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-switch-cell v-model="checked3" title="开通无限制短信通知费用" />
					<van-switch-cell v-model="checked2" title="开通无限制短信通知费用" />
				</van-cell-group>

			</div>
		<!-- </section> -->
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
export default {
    name: "myAbout",
    components: {
        bottomTab
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            deviceList: [],
            edit: false,
            chooseAllFlag: false,
            checked: true,
            checked2: false,
            checked3: false
        };
    },
    async mounted() {
        // document.title = "我的";
        // this.scroll = new BScroll(this.$refs.wrapper, {
        //     tap: true,
        //     click: true
        // });
    },

    methods: {
        goBack() {
            this.$router.back();
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;
.box{
	padding-top: 56px;
}
.logo-info {
	.logo{
		width: 40%;
		margin: 15px auto;
		border-radius: 50%;
		display: block;
	}
	.ver{
		color: $dcyColor;
		text-align: center;
		margin-bottom: 20px;
		margin-top: -5px;
	}
}

.my-list {
    margin-top: 10px;
    .icon-wrapper {
        width: 20px;
        margin-right: 15px;
        position: relative;
    }
    .icon {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .van-cell {
        font-size: 15px;
        height: 45px;
        line-height: 30px;
    }
}
</style>
