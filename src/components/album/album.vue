<template>
  <div class='container'>
    <!-- 专辑列表 -->
    <musicList :list='list' :description='description' :sheet='sheet' :authSheet='authSheet' @show= 'show = !show' v-if='showList'></musicList>
    <!-- 加载gif -->
    <div class='loading' v-show='!showList'></div>
    <!-- 专辑详细信息 -->
    <transition name='linear'>
    <div class="albumInfo" v-show='show' @click='show=!show'>
      <div class='mask' ref='album'></div>
      <scroll class='contain' :bounced='false'>
        <div>
          <img :src="description.picUrl" alt="">
          <p class="name">{{description.name}}</p>
          <p class="des">
            <span class="company">发行公司: {{description.company}}</span><br><span class="type">专辑类别: {{description.subType}}</span><br>{{description.description}}
          </p>
        </div>
      </scroll>
    </div>
    </transition>
  </div>

</template>
<script>
//需要路由params传进专辑id，
//路由传进类型判断是否为歌单  路由query传进歌单id
import {getAlbum} from '../../api/getAlbum'
import {getSheet} from '../../api/getSheet'
import musicList from '../musicList/musicList'
import scroll from '../../base/scroll/bscroll'

export default {                        //需要路由传进需要查询的 id
  data(){
    return{
      list:{
        type: Array||Object,
        default: null
      },
      description:{
        type: Object,
        default: null
      },
      sheet:{
        type: Object,
        default: null
      },
      authSheet:{
        type: Object,
        default: null
      },
      show: false,
      showList: false
    }
  },
  methods:{
    _getAlbum(){
      getAlbum(this.$route.params.id).then((res)=>{
        this.list = res.data.songs
        this.description = res.data.album
        console.log(this.list)
        console.log(this.description)
        this.showList = true
        // this.$nextTick(()=>{
          this.$refs.album.style.background = `url(${this.description.blurPicUrl}) 0 0 no-repeat`
        // })
      })
    },
    _getSheet(){
      console.log('check info')
      getSheet(this.$route.query.ids).then((res)=>{
        console.log(res)
        let nickname = res.data.playlist.creator.nickname
        if(nickname == '网易云音乐'||nickname == '原创君'){
          console.log(res.data.playlist.creator.nickname)
          this.authSheet = res.data.playlist
          this.list = res.data.playlist.tracks
          console.log('auth')
        }else{
          this.sheet = res.data.playlist
          this.list = res.data.playlist.tracks
          console.log('sheet')
        }
        this.showList = true
      })
    }
  },
  components:{
    musicList,
    scroll
  },
  created(){
    console.log('album')
    this.$route.query.type == 'sheet'?this._getSheet():this._getAlbum() 
  },
  mounted(){
    console.log('专辑加载完')
  }
}
</script>

<style lang='stylus' scoped>
.container
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  width 100%
  height 100%
  z-index 10
  background-color #414141
  .loading
    background url('../../../static/img/loading.gif') 0 0 no-repeat
    background-size contain
    position absolute
    top 30%
    left 50%
    transform translateX(-50%)
    width 100px
    height 50px
  .albumInfo
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 10
    background-color #414141
    .mask
      background-size 100% 100% !important
      position absolute
      top 0
      width 100%
      height 100%
      filter blur(50px)
      z-index -1
    .contain
      width 100%
      height 85%
      margin 50px 0
      div
        display flex
        flex-direction column
        justify-content space-evenly
        align-items center
        overflow hidden
        img
          width 25vh
          height 25vh
        .name
          margin 3vh 0
        .des
          white-space pre-wrap
          color #ccc
          font-size 14px
          width 80%
          .company
            color #ccc
            font-size 14px
            display inline-block
            margin-bottom 10px
          .type
            color #ccc
            font-size 14px
            display inline-block
            margin-bottom 20px
      &:before
        content ''
        display inline-block
        position fixed
        z-index 100
        top 0
        background-image linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,0))
        width 100%
        height 10%
      &:after
        content ''
        display inline-block
        position fixed
        z-index 100
        bottom 0
        background-image linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.4))
        width 100%
        height 10%
    &:after
      content ''
      position absolute
      width 100%
      height 100%
      top 0
      background-color rgba(50,50,50,.7)
      z-index -1
.linear-enter-active, .linear-leave-active
  transition opacity .3s
.linear-enter, .linear-leave-to
  opacity 0
    
</style>