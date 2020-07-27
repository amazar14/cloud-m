<template>
<div>

  <div class='space' @click='hideList()'></div>
  <div class='list-contain'>
    <div class='title'>
      <p>当前播放
      <span>({{list.length}})</span>
      </p>
      <i class='back' @click='hideList()'></i>
    </div>
    <bscroll class="sheet" :data='playList'>
      <ul>
        <li v-for='(item,index) in list ' @click='selectItem(index)' :key='index'> 
          <i :class="{'play':index==num}"></i>
          <span :class="{'selected':index==num}">{{item.name}}</span> - {{item.ar[0].name}}
          <i class='del' @click.stop='del(index)'></i>
        </li>
      </ul>
    </bscroll>
  </div>
</div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import bscroll from '../../base/scroll/bscroll'
export default {
  data(){
    return{
      list: []||Object.assgin([],this.playList),
      num: null
    }
  },
  methods:{
    hideList(){
      this.$emit('back')
    },
    selectItem(index){
      this.changeSong(index)
      this.setList(this.list)
      this.$emit('select')
    },
    del(index){
      if(index<this.num) this.num = this.num -1
      this.list.splice(index,1)
    },
    ...mapActions(['changeSong','delSong','setList'])
  },
  computed:{
    ...mapGetters(['playList','currentIndex','currentSong']),     //列表显示的 克隆列表，修改克隆列表，源列表不变
    // cloneList:{
    //   get: function(){
    //     return list
    //   }
    // }
  },
  watch:{
    playList: function(){
      this.list = Object.assign([],this.playList)
      this.num = this.currentIndex
    },
    currentIndex: function(){
      this.num = this.currentIndex
    }
  },
  components:{
    bscroll
  },
}
</script>

<style lang='stylus' scoped>
.space
  width 100%
  height 30%
  background-color transparent
.list-contain
  bottom 0
  width 100%
  height 70%
  background-color #333333
  border-top #616161 1px solid
  border-radius 10px 10px 0 0
  padding 20px
  box-sizing border-box
  .title
    display flex
    justify-content  space-between
    i
      width 20px
      height 20px
      display inline-block
      vertical-align text-bottom
    .back
      background url('../../../static/img/返回.png')
      background-size contain
    p
      display inline-block
      font-size 18px
      margin 2px 10px 15px 0
      color #d9d9d9
      // vertical-align top
      span
        font-size 16px
        color #999
        margin-left 10px
  .sheet
    height 96%
    font-size 14px
    overflow hidden
    position relative
    li
      width 70%
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      padding 15px 0
      color #999
      .play
        margin-right 4px
        vertical-align bottom
        display inline-block
        width 15px
        height 15px
        background url('../../../static/img/增大音量.png') 0 0 no-repeat
        background-size contain
      span
        color #d9d9d9
        vertical-align text-top
      .del
        vertical-align bottom
        width 20px
        height 20px
        position absolute
        right 0
        background url('../../../static/img/删除.png')
        background-size contain
    .selected
      color #808080
</style>