<template>
    <div class="singer-detail">
      <musicList :bgImage= "bgImage" :name= "name" :list= "songs" @singerMore='showDecs = true'></musicList>
      <transition name='slide'>
       <div class="decs" v-show='showDecs'>   <!-- 歌手详细信息 -->
        <div class='back' @click='showDecs = false'><i></i> 基本信息</div>
        <div class="mask"></div>
        <div class='pic' ref='pic' v-if='user.profile'>
          <img :src="singer.picUrl+'?param=400y150'" alt="">
          <div class='avatar' ref='avatar'>
            <img :src="user.profile.avatarUrl+'?param=60y60'" alt="">
            <span>{{name[0]}}</span>
          </div>
        </div>
        <scroll class='wrap' @scroll='scroll' :bounce='false'>
          <div>
            <div class='space' v-if='!user.profile'></div>
            <div class='user' v-if='user.profile'>
              <p>认证信息</p>
              <span>{{user.profile.description}}</span>
            </div>
            <div class='user' v-if='user.profile'>
              <p>个人信息</p>
              <span>等级:{{user.level}}</span> <br>
              <span>性别:{{user.profile.gender==2?'女':'男'}}</span>
            </div>
            <div class='user' v-if='user.profile'>
              <p>个人介绍</p>
              <span>{{signature}}</span>
            </div>
            <div class='user'>
              <p>歌手简介</p>
              <span>{{desc}}</span>
            </div>
            <div class="user" v-for='(item,index) in introduction' :key='index'>
              <p>{{item.ti}}</p>
              <span>{{item.txt}}</span>
            </div>
          </div>
        </scroll>
      </div>
      </transition>
    </div>
</template>

<script>
//vuex获取 歌手信息(图片、名字)
//vuex获取歌手信息中id 获取歌手50首热歌


  import musicList from '../musicList/musicList'
  import scroll from '../../base/scroll/bscroll'
  import _default, {mapGetters, mapMutations} from 'vuex'
  import {getSingerDetail,getSingerDesc} from '../../api/singer'
  import {getUserDetail} from '../../api/getUserDetail'

  export default {
    data(){
      return {
        songs: [],
        desc: '',
        introduction: [],
        user: {},
        showDecs: false,
        posY:0
      }
    },
    methods: {
      _getDetail(){
        if(!this.singer.id){
          this.$router.push('/singer')
        }else{
          getSingerDetail(this.singer.id).then((res)=>{
            console.log(res)
            // this.setSinger(res.data.artist)        
            this.songs = res.data.hotSongs
            console.log(this.songs)
            console.log(this.singer)
            console.log(res.data.artist)
          })
          if(this.singer.accountId){
            console.log('yonghu')
            getUserDetail(this.singer.accountId).then((res)=>{
              console.log('用户')
              console.log(res)
              console.log(this.name)
              this.name[2]=this.fansStr(res.data.profile.follows)
              this.name[3]=this.fansStr(res.data.profile.followeds)
              this.user = res.data
            })
          }
          getSingerDesc(this.singer.id).then((res)=>{
            console.log('详细信息')
            console.log(res)
            this.introduction = res.data.introduction
            this.desc = res.data.briefDesc
          })
        }
      },
      fansStr(n){
        return n>10000?(n/10000).toFixed(1)+'万':n
      },
      scroll(posY){
        this.posY = posY
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    computed: {
      ...mapGetters(['singer']),
      bgImage(){     //返回裁剪好尺寸的图片
        return this.singer.picUrl+'?param=400y250'
      },
      name(){       //返回歌手完整名字
        return this.singer.alias[0]?[this.singer.name,"("+this.singer.alias[0]+")"]:[this.singer.name,'']
      },
      signature(){
        return this.user.profile.signature?this.user.profile.signature:'还没有填写个人介绍'
      }
    },
    created() {
      console.log(this.singer.id)
      this._getDetail()
    },
    watch:{
      posY(newPosY){
        if(this.$refs.pic){
          let pos = Math.max(newPosY,-90)
          this.$refs.pic.style.transform = `translateY(${pos}px)`
          this.$refs.avatar.style.opacity = 1-(newPosY/(-90))
        }
      }
    },
    components:{
      musicList,
      scroll
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/base'
  .singer-detail
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    font-size 18px
    z-index 101
    background url(../../../static/img/bg.jpg)
    &:after
      content: ''
      position: absolute
      width 100%
      height 400%
      background: inherit
      filter: blur(4px)
      z-index 0
    .decs
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      z-index 1
      font-size 16px
      overflow hidden
      padding 0 0 30px 0
      &:after
        content: ''
        position: absolute
        top 0
        width 100%
        height 100%
        background url(../../../static/img/bg.jpg) 0 0 no-repeat
        background-size 100% 100%
        filter: blur(10px)
        z-index: -10
        transform: scale(1.1)
      &:before
        content: ''
        position: absolute
        width 100%
        height 100%
        background-color rgba(0,0,0,.6)
        z-index: -1
      .back
        position fixed
        left 0%
        z-index 10
        padding 5% 0 0 5%
        // width 100%
        // height 40px
        // background-color rgba(0,0,0,.2)
        span
          position relative
          z-index 10
        i
          width 25px
          height 25px
          display inline-block
          background url('../../../static/img/左返回.png')
          background-size contain
          vertical-align middle
      .mask
        position fixed
        left 0%
        z-index 1
        width 100%
        height 60px
        background-color #546265
      .pic
        position relative
        width 100%
        height 20%
        overflow hidden
        z-index 1
        &:before
          content ''
          display inline-block
          position absolute
          z-index 1
          width 100%
          height 100%
          background-color rgba(0,0,0,.6)
        img
          width 100%
          height 100%
          filter blur(8px)
        .avatar
          display flex
          align-items center
          position absolute
          z-index 10
          left 5%
          bottom 10%
          img
            all unset
            width 60px
            height 60px
            border-radius 50%
            margin-right 10px
      .wrap
        width 100%
        height 70%
        position relative
        .space
          width 100%
          height 20px
        .user
          margin 50px 20px
          p
            margin 10px 0
          span
            font-size 14px
            color #a9a9a9
            line-height 25px
            white-space pre-line
    .slide-enter-active,.slide-leave-active
      transition all .3s
    .slide-enter,.slide-leave-to
      // transform translateX(100%)
      opacity 0
</style>