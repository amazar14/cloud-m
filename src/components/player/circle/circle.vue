<template>
  <div class='round'>
    <div class='left'>
      <div class="left-bar" ref='left'></div>
    </div>
    <div class='right'>
      <div class="right-bar" ref='right'></div>
    </div>
    <div class="filter"></div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      deg:0,
      persentage: '',
      timing: 0
    }
  },
  props:{
    duration: 0,
    state:'',
    e:0,
    audio:{}
  },
  methods:{
    turn(){
      if(this.state == 'play'){
        this.timing =setInterval(()=>{
          if(this.deg>360||this.deg<0) clearInterval(this.timing)
          this.deg += this.persentage
          this.$refs.right.style = `transform:rotate(${this.deg>180?180:this.deg}deg)`
          this.$refs.left.style = `transform:rotate(${this.deg>180?this.deg-180:0}deg)`
        },1000)
      }else{
        if(this.duration-this.$props.audio.currentTime<2){
          this.reset()
        }
        clearInterval(this.timing)
        this.timing = 0
      }
    },
    reset(){
      this.deg = 0
      this.$refs.right.style = `transform:rotate(0deg)`
      this.$refs.left.style = `transform:rotate(0deg)`
    }
  },
  watch:{
    duration: function(){
      this.persentage = 360/(this.$props.duration).toFixed(2)
      this.reset()
    },
    state: function(){
      this.turn()
    },
    e: function(){
      this.deg = 360* this.$props.e
    }
  }
}
</script>

<style lang='stylus' scoped>
  .round
    position absolute
    top -2px
    left -52px
    width 34px
    height 34px
    border-radius 50%
    display flex
    overflow hidden
    .left
      width 34px
      height 34px
      position absolute
      clip rect(0px,17px,34px,0px)
      border-radius 50%
      overflow hidden
      .left-bar
        width 34px
        height 34px
        position absolute
        // clip rect(0px,17px,34px,0px)
        clip rect(0px,34px,34px,17px)
        border 7px solid #ccc
        box-sizing border-box
        transform rotate(0deg)
    .right
      width 34px
      height 34px
      position absolute
      clip rect(0px,34px,34px,17px)
      border-radius 50%
      overflow hidden
      .right-bar
        width 34px
        height 34px
        position absolute
        // clip rect(0,34px,34px,17px)
        clip rect(0px,17px,34px,0px)
        border 7px solid #ccc
        box-sizing border-box
    .filter
      position absolute
      top 3px
      left 3px
      width 28px
      height 28px
      border-radius 50%
      background-color #4a4a4d
      
// </style>