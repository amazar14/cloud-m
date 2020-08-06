<template>
  <div class="music-list">
    <div class="back" @click.stop="back">
      <i></i>
       <!-- 排行榜 -->
      <span v-if='$route.query.rankName' v-show='titleShow'> {{this.$route.query.rankName}}</span>
      <!-- 专辑 -->
      <span v-if='description!==null&&description.default === undefined' v-show='titleShow'> {{description.name}}</span>
      <!-- 歌手 -->
      <span v-if='name' v-show='titleShow'>{{name[0]}}{{name[1]}}</span>
      <!-- 官方歌单 -->
      <span v-if="authSheet!==null&&authSheet.default === undefined" v-show='titleShow'>{{authSheet.name}}</span>
      <!-- 歌单 -->
      <span v-if="sheet!==null&&sheet.default === undefined" v-show='titleShow'>{{sheet.name}}</span>
    </div>
    <div class="pic-contain"  ref='pic'>
      <div class="album" v-if='description!==null&&description.default === undefined'>
        <div class='pic'>
          <i></i>
          <img :src= 'description.picUrl' alt="">
        </div>
        <div class='info' ref='name'>
          <p class='name'>{{description.name}}</p>
          <p class='singer'>歌手: {{description.artist.name}}</p>
          <div class="publishTime" @click= 'showAlbum'>发行时间：{{publishTime}}
            <p class='description'>{{description.description}}</p><i></i>
          </div>
        </div>
      </div>
      <div class='sheet' v-else-if="sheet!==null&&sheet.default === undefined">
        <div class="pic">
        <img :src="sheet.coverImgUrl" alt="">
        <span class='count'><i></i>{{playcount}}</span>
        </div>
        <div class="info" ref='name'>
          <p class="name">{{sheet.name}}</p>
          <p class="creator"> <img :src="sheet.creator.avatarUrl" alt=""> {{sheet.creator.nickname}}</p>
          <p class="description">{{sheet.description}}</p>
        </div>
      </div> 
      <div class="auth-sheet" v-else-if="authSheet!==null&&authSheet.default === undefined">
        <img :src="authSheet.backgroundCoverUrl+'?param=400y250'" alt="">
        <div class="info" ref='name'>
          <span>{{authSheet.name}}</span>
          <p>
            <span class='update'>{{authSheet.updateFrequency}}</span>
          </p>
          <p>
            <span class='description'>{{authSheet.description}}</span>
            <i></i>
          </p>  
        </div>
      </div>
      <div class="bg-img" v-else-if='bgImage!==null&&bgImage.default === undefined||rank.length!==0'>
        <img :src= 'bgImage||rank[0].al.picUrl+"?param=400y250"' alt="" v-if= 'bgImage||rank[0]'>
        <span v-if='name' ref='name'>
          {{name[0]}}{{name[1]}}
          <p class='user'>关注 {{name[2]}} | 粉丝 {{name[3]}}</p>
          <p @click="$emit('singerMore')">更多>></p>
        </span>
        <span v-else-if='this.$route' ref='name'>{{this.$route.query.rankName}}</span>
        <div class="filter"></div>
      </div>
    </div>
    <scroll @scroll='scroll' :bounce='false' ref="scroll" class="music-list-contain" :data= "list">
      <div>
        <ul class="music-list-item" @click='select'>
          <li v-for= "(item,index) in list||rank" :key='index' :data-index='index'>
            <div class="info">
              <span>{{index+1}}</span>
              <p>{{item.name}}
                <span v-if= "item.al.alia">({{item.al.alia[0]}})</span>
                <span v-if= "item.alia.length!==0">({{item.alia[0]}})</span>
              </p> 
              <p>{{item.ar[0].name}}<span v-if= "item.ar[1]"> / {{item.ar[1].name}}</span> - {{item.al.name}}</p>
            </div>
            <div class="more" @click.stop= "more(item.id)"><i></i><i></i><i></i></div>
            <div class="mv"><i></i></div>
          </li>
          <li v-show='playList.length>0'></li>
        </ul>
      </div>
    </scroll>
    <transition name= "slide">
    <moreSelect :id='mark' v-if='mark' v-show='moreShow' @hide='moreShow=false'></moreSelect>
      <!-- <router-view :key='$route.params.id'></router-view> -->

    </transition>
    <transition name= "slide">
      <router-view></router-view>   <!--播放器跳转到歌手 -->
      
    </transition>

  </div>
</template>

<script>
import scroll from '../../base/scroll/bscroll'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import moreSelect from '../moreSelect/moreSelect'
export default {
  data(){
    return{
      posY:{
        type: Number,
        default: 0
      },
      picHeight:{
        type: Number,
        default: 0
      },
      titleShow: false,
      mark: 0,
      moreShow: false
    }
  },
  props:{
    bgImage:{
      type: String,
      default: null
    },
    name:{
      type: Array,
      default: null
    },
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
    show: false
  },
  methods:{
    back(){
      console.log(this.$props.bgImage)
      this.$router.go(-1)
      this.setHiddenPlayer('visibility: visible')
      // this.$router.back()
      console.log(this.$route.query)
      // this.setFullScreen(true)
      console.log(this.fullScreen)
    },
    // select(song,index){
    //   console.log(song,index)
    //   console.log(this.$props)
      
    //   this.selectPlay({
    //     list: this.$props.list?this.$props.list:this.rank,
    //     index
    //    })
    // },
    select(e){
      console.dir(e.path[0].dataset.index)
      // console.log(document.elementsFromPoint(e.clientX, e.clientY))
      let index = e.target.dataset.index     //点击的序号
      console.log(this.list)
      this.selectPlay({
        list: this.list?this.list:this.rank,
        index
      })
    },
    more(id){   //歌曲id
      console.log(id)
      this.mark = id //存储歌曲id 传到more组件中
      this.moreShow = true
    },
    showAlbum(){
      this.$emit('show')
    },
    scroll(posY){
      this.posY = posY
    },
    ...mapActions(['selectPlay']),
    ...mapMutations({
        setRank: 'SET_RANK',
        setFullScreen: 'SET_FULLSCREEN',
        setHiddenPlayer: 'SET_VISIBILITY'
    })
  },
  computed: {
    ...mapGetters(['rank','type','playList','fullScreen']),
    playcount: function(){
      let count = this.sheet.playCount
      return count.toString().length >=9 ? (count/100000000).toFixed(2)+"亿" : (count/10000).toFixed(2)+"万"
    },
    publishTime(){
      return new Date(this.description.publishTime).toLocaleDateString().replace(/[\/]/g,'.')
    }
  },
  created(){
    console.log(this.sheet)
    console.log(this.authSheet)
  },
  mounted(){
    this.picHeight = this.$refs.pic.clientHeight
  },
  watch:{
    bgImage: function(){
      // this.$props.bgImage = this.$props.bgImage+'?param=400y400'
    },
    description:{
    },
    posY(){
        let pos = Math.max(this.posY,-200)
        console.log(this.$refs.pic.clientHeight)
        console.log(pos)
        let clip = this.picHeight+pos
        console.log(this.picHeight)
        clip>30?this.$refs.pic.style.transform = `translateY(${pos}px)`:this.$refs.pic.style.transform = `translateY(${30-this.picHeight}px)`
        this.$refs.pic.style.filter = 'blur(2px)'
        this.$refs.name.style.opacity = 1-(this.posY/-200)
        pos < -190?(this.titleShow = true, this.$refs.pic.style.filter = 'blur(2px)'):(this.titleShow = false, this.$refs.pic.style.filter = 'blur(0)')
    }
  },
  components:{
    scroll,
    moreSelect
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .music-list
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index 1
    overflow hidden
    // background url(../../../static/img/bg.jpg)
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
      position absolute
      left 20px
      top 20px
      z-index 10
      font-size 16px
      width 100%
      display flex
      justify-content flex-start
      i
        border solid #fff
        border-width 3px 0 0 3px
        display inline-block
        transform rotate(-45deg)
        -webkit-transform rotate(-45deg)
        padding 6px
      span
        margin-left 1vh
        display inline-block
        width 80%
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
    .pic-contain
      height 35%
      width 100%
      position relative
      z-index 1
      overflow hidden
      background-color #546265
      .album
        height 100%
        width 100%
        display flex
        align-items center
        justify-content space-evenly
        position relative
        z-index 1
        background-color #546265
        .pic
          flex-basis 30%
          display flex
          flex-direction column
          justify-content center
          i
            position absolute
            top -10px
            left 7%
            width 16px
            height 175px
            background url('../../../static/img/coverall.png') 83px 710px
            transform rotate(270deg)
          img
            position relative
            width 120px
        .info
          width 60%
          height 120px
          flex-basis 60%
          color #c3c3c3
          display flex
          flex-direction column
          justify-content space-between
          font-size 14px
          .name
            font-size 18px
            color #fff
          .singer
            margin-top -15%
            font-size 14px
          .description
            width 90%
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            display inline-block
            margin-top 2px
          i
            width 14px
            height 14px
            display inline-block
            background url('../../../static/img/next.png')
            background-size contain
      .sheet
        height 100%
        width 100%
        display flex
        align-items center
        justify-content space-evenly
        position relative
        z-index 1
        background-color #546265
        .pic
          flex-basis 30%
          display flex
          flex-direction column
          justify-content center
          position relative
          span
            position absolute
            top 7px
            right 7px
            font-size 14px
            i
              display inline-block
              width 14px
              height 14px
              background url('../../../static/img/playCount.png')
              background-size cover
              vertical-align top
          img
            position relative
            width 100%
        .info
          width 60%
          height 120px
          flex-basis 60%
          color #c3c3c3
          display flex
          flex-direction column
          justify-content space-around
          font-size 14px
          .name
            font-size 18px
            color #fff
          .creator
            font-size 14px
            img
              width 20px
              border-radius 50%
              vertical-align middle
          .description
            width 90%
            margin-top 2px
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 2
            overflow hidden
          i
            width 14px
            height 14px
            display inline-block
            background url('../../../static/img/next.png')
            background-size contain
      .auth-sheet
        width 100%
        height 100%
        overflow hidden
        position relative
        z-index 1
        img
          width 100%
          // height 100%
          position absolute
          // top -30px
        .info
          position absolute
          top 30%
          left 3%
          display flex
          flex-direction column
          p
            margin 3% 0
            display flex
            align-items center
            .update
              padding 3px
              background-color rgba(200,200,200,.3)
              color #ccc
              font-size 12px
              border-radius 3px 
            .description
              white-space pre-line
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              overflow hidden
              font-size 14px
              color #ccc
              line-height 20px
            i
              width 14px
              height 14px
              display inline-block
              background url('../../../static/img/next.png')
              background-size contain 
      .bg-img
        width 100%
        height 100%
        overflow hidden
        position relative
        z-index 1
        img
          width 100%
          height 100%
          position absolute
        span
          position absolute
          color white
          font-size $font-size-large-x
          bottom 20px
          left 10px
          display inline-block
          z-index 1
          p
            margin-top 10px
            color #ccc
            font-size 14px
        .filter
          position absolute
          width 100%
          height 100%
          background-color rgba(0,0,0,.3)
          
    
          
    .space    
    .music-list-contain
      height 65%
      z-index 0
      position relative
      bottom 0
      .music-list-item
        height 100%
        overflow hidden
        li
          display block
          height 60px
          font-size 14px
          .info
            display inline-block
            width 80%
            height 60px
            pointer-events none
            span
              display inline-block
              float left
              width 40px
              height 50px
              text-align center
              line-height 60px
              color rgba(255,255,255,.5)
            p
              white-space: nowrap
              text-overflow ellipsis
              overflow hidden
              font-size 14px   
              span
                all unset
                color rgba(255,255,255,.5)
            p:nth-child(2)
              line-height 50px
              margin-top -3px
              // display inline-block
            p:nth-child(3)
              font-size 12px
              color rgba(255,255,255,.5)
              margin-top -10px
          .mv
            display inline-block
            float right
            margin-right 10px
            padding-top 20px
            i
              display inline-block
              width 20px
              height 20px
              background url(../../../static/img/mv.png) 0 0 no-repeat
              background-size contain
          .more
            display inline-block
            float right
            margin 0 10px
            padding-top 20px
            i
              display block
              border 2px solid #8a8a8a
              border-radius 50%
              margin 2px
    .slide-enter-active, .slide-leave-active
      transition all .2s
    .slide-enter, .slide-leave-to
      transform translate3d(0,100%,0)
</style>
