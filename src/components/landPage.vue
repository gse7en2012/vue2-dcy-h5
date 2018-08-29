<template>
	<div>
		<van-loading type="spinner" />
	</div>
</template>

<script>
import { Dialog } from "vant";
import BScroll from "better-scroll";
export default {
    name: "landPage",
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
		document.title = "Loading";
		// this.$router.replace('message');
		location.href="/#/message"
    },

    methods: {
        onClickLeft() {}
    }
};
</script>

<style lang="scss" scoped>
$dcyColor: #282549;

.van-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
}
</style>
