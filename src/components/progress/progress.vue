<template>
  <div>
    <div id="container" @touchmove= "drag($event)" @touchend.prevent= "jump($event)" ref="progress">
      <div id="wrap">
        <div id="dot"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data:function(){
    return{
      dot: {},
      wrap: {},
      container: {},
      space:{
        type: Number,
        default: null
      },
      width:{
        type: Number,
        default: null
      }
    }
  },
  props:{
    audio: {},
    quantity: {
      type: Number,
      default: 0
    },
  },
  methods:{
    jump(e){
      let distance = e.changedTouches[0].clientX - this.space
      if(distance>this.width||distance<0) return
      this.dot.style.left = distance + 'px'
      this.wrap.style.width = distance + 'px'
      this.$emit('jumped',(distance/this.width).toFixed(2))
    },
    drag(e){
      let distance = e.changedTouches[0].clientX - this.space
      if(distance>this.width||distance<0) return
      this.dot.style.left = distance + 'px'
      this.wrap.style.width = distance + 'px'
      this.$emit('draged',(distance/this.width).toFixed(2))

    }
  },
  mounted(){
      this.dot = document.getElementById('dot')
      this.wrap = document.getElementById('wrap')
      this.container = document.getElementById('container')
      this.space = this.container.offsetLeft
      this.width = this.container.offsetWidth
      //初始化音量10%的进度
      this.dot.style.left = this.$props.quantity*this.width + 'px'
      this.wrap.style.width = this.$props.quantity*this.width + 'px'
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  #container
    width 100%
    height 2px
    background-color #818181
    position relative
    #wrap
      height 100%
      width 0
      background-color #ccc
      #dot
        width 8px
        height 8px
        border-radius 50%
        background-color #ccc
        position absolute
        transform translateX(-4px)
        left 0
        top -3px
</style>