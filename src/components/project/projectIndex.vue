<template>
	<div class="main">
		<!-- <van-nav-bar title="项目列表" left-arrow @click-left="onClickLeft" fixed /> -->
		<van-nav-bar title="项目列表" fixed />

		<!-- <section class="page-main"> -->
		<section class="page-ctx">
			<form action="/" class="search-box">
				<van-search v-model="keyword" placeholder="请输入项目名称" show-action @search="getProjectList" background="#fff">
					<div slot="action" @click="showprojectMapPopup()">
						<img src="@/assets/icons/map.png" class="map">
					</div>
				</van-search>
			</form>
			<van-cell-group>
				<van-cell :value='"选择地区："+areaQueryText' is-link @click="popupAddress()" />
			</van-cell-group>

			<div class="wrapper" ref="wrapper">
				<div class="project-list">
					<div class="no-result" v-if="projectList.length==0&&!showLoading">
						<img src="@/assets/icons/noresult.png">
					</div>
					<div class="row" v-for="(item,i) in projectList" @click="goToDetail(item,i)">
						<div class="wrap" :class="{viewed:item.isClicked}">
							<div class="icon">
								<img src='@/assets/icons/project.png'>
							</div>
							<div class="ctx">
								<p class="info">
									<span class="title">{{item.efairyproject_name}}</span>
									<span class="nums">{{item.efairyproject_total_users}}<img src="@/assets/icons/nums.png" class="nums-p"></span>
								</p>
								<p>
									<label>设备数
										<span class="green">{{item.efairyproject_device_online_number}}</span>
										<span>/ {{item.efairyproject_total_devices}}</span>
									</label>
								</p>
								<p class="count">
									<label>报警数
										<span class="red">{{item.efairyproject_fire_number}}</span>
									</label>
									<label>预警数
										<span class="orange">{{item.efairyproject_ew_number}}</span>
									</label>
									<label>故障数
										<span class="yellow">{{item.efairyproject_trouble_number}}</span>
									</label>
								</p>
								<p class="address"><img src="@/assets/icons/map_s.png" class="map-s">{{item.efairyproject_address}}</p>
							</div>
						</div>
					</div>
					<p class="loading-tips" v-if="listLoading&&!listFinished">正在加载...</p>
					<p class="loading-tips" v-if="listPage>1&&listFinished">没有更多</p>
				</div>
			</div>

			<van-popup v-model="showAddressPicker" @click-overlay="popupAddress()" position="bottom">
				<van-picker :columns="columns" @change="onChange" :loading="addressLoading" :item-height="40" show-toolbar title="选择地区" @cancel="onCancel" @confirm="onConfirm" />
			</van-popup>

			<bottom-tab />
		</section>
	</div>

</template>

<script>
import BScroll from "better-scroll";
import bottomTab from "@/components/bottomTab";
import projectMap from "./projectMap";
import { mapState } from "vuex";

export default {
    name: "projectIndex",
    components: {
        bottomTab,
        projectMap
    },
    computed: {
        ...mapState({
            showLoading: state => state.isAjaxLoading
        })
    },
    data() {
        return {
            // query: this.$route.query,
            active: 0,
            addressLoading: false,
            showAddressPicker: false,
            showprojectMap: false,
            tmp: [],
            scroll: null,
            calcHeight: 500,
            projectList: [],
            areaList: [],
            areaQuery: {},
            areaQueryText: "正在读取...",
            columns: [],
            listLoading: false,
            listPage: 1,
            listPagesize: 10,
            listFinished: false,
            keyword: "",
            areaPlaceholder: "请选择"
        };
    },
    async mounted() {
        await this.getAreaList();
        await this.getProjectList();
    },
    methods: {
        async getAreaList() {
            const data = await this.$service.projectService.getAreaList();
            const provinceList = data.result.province_list;
            this.areaList = provinceList;
            this.initAreaList(provinceList);
        },
        async getProjectList() {
            this.listPage = 1;
            this.listFinished = false;
            if (this.scroll) this.scroll.finishPullUp();
            if (this.scroll) this.scroll.finishPullDown();
            const data = await this.$service.projectService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize
            });
            this.projectList = [];
            this.projectList = data.result.project_list;
            if (data.result.project_list.length < this.listPagesize)
                this.listFinished = true;
            // this.$toast("加载完成");
            this.$nextTick(() => {
                this.setupBetterScroll();
            });
        },
        async loadMoreProjectList() {
            if (this.listFinished) return;
            this.listLoading = true;
            this.listPage++;
            const data = await this.$service.projectService.getProjectList({
                regeo_info: this.areaQuery,
                keyword: this.keyword,
                page: this.listPage,
                size: this.listPagesize
            });
            this.listLoading = false;
            this.projectList = this.projectList.concat(
                data.result.project_list
            );
            if (data.result.project_list.length < this.listPagesize)
                this.listFinished = true;

            this.scroll.finishPullUp();
            // this.$nextTick(() => {
            //     this.scroll.refresh();
            // });
        },
        onCancel() {
            this.showAddressPicker = false;
        },
        onConfirm(values, indexs) {
            const provinceId = this.areaList[indexs[0]].efairyprovince_id;
            let cityId, districtId, townId;
            if (values[1] != this.areaPlaceholder) {
                cityId = this.areaList[indexs[0]]["city_list"][indexs[1] - 1]
                    .efairycity_id;
                if (values[2] != this.areaPlaceholder) {
                    districtId = this.areaList[indexs[0]]["city_list"][
                        indexs[1] - 1
                    ]["district_list"][indexs[2] - 1].efairydistrict_id;
                    if (values[3] != this.areaPlaceholder) {
                        townId = this.areaList[indexs[0]]["city_list"][
                            indexs[1] - 1
                        ]["district_list"][indexs[2] - 1]["township_list"][
                            indexs[3] - 1
                        ].efairytownship_id;
                    }
                }
            }

            this.areaQueryText = values
                .map(item => {
                    if (item != this.areaPlaceholder) return item;
                })
                .join("");
            this.areaQuery = {
                efairyprovince_id: provinceId,
                efairycity_id: cityId,
                efairydistrict_id: districtId,
                efairytownship_id: townId
            };
            this.getProjectList();
            this.$store.dispatch("setProjectAreaSelectedQuery", this.areaQuery);
            this.showAddressPicker = false;
        },
        onChange(picker, values, index) {
            let currentProvinceIndex, currentCityIndex, currentDistrictIndex;
            if (index == 0) {
                currentProvinceIndex = this.areaList.findIndex(
                    item => item.efairyprovince_name == values[0]
                );
                const cityList = [this.areaPlaceholder].concat(
                    this.areaList[currentProvinceIndex]["city_list"].map(
                        city => city.efairycity_name
                    )
                );
                picker.setColumnValues(1, cityList);
                picker.setColumnValues(2, [this.areaPlaceholder]);
                picker.setColumnValues(3, [this.areaPlaceholder]);
            }
            if (index == 1) {
                if (values[1] == this.areaPlaceholder) {
                    picker.setColumnValues(2, [this.areaPlaceholder]);
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                } else {
                    currentProvinceIndex = this.areaList.findIndex(
                        item => item.efairyprovince_name == values[0]
                    );
                    currentCityIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ].findIndex(item => item.efairycity_name == values[1]);
                    const districtList = [this.areaPlaceholder].concat(
                        this.areaList[currentProvinceIndex]["city_list"][
                            currentCityIndex
                        ]["district_list"].map(
                            district => district.efairydistrict_name
                        )
                    );
                    picker.setColumnValues(2, districtList);
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                }
            }
            if (index == 2) {
                if (values[2] == this.areaPlaceholder) {
                    picker.setColumnValues(3, [this.areaPlaceholder]);
                } else {
                    currentProvinceIndex = this.areaList.findIndex(
                        item => item.efairyprovince_name == values[0]
                    );
                    currentCityIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ].findIndex(item => item.efairycity_name == values[1]);
                    currentDistrictIndex = this.areaList[currentProvinceIndex][
                        "city_list"
                    ][currentCityIndex]["district_list"].findIndex(
                        item => item.efairydistrict_name == values[2]
                    );
                    const townList = [this.areaPlaceholder].concat(
                        this.areaList[currentProvinceIndex]["city_list"][
                            currentCityIndex
                        ]["district_list"][currentDistrictIndex][
                            "township_list"
                        ].map(town => town.efairytownship_name)
                    );
                    picker.setColumnValues(3, townList);
                }
            }
        },
        initAreaList(data) {
            if (data.length > 0) {
                this.columns = [];
                this.columns[0] = {
                    values: data.map(province => province.efairyprovince_name),
                    className: "province"
                };
                this.columns[1] = {
                    values: [this.areaPlaceholder].concat(
                        data[0]["city_list"].map(city => city.efairycity_name)
                    ),
                    className: "city"
                };
                this.columns[2] = {
                    vaules: ["--"],
                    className: "district"
                };
                this.columns[3] = {
                    vaules: ["--"],
                    className: "town"
                };

                this.areaQuery = {
                    efairyprovince_id: data[0].efairyprovince_id
                };
                this.areaQueryText = [data[0].efairyprovince_name].join("");
                this.$store.dispatch(
                    "setProjectAreaSelectedQuery",
                    this.areaQuery
                );
            } else {
                this.areaQueryText = "没有数据";
            }
        },

        setupBetterScroll() {
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    tap: true,
                    click: true,
                    pullUpLoad: {
                        threshold: 0,
                        stop: 0
                    },
                    pullDownRefresh: {
                        threshold: 0,
                        stop: 0
                    }
                });
                this.scroll.on("pullingUp", pos => {
                    this.loadMoreProjectList();
                    setTimeout(() => {
                        this.scroll.refresh();
                    }, 0);
                });

                this.scroll.on("pullingDown", () => {
                    this.getProjectList();
                });
            } else {
                this.scroll.refresh();
            }
        },
        showprojectMapPopup() {
            this.$router.push("/project/map");
        },
        goToDetail(project) {
            // project.isClicked = true;
            this.projectList.forEach(item => {
                // item.isClicked=false;
                this.$set(item, "isClicked", false);
            });
            this.$set(project, "isClicked", true);
            this.$router.push(`/project/${project.efairyproject_id}/devices`);
        },
        closePop() {
            this.showprojectMap = false;
        },
        popupAddress() {
            this.showAddressPicker = !this.showAddressPicker;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/color.scss";

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
    // margin-top: 10px;
    // overflow: hidden;
    // width: 100%;
    // position: relative;

    position: fixed;
    top: 140px;
    overflow: hidden;
    width: 100%;
    bottom: 55px;
}

.project-list {
    padding-bottom: 55px;
    .loading-tips {
        text-align: center;
        margin: 8px 0;
        color: #999;
        font-size: 12px;
    }
    .no-result {
        img {
            width: 46%;
            margin: 100px auto;
            display: block;
        }
    }
    .row {
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        .wrap {
            flex: 1;
            background: #fff;
            display: flex;
            transition: all 0.3s ease-in-out;
            padding: 3px 0;
            &.viewed {
                background: #efefef;
            }
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
