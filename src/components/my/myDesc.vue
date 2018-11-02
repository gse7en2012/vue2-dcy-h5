<template>
	<div class="main">
		<van-nav-bar title="功能特性" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main" ref="wrapper">
			<div class="box">
				<p>【中城物联电气火灾监控系统】是以电气火灾早期预警监控为主要目的、应用数字化技术、采用分布式设计方案推出的新一代电气火灾监控系统。其主要功能如下：
				</p>
				<p>一、设备展示</p>
				<p>可展示项目旗下所有的设备，直观地显示当前设备的基本信息和运行状态</p>
				<img src="@/assets/desc/6.jpg">
				<p>二、设备导航</p>
				<p>可随时随地查看设备的精确地理位置，配合GPS导航工具，更便于维护工作的开展。</p>
				<img src="@/assets/desc/4.jpg">
				<img src="@/assets/desc/3.jpg">
				<p>三、监控详情展示</p>
				<p>可实时查看监控环境的用电情况，以及浏览监控环境7天的数据图表，能够及时发现电气火灾隐患。</p>
				<img src="@/assets/desc/8.jpg">
				<img src="@/assets/desc/9.jpg">
				<img src="@/assets/desc/7.jpg">
				<p>四、设备控制</p>
				<p>可远程控制设备。</p>
				<img src="@/assets/desc/5.jpg">
				<p>五、报告</p>
				<p>可统计某段时间的设备运行情况，准确地反映用电安全隐患。</p>
				<img src="@/assets/desc/1.jpg">
				<img src="@/assets/desc/2.jpg">

			</div>
		</section>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
import axios from "axios";

export default {
    name: "myDesc",
    data() {
        return {
            // query: this.$route.query,
        };
    },
    async mounted() {
        // this.setupBetterScroll();
        this.$nextTick(() => {
            // document.title = "消息列表";
            this.setupBetterScroll();
        });
    },

    methods: {
        goBack() {
            this.$router.back();
        },

        logout() {
            this.$store.commit("accountLogout");
            this.$router.push({ name: "loginPage" });
        },
        async setupBetterScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    tap: true,
                    click: true
                });
            } else {
                this.scroll.refresh();
            }
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;
.box {
    padding: 15px;
    background: #fff;
    p {
        line-height: 1.8;
        font-size: 15px;
        color: #666;
        margin: 10px 0;
        text-align: justify;
    }
    img {
        max-width: 100%;
        margin: 10px 0;
        display: block;
    }
}
</style>
