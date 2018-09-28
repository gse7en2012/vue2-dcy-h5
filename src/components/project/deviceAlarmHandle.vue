<template>
	<div class="main">
		<van-nav-bar title="报警信息处理页面" @click-left="goBack" left-arrow />
		<section class="page-main" ref="wrapper">
			<div>
				<div class="main-box">
					<div class="title row">
						<span class="l">{{deviceName}}</span>
					</div>
					<div class="section" v-for="(item,i) in showList" :key="i">
						<div class="row">
							<span class="l">报警值/阈值</span>
							<span class="r">{{item.efairydevicealarmstatistics_highest_value}}</span>
						</div>
						<div class="row">
							<span class="l">报警时间</span>
							<span class="r ">{{item.efairydevicealarmstatistics_start_time}}</span>
						</div>
						<div class="row">
							<span class="l">{{item.efairydevicealarmstatistics_c_name}}</span>
							<span class="r red">{{item.efairydevicealarmstatistics_c_alarm}}</span>
						</div>
					</div>

					<p class="more-tips" @click="toggleMore()">
						{{showMoreFlag?'收起更多':'查看更多'}}
						<img src="@/assets/icons/more.png" :class="{'rev':showMoreFlag}">
					</p>

				</div>

				<div class="box">
					<!-- <van-cell-group class="op-list"> -->
					<van-cell @click="showDatePopup('start')" is-link>
						<span class="van-cell-text">排查时间</span>
						<div class="van-cell-box">
							<span>{{startDate}}</span>
						</div>
					</van-cell>

					<van-cell is-link @click="showActions(1)">
						<span class="van-cell-text">排查现场</span>
						<div class="van-cell-box">
							<span>{{isScene.name}}</span>
						</div>
					</van-cell>

					<van-cell is-link @click="showActions(2)">
						<span class="van-cell-text">排查隐患</span>
						<div class="van-cell-box">
							<span>{{isFixed.name}}</span>
						</div>
					</van-cell>
					<!-- </van-cell-group> -->
				</div>

				<div class="box">
					<div class="ctx">
						<textarea class="desc-txt" placeholder="在这里输入描述内容" rows="4"></textarea>
					</div>
				</div>

				<div class="box">
					<div class="title">上传图片</div>
					<div class="ctx">
						<div class="img-uploader">
							<div class="item" v-for="(img,i) in uploadList" :key="i">
								<van-icon name="close" @click="deleteUploadImg(i)" />
								<img :src="img.content" :class="{'ver':img.isWide}" @click="previewUploadImg(i)">
							</div>

								<van-uploader :after-read="onReadUploadImg" class="item add" v-if="uploadList.length<=8" />
							</div>
						</div>
					</div>

					<a class="dcy-btn">提交</a>

				</div>
		</section>
		<van-popup v-model="showDatePicker" @click-overlay="closeDatePopup()" position="bottom" lazy-render>
			<van-datetime-picker v-model="currentDate" type="datetime" @confirm="setTime" :title="datePickerTitle" />
		</van-popup>

		<van-actionsheet v-model="show" :actions="actions" @select="onSelect" />

	</div>
</template>

<script>
import { Dialog, ImagePreview } from "vant";
import BScroll from "better-scroll";
import moment from "moment";

export default {
    name: "deviceAlarmHandle",
    data() {
        return {
            deviceName: this.$store.state.tmpDeviceName,
            list: [],
            showList: [],
            idSeed: 1,
            uploadList: [],
            uploadImgFlag: false,
			showMoreFlag: false,
			startDate:'',
            currentDatePickerType: "start",
            currentDate: new Date(),
            showDatePicker: false,
            datePickerTitle: "排查时间",
            imgPrevie: null,
            //actions
            actions: [{ name: "是", status: 1 }, { name: "否", status: 0 }],
            currentModel: null,
            isScene: { name: "否", status: 0 },
            isFixed: { name: "否", status: 0 },
            show: false
        };
    },
    async mounted() {
        // document.title = "我的";
        this.list = this.$store.getters.deviclAlarmListChooseList || [];
        this.showList.push(this.list[0]);
        this.setupBetterScroll();
    },

    methods: {
        goBack() {
            this.$router.back();
        },
        toggleMore() {
            if (!this.showMoreFlag) {
                this.showList = this.list.map(item => item);
                this.showMoreFlag = true;
            } else {
                this.showList = [];
                this.showList.push(this.list[0]);
                this.showMoreFlag = false;
            }
        },
        showActions(type) {
            type == 1
                ? (this.currentModel = "isScene")
                : (this.currentModel = "isFixed");
            this.show = true;
        },
        onSelect(item) {
            this.show = false;
            this[this.currentModel] = item;
            console.log(this.isScene, this.isFixed);
        },
        onReadUploadImg(file) {
            file.id = this.idSeed++;
            this.getImgWidthAndHeight(file);
            setTimeout(() => {
                this.uploadList.push(file);
            }, 0);
        },
        previewUploadImg(i) {
            this.imgPrevie = ImagePreview({
                images: this.uploadList.map(item => item.content),
                startPosition: i
            });
        },
        deleteUploadImg(i) {
            this.$dialog
                .confirm({
                    message: "是否删除该照片"
                })
                .then(() => {
                    this.uploadList.splice(i, 1);
                });
        },
        getImgWidthAndHeight(file) {
            const tmp = new Image();
            tmp.src = file.content;
            tmp.onload = () => {
                console.log(tmp.width, tmp.height);
                file.width = tmp.width;
                file.height = tmp.height;
                if (tmp.width > tmp.height) file.isWide = true;
            };
        },
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
        },
        showDatePopup(type) {
            this.showDatePicker = true;
            this.currentDatePickerType = type;
            this.datePickerTitle = type == "start" ? "开始日期" : "结束日期";
        },
        closeDatePopup() {
            this.showDatePicker = false;
            this.$emit("showBar");
        },
        setTime(date) {
            // const formatDate = [
            //     date.getFullYear(),
            //     date.getMonth() + 1 < 10
            //         ? "0" + (date.getMonth() + 1)
            //         : date.getMonth() + 1,
            //     date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            // ].join("-");
            const formatDate = moment(date).format("YYYY-MM-DD HH:mm:ss");

            if (this.currentDatePickerType == "start")
                this.startDate = formatDate;
            if (this.currentDatePickerType == "end") this.endDate = formatDate;
            this.showDatePicker = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

.main-box {
    background: #fff;
    padding-bottom: 5px;
    .section {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        margin: 0 15px;
        &:last-of-type {
            border-bottom: 0;
        }
    }
    .row {
        display: flex;
        padding: 5px 0;
        color: #666;
        span {
            flex: 1;
            font-size: 14px;
            &.r {
                text-align: right;
                flex: 2;
            }
        }
        &.title {
            font-size: 16px;
            line-height: 28px;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
            padding: 4px 15px;
            .l {
                // font-weight: bold;
                font-size: 16px;
                flex: 2;
                color: #000;
            }
        }
    }
}
.more-tips {
    text-align: center;
    font-size: 13px;
    color: #999;
    margin: 5px;
    img {
        width: 13px;
        position: relative;
        left: 4px;
        top: 1px;
        transition: all 0.2s ease-in-out;
        &.rev {
            transform: rotate(-180deg);
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
        color: #666666;
        letter-spacing: 0;
        line-height: 1.5;
    }
    .title {
        padding: 8px 15px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
    }
    .desc-txt {
        width: 100%;
        background: #fff;
        border: 0;
        resize: none;
    }
}

.img-uploader {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -4px;
    .item {
        flex: 0 0 33.333%;
        padding-top: calc(33.333% - 8px);
        box-sizing: border-box;
        border: 4px solid #fff;
        background: #ddd;
        position: relative;
        overflow: hidden;
        .van-icon {
            font-size: 16px;
            position: absolute;
            width: 20px;
            right: 0;
            top: 0;
            z-index: 10;
            background: $dcyColor;
            text-align: center;
            height: 20px;
            line-height: 20px;
            color: #fff;
            opacity: 0.8;
        }
        img {
            width: 100%;
            position: absolute;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            &.ver {
                width: auto;
                height: 100%;
            }
        }
        &.add {
            &:after {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-bottom: 3px solid #9a9a9a;
                width: 40%;
                height: 0;
            }
            &:before {
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-left: 3px solid #9a9a9a;
                width: 0;
                height: 40%;
            }
        }
    }
}

.img-grid-uploader {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 相当于 1fr 1fr 1fr */
    grid-template-rows: repeat(3, 1fr); /* fr单位可以将容器分为几等份 */
    grid-gap: 10px; /* grid-column-gap 和 grid-row-gap的简写 */
    grid-auto-flow: row;
    .item {
        background: #ddd;
        height: 0;
        padding-bottom: 100%;
        background: #ddd;
    }
}

.dcy-btn {
    display: block;
    color: #fff;
    background: #282549;
    border: 0;
    width: 90%;
    font-size: 16px;
    line-height: 42px;
    margin: 15px auto;
    text-align: center;
    border-radius: 10vw;
}
</style>
