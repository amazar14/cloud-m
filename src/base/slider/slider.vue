<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
    <div class="swiper-pagination" slot="pagination" id="parentt" v-if='show'></div>
    <div class="swiper-button-prev" v-if='show'></div>
    <div class="swiper-button-next" v-if='show'></div>
  </div>
</template>

<script>
import Swiper from "swiper"
export default {
  data(){
    return{
      show:{
        type: Boolean,
        default: true
      }
    }
  },
  props:{
    pure: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    
  },
  mounted (){

    this.$nextTick(()=>{
      console.log(this.pure)
      let mySwiper = new Swiper(".swiper-container",{
        loop: this.show,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          running: this.show,
          disableOnInteraction: true  //用户拖拽停止loop
        },
        observer: true,
        observeParents:true,
      })
      !this.pure? mySwiper.autoplay.running = false :null
      console.log(mySwiper)
      
    })

    
  },
  created(){
    console.log(this.pure)
    this.show = this.pure
  },
  destroyed(){
    console.log('销毁了')
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"
  @import "swiper/css/swiper.min.css"
  .swiper-container
    height 30%
    width 100%
    --swiper-pagination-color: red; /*分页器 */
    --swiper-theme-color: white;        /*前后按钮 */
    .swiper-button-prev
      left 20px
      transform translateY(-50%)
    .swiper-button-next
      right 20px
      transform translateY(-50%)
    .swiper-wrapper
      width 100%
      .swiper-slide
        width 100% 
        height 100%
        img
          margin-left 5%
          width 90%
          border-radius 10px
    #parentt
      display flex
      justify-content center
    #parentt>>> .swiper-pagination-bullet
      float left
      margin-left 8px
      background-color white
      width 8px
      height 8px
      border-radius 8px
    #parentt>>> .swiper-pagination-bullet:hover{
      background-color #c10d0c
    }
    #parentt>>> .swiper-pagination-bullet-active
      background-color #c10d0c
      width 16px



</style>