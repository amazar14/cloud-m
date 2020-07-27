<template>
  <div id="app">
    <!-- <img src="./assets/logo.png">
    <router-view/> -->
    <m-header></m-header>
    <tab></tab>
    <div class='wrapper' @touchstart.capture= 'touchPosition($event)' @touchend.capture='changePage($event)'>
      <transition :name='slide'>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
    <player></player>
  </div>
</template>

<script>
import MHeader from './components/header/header'
import Tab from './components/tab/tab'
import Player from './components/player/player'

export default {
  data(){
    return{
      slide: 'slide-right',
      pageName:['#/recommend','#/singer','#/rank','#/serch'],
      touchDom: ['swiper-wrapper','swiper-contain','slider-wrapper'],
      startX: 0,
      startY: 0
    }
  },
  methods:{
    touchPosition(e){
      if(e.path.some(item => this.touchDom.indexOf(item._prevClass)>=0)){
        this.startX = this.startY = null
        return
      }
      let {pageX:startX, pageY:startY} = e.changedTouches[0]
      this.startX = startX
      this.startY = startY
    },
    changePage(e){
      let currentPage = this.pageName.indexOf(window.location.hash)
      let {pageX:endX,pageY:endY} = e.changedTouches[0]
      let [slipX,slipY] = [endX-this.startX, endY-this.startY]
      if(slipY/slipX>0.2||slipY/slipX<-0.2) return
      if(currentPage >= 0&&this.startX !== null){
        if(slipX<-60){
          this.$router.push({
            path: this.pageName[Math.min(currentPage+1,3)].slice(1)
          })
        }else if(slipX>60&&this.startX !== null){
          this.$router.push({
            path: this.pageName[Math.max(currentPage-1,0)].slice(1)
          })
        }
      }
    }
  },
  watch:{
    $route: function(to, from){
      to.name<from.name?this.slide = 'slide-left':this.slide='slide-right'
    }
  },
  components:{
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app 
    width 100% 
    height 100%
    .wrapper
      width 100%
      height 100%
  .slide-right-enter-active, .slide-right-leave-active
    transition all .3s
  .slide-right-enter
    transform translateX(100%)
  .slide-right-leave-to
    transform translateX(-100%)
  .slide-left-enter-active, .slide-left-leave-active
    transition all .3s
  .slide-left-enter
    transform translateX(-100%)
  .slide-left-leave-to
    transform translateX(100%)

</style>
