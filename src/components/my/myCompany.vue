<template>
	<div class="main">
		<van-nav-bar title="单位名称" @click-left="goBack" fixed left-arrow fixed />
		<section class="page-main">
			<van-cell-group class="my-cell">
				<van-field v-model="value" placeholder="请输入单位名称" type="textarea"  rows="2" autosize/>
			</van-cell-group>
			<a class="dcy-btn">确定</a>
		</section>
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";

export default {
    name: "myCompany",
    data() {
        return {
            // query: this.$route.query,
            active: 0
        };
    },
    async mounted() {},

    methods: {
        goBack() {
            this.$router.back();
        }
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.my-cell{
	margin-top: 10px;;
}

.dcy-btn {
	display: block;
	line-height: 44px;
	line-height: 44px;
    font-size: 16px;
    color: #fff;
    background: $dcyColor;
    text-align: center;
    width: 95%;
    margin: 15px auto;
    border-radius: 32px;
    font-weight: 300;
}
</style>
