<template>
	<div class="main">
		<!-- <van-nav-bar title="项目列表" left-arrow @click-left="onClickLeft" fixed /> -->
		<van-nav-bar title="报表" @click-left="onClickLeft" fixed />

		<section class="page-main">
			<van-tabs v-model="active">
				<van-tab title="报告列表">
					<report-list/>
				</van-tab>
				<van-tab title="生成报告">
					<report-build v-on:hideBotBar="hideBar" v-on:showBotBar="showBar" />
				</van-tab>
			</van-tabs>
			<bottom-tab/>
		</section>
	</div>
</template>

<script>
import BScroll from "better-scroll";

import reportBuild from "./reportBuild";
import reportList from "./reportList";
import bottomTab from "@/components/bottomTab";

export default {
    name: "reportIndex",
    components: {
        reportBuild,
        reportList,
        bottomTab
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0
        };
    },
    async mounted() {

        this.$nextTick(() => {
            // document.title = "报表";
        });
    },
    methods: {
		onClickLeft() {},

        onSearch() {},
        hideBar() {
            console.log("hideBar");
            this.$emit("hideBotBar");
        },
        showBar() {
            this.$emit("showBotBar");
        }
    }
};
</script>

<style lang="scss" scoped>
.page-main{
	top:0;
	padding-top:44px;
}

</style>
