<template>
	<div class="main">
		<!-- <van-nav-bar title="项目列表" left-arrow @click-left="onClickLeft" fixed /> -->
		<van-nav-bar title="项目列表" @click-left="onClickLeft" fixed />
		<!-- <section class="page-main"> -->
		<section class="page-ctx">
			<form action="/" class="search-box">
				<van-search v-model="value" placeholder="请输入项目名称" show-action @search="showprojectMapPopup" background="#fff">
					<div slot="action" @click="showprojectMapPopup()">
						<img src="@/assets/icons/map.png" class="map">
					</div>
				</van-search>
			</form>
			<van-cell-group>
				<van-cell value="选择地区" is-link @click="popupAddress()" />
			</van-cell-group>

			<div class="wrapper" ref="wrapper" :style="{height:calcHeight+'px'}">
				<div class="project-list">
					<div class="row" v-for="(item,i) in deviceList" @click="goToDetail(item,i)">

						<div class="wrap">
							<div class="icon">
								<img src='@/assets/icons/project.png'>
							</div>
							<div class="ctx">
								<p class="info">
									<span class="title">{{item.title}}</span>
									<span class="nums">{{item.nums}}<img src="@/assets/icons/nums.png" class="nums-p"></span>
								</p>
								<p>
									<label>设备数
										<span class="green">30</span>
										<span>/ 90</span>
									</label>
								</p>
								<p class="count">
									<label>报警书
										<span class="red">16</span>
									</label>
									<label>报警书
										<span class="orange">16</span>
									</label>
									<label>报警书
										<span class="yellow">16</span>
									</label>
								</p>
								<p class="address"><img src="@/assets/icons/map_s.png" class="map-s">{{item.msg}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<van-popup v-model="showAddressPicker" @click-overlay="popupAddress()" position="bottom">
				<van-picker :columns="columns" @change="onChange" :loading="addressLoading" />
			</van-popup>

			<bottom-tab/>
		</section>
	</div>

</template>

<script>
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
import projectMap from "./projectMap";
const citys = {
    浙江: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
    福建: ["福州", "厦门", "莆田", "三明", "泉州"]
};

export default {
    name: "projectIndex",
    components: {
        bottomTab,
        projectMap
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            addressLoading: true,
            showAddressPicker: false,
            showprojectMap: false,
            value: "",
            tmp: [],
            calcHeight: 500,
            deviceList: [],
            columns: [
                {
                    values: Object.keys(citys),
                    className: "column1"
                },
                {
                    values: citys["浙江"],
                    className: "column2",
                    defaultIndex: 2
                }
            ]
        };
    },
    async mounted() {
        this.deviceList = Array.from({ length: 20 }).map((_, i) => {
            return {
                title: `${i}.这是项目标题测试自猪猪猪猪长很长很长`,
                nums: "14",
                msg: `这是地址啊啊啊啊啊${i}长很长很长长很长很长长很长很长`,
                choose: false,
                unread: true,
                id: i
            };
        });
        this.$nextTick(() => {
            // document.title = "项目列表";
            this.calcHeight =
                document.querySelector(".main").offsetHeight -197;
            this.setupBetterScroll();
        });
    },
    methods: {
        onClickLeft() {},
        setupBetterScroll() {
            this.scroll = new BScroll(this.$refs.wrapper, {
                tap: true,
                click: true
            });
            setTimeout(() => {
                this.scroll.refresh();
            }, 1000);
        },
        showprojectMapPopup() {
            // this.showprojectMap = true;
            this.$router.push("/project/map");
        },
        goToDetail(project) {
            this.$router.push(`/project/devices/${project.id}`);
        },
        closePop() {
            this.showprojectMap = false;
        },
        popupAddress() {
            this.showAddressPicker = !this.showAddressPicker;
            setTimeout(() => {
                this.addressLoading = false;
            }, 1000);
        },
        onChange(picker, values) {
            picker.setColumnValues(1, citys[values[0]]);
        }
    }
};
</script>

<style lang="scss" scoped>

@import '@/assets/color.scss';

.search-box {
    // margin-top: 46px;
    .map {
        width: 16px;
        position: relative;
        top: 4px;
    }
}

.page-ctx {
    margin-top: 46px;
}

.wrapper {
    // position: absolute;
    margin-top: 10px;
    overflow: hidden;
	width: 100%;
	position: relative;
}

.project-list {
    padding-bottom: 55px;
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            padding: 3px 0;
            .icon {
                width: 80px;
                position: relative;
                text-align: center;
                img {
                    margin: 15px auto;
                    width: 48px;
                }
            }
            .ctx {
                flex: 2;
                margin-right: 10px;
                .nums {
                    line-height: 22px;
                    &-p {
                        width: 12px;
                        margin-left: 3px;
                        position: relative;
                        top: 1px;
                    }
                }
                .map-s {
                    width: 12px;
                    opacity: 0.5;
                    position: relative;
                    top: 3px;
                    margin-right: 6px;
                }
                p {
                    margin: 6px auto;
                    font-size: 13px;
                    color: #666;
                    overflow: hidden;
                    display: flex;
                    label {
                        flex: 1;
                        span {
                            // font-weight: 300;
                        }
                    }
                }
                .info {
                    font-weight: normal;
                    display: flex;
                    margin: 10px 0 5px;
                    .title {
                        font-size: 15px;
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
                    .date {
                        font-size: 12px;
                        color: #666;
                        word-break: keep-all;
                        white-space: nowrap;
                        line-height: 22px;
                    }
                }
                .address {
                    margin: 0 0 10px;
                    font-size: 13px;
                    color: #666;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}
</style>
