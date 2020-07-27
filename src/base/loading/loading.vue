<template>
  <div class="loading">
    <img width="100" height="20" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>  
</template>

<script>
export default {
  props:{
    title: {
      type: String,
      default: "加载中~",
    },

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~common/stylus/variable";
  .loading{
    width 100%
    text-align center
  }
  .desc{
    font-size: $font-size-small
    line-height: 20px
    color: $color-text-l
  }
</style>