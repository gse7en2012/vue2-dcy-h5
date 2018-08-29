<template>
	<div class="main">
		<van-nav-bar title="我的" @click-left="onClickLeft" fixed />
		<section class="page-main" ref="wrapper">
			<div>
				<div class="personal-info">
					<img src='@/assets/icons/bg.png' class="bg">
					<div class="box">
						<div class="avatar-box">
							<img src="@/assets/icons/avatar.png" class="avatar">
						</div>
						<div class="info">
							<div>
								<p class="r1">立即登录</p>
								<p class="r2">还需绑定手机号，否则不允操作哦</p>
							</div>
						</div>
					</div>
				</div>

				<van-cell-group class="my-list">
					<van-cell title="单位名称" is-link :to="{path:'/my/company'}">
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_copy.png" class="icon" style="width:16px;">
							</div>
						</template>
					</van-cell>
					<van-cell title="单位地址" is-link :to="{path:'/my/address'}">
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_address.png" class="icon" style="width:16px;">
							</div>
						</template>
					</van-cell>
					<van-cell title="联系号码" is-link>
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_phone.png" class="icon">
							</div>
						</template>
					</van-cell>
					<van-cell title="联系邮箱" is-link>
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_mail.png" class="icon">
							</div>
						</template>
					</van-cell>
					<van-cell title="设备供应商">
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_device.png" class="icon">
							</div>
						</template>
					</van-cell>
				</van-cell-group>

				<van-cell-group class="my-list">
					<van-cell title="关于电次元" is-link :to="{path:'/my/about'}">
						<template slot="icon">
							<div class="icon-wrapper">
								<img src="@/assets/icons/my_about.png" class="icon">
							</div>
						</template>
					</van-cell>
				</van-cell-group>
			</div>
		</section>
		<bottom-tab/>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
export default {
    name: "myIndex",
    components: {
        bottomTab
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            deviceList: [],
            edit: false,
            chooseAllFlag: false
        };
    },
    async mounted() {
        // document.title = "我的";
        this.scroll = new BScroll(this.$refs.wrapper, {
            tap: true,
            click: true
        });
    },

    methods: {
        onClickLeft() {}
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.personal-info {
    position: relative;
    height: 0;
    padding-bottom: 36%;
    img {
        width: 100%;
    }
    .bg {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
    }
    .box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        .avatar-box {
            display: flex;
            flex: 30;
            align-items: center;
            text-align: center;
            .avatar {
                width: 60px;
                background: #fff;
                border-radius: 30px;
                margin: 0 auto;
            }
        }
        .info {
            flex: 70;
            color: #fff;
            display: flex;
            align-items: center;
            p {
                margin: 8px;
            }
            .r1 {
                font-size: 20px;
            }
            .r2 {
                font-size: 14px;
            }
        }
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
