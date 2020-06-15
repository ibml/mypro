<template>
    <div id="dash-pane">

        <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
            <div class="fab-container">
                <div class="fab-btn" style="display:none;" @click="closePage">
                    <v-icon medium color="white">close</v-icon>
                </div>
            </div>

             <!-- <NewDashBoard style="min-height:100%;"></NewDashBoard> -->
            <!-- <NewDashBoardPage2 :gridColumns="gridColumns" style="min-height:100%;"></NewDashBoardPage2> -->

            <v-carousel id="myCarousel" :show-arrows="false" :cycle="false" :height="clientHeight"
                @change="changeCarousel">
                <v-carousel-item>
                    <NewDashBoard ref="item1" style="min-height:100%;"></NewDashBoard>
                </v-carousel-item>
                <v-carousel-item>
                    <NewDashBoardPage2 ref="item2" :gridColumns="gridColumns" style="min-height:100%;">
                    </NewDashBoardPage2>
                </v-carousel-item>
            </v-carousel>

        </v-dialog>


    </div>
</template>
<script>
    import UtilsService from '@/services/UtilsService';

    import NewDashBoard from './NewDashBoard'

    import NewDashBoardPage2 from './NewDashBoardPage2'

    import 'animate.css'
    import {
        setTimeout
    } from 'timers';
    export default {
        components: {
            NewDashBoard,
            NewDashBoardPage2
        },
        data() {
            return {
                show: false,
                lastView: null,
                menuInfo: {},
                gridColumns: [],
                clientHeight1: document.body.clientHeight
            }
        },
        created() {
            this.show = true;
            //this.init();
        },
        mounted() {
            window.addEventListener("mouseover", this.mouseOver);
            window.addEventListener('resize', this.resizeBody);

        },
        beforeDestroy() {
            window.removeEventListener("mousemove", this.mouseOver);
            window.removeEventListener("resize", this.resizeBody);

            document.querySelector('html').style.overflow = null;

        },
        computed: {
            latestView() {
                var latestViewIndex = this.$store.state.tagsView.lastIndex;
                return this.$store.state.tagsView.visitedViews[latestViewIndex];
            },
            bgClass() {
                return {
                    backgroundImage: "url(" + require("@/assets/supplies/img/bg_bigdata.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%"
                }
            },
            clientHeight: {
                get() {
                    return this.clientHeight1;
                },
                set(val) {
                    this.clientHeight1 = val;
                }
            }
        },
        watch: {
            latestView(val, old) {
                this.lastView = val
            },
            show: function (val) {
                document.querySelector('html').style.overflow = val ? 'hidden' : null
            },

        },
        methods: {
            init() {
                //初始化显示列
                this.menuInfo = this.$route.meta.menuInfo;
                console.log("--menuInfo---",this.menuInfo);
                this.cols = UtilsService.initVuetifyColumnConfig(
                    this.menuInfo.columns_config
                );
                for (var i = 0; i < this.menuInfo.columns_config.split('^`').length; i++) {
                    this.gridColumns.push(UtilsService.initColumnConfig(
                        this.menuInfo.columns_config.split('^`')[i] //按 ^` 这两个符号劈开
                    ));
                }

            },
            mouseOver() {
                var el = document.querySelector(".fab-btn")
                var {
                    timer
                } = this;
                //当前鼠标y轴位置
                var y = event.clientY;
                // console.log(el.style.transition)
                if (el) {
                    if (y > 40) {
                        el.style.display = 'none';
                        // el.style.opacity = '0'
                        // setTimeout(() => {
                        //     el.style.transition = "height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                        //     el.style.transition = ""
                        // }, 400)
                        return;
                    }
                    if (y < 20) {
                        // el.style.transition = "height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                        // el.style.transition=''
                        el.style.display = 'flex';
                        this.animateCSS(".fab-btn", "slideInDown")
                        // el.style.opacity = '1'

                    }
                }

            },
            animateCSS(element, animationName, callback) {
                const node = document.querySelector(element)
                node.classList.add('animated', animationName)

                function handleAnimationEnd() {
                    node.classList.remove('animated', animationName)
                    node.removeEventListener('animationend', handleAnimationEnd)

                    if (typeof callback === 'function') callback()
                }

                node.addEventListener('animationend', handleAnimationEnd)
            },
            async closePage() {
                //关闭当前页面
                var view = this.$route
                await this.$store.dispatch("tagsView/delView", view);
                // UtilsService.goBack(this);
                var latestView = this.lastView;
                if (!latestView) {
                    var visitedViews = this.$store.state.tagsView.visitedViews;
                    if (visitedViews.length > 0) {
                        latestView = visitedViews.slice(-1)[0];
                        this.$router.push(latestView)
                    } else {
                        this.$router.push({
                            path: "/home"
                        });
                    }
                }
            },
            resizeBody() {
                setTimeout(() => {
                    this.clientHeight1 = document.body.clientHeight;
                }, 100)
            },
            changeCarousel(e) {
                if (this.$refs[`item${e+1}`]) {
                    this.$refs[`item${e+1}`].resizeOldChart();
                }
            }
        }
    }
</script>
<style scoped>
    .fab-container {
        position: absolute;
        /* 水平方向居中 */
        margin-left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
    }

    .fab-btn {
        background-color: antiquewhite;
        position: relative;
        margin-top: 10px;
        text-align: center;

        border-radius: 50%;
        height: 60px;
        width: 60px;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<style>
    #dash-pane .v-dialog--active {
        background-image: url('../../assets/supplies/img/bg_bigdata.png') !important;
        background-repeat: no-repeat !important;
        background-size: 100% 100% !important;
    }
</style>