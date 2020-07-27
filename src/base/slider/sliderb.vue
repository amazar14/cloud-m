<template>
  <div class="swiper-contain">
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper"
export default {
  props:{

  },
  mounted (){
    this.$nextTick(()=>{
      let mySwiper = new Swiper(".swiper-contain",{
        loop: false,
        autoplay: false,
        observer: true,
        observeParents:true,
      })
    })
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"
  @import "swiper/css/swiper.min.css"
  .swiper-contain
    height 30%
    width 100%
    .swiper-wrapper
      width 100%
      li
        margin 0 0 10px 0
        display flex
        align-items center
        // position relative
        img
          width 60px
          height 60px
          border-radius 10px
        .info
          height 60px
          width 70%
          margin-left 10px
          color #eee
          font-size 16px
          display flex
          flex-direction column
          justify-content space-evenly
          p
            .singer
              color #aeaeae
              font-size 14px
          .album
            font-size 14px
            color #aeaeae
        .play
          display inline-block
          margin-right 10px
          width 25px
          height 25px
          background url('../../../static/img/播放.png') 0 0
          background-size contain

</style>