<template>
  <div class="player" v-show= 'playList.length >0'>
    <div class='wrapper' :style='visibility'>
      <!-- 全屏 -->
      <transition name='slide'>
      <div :class="{'hidden-player':!fullScreen,'show-player':fullScreen, normal:true}" ref='normal'>
        <div class="mask" ref='mask'></div>
        <!-- 全屏头部 -->
        <div class="title">
          <i class="back" @click= 'back'></i>
          <div class="song">
            <p class="name">{{currentSong.name}}</p> 
            <p class="singer" v-if="currentSong.ar" @click='checkSinger(currentSong.ar[0].id)'>{{currentSong.ar[0].name}}</p> 
          </div>
          <i class="share"></i>
        </div>
        <!-- 全屏内容区域 -->
        <div class="contain" @click= "changeShow">
          <!-- 音量控制 -->
          <transition name="show">
            <div class="volume" v-if= "voc==true" v-show= "lrcShow">
              <i class="volume-ico"></i>
              <progressBar class="volume-control" @jumped="jumpVolume" @draged="jumpVolume" :quantity='0.1'></progressBar>
            </div>
          </transition>
          <!-- 专辑封面 -->
          <transition name="show">
            <div :class="{'ablum':true, 'rotate':state=='play'}" ref='ablum' v-show='!lrcShow'>
              <img :src="currentSong.al.picUrl+'?param=130y130'" alt="" v-if="currentSong.al">
            </div>
          </transition>
          <div class="info" v-show='!lrcShow' @click.stop='toComment'>评论</div>
          <!-- 歌词滚动 -->
            <bscroll :class="{'hidden-lrc':!lrcShow, lyric: true}" :bounce='false' :pos='scrollY' @scrollStart='scrollStart' @scrollEnd='scrollEnd'>
              <ul ref='lrc'>
                <li v-for='(item,index) in lrc' :key='index'>
                  <p>{{item[0]}}</p>
                  {{item[1]}}
                </li>
              </ul>
            </bscroll>
        </div>
        <!-- 全屏-底部控制、进度 -->
        <div class="footer">
          <div class="select"></div>
          <div class="progress">
            <span>{{timing}}</span>
            <progressBar class="song-time" :audio='audio' v-if="currentSong.al" @jumped="jump" @draged="drag" ref="progress"></progressBar>
            <span>{{durationStr}}</span>
          </div>
          <div class="control">
            <i></i>
            <i class="pre_song" @click="prv"></i>
            <i :class= "state" @click='changeState'></i>
            <i class="next_song" @click="next"></i>
            <i class="list" @click='listShow = !listShow'></i>
          </div>

        </div>
      </div>
      </transition>
      <!-- mini底部 -->
      <div class="mini" v-show= '!fullScreen' @click="back">
        <img :src="currentSong.al.picUrl+'?param=40y40'" alt="" v-if="currentSong.ar">
        <div class="info"  v-if="currentSong.ar">
          <p class="song">{{currentSong.name}}</p>
          <p class="singer">{{currentSong.ar[0].name}}</p>
        </div>
        <div class="control">
          <circleline :duration= 'duration' :state= 'state' :e='toTurn' :audio='audio'></circleline>
          <i :class= "state" @click.stop='changeState'></i>
          <i class="list" @click.stop='listShow = !listShow'></i>
        </div>
      </div>
      <!-- 播放列表 -->
      <transition name='listshow'>
          <list v-show="listShow" class='sheet' @back='back()' @select='audio.play()'></list>
      </transition>
    </div>
    <audio :src= 'currentUrl'></audio>
  <!-- <router-view name='playerCheck'></router-view> -->
  </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'

import {getLrc} from '../../api/getLrc'
import {getSongUrl} from '../../api/getSongUrl'
import {getSingerDetail} from '../../api/singer'
import {getComment} from '../../api/comment'
import progressBar from '../progress/progress'
import bscroll from '../../base/scroll/bscroll'
import list from './list'
import circleline from './circle/circle'
export default {
  data(){
    return{
      audio:{},
      state: 'stop',
      lrc:[],
      currentUrl: '',
      interval: null,
      timing:'00:00',
      duration: 0,
      durationStr: '',
      index: 0,
      timeIndex: 0,
      lrcShow: false,
      lrc:[],
      tlrc:[],
      lrcTime:[],
      lrcIndex:0,
      listShow: false,
      toTurn: 0,         //mini中圆环比例
      voc: false,        //加载声音控制
      scrollY: 0,        //同步scroll纵坐标
      slide: false,       //触摸歌词滑动
      // visibility: 'visibility:visible'
    }
  },
  methods:{
    back(){
      if(this.listShow == true){
        this.listShow = false
        return
      }
      this.setFullScreen(!this.fullScreen)
      console.log(this.fullScreen)
    },
    checkSinger(id){
      // let type = window.location.hash.match(/[a-z]+?/g)[0]
      console.log(id)
      console.log(this.type)
      // this.setFullScreen(!this.fullScreen) // 
      // this.setFullScreen(!this.setFullScreen)
      console.log(window.location.hash)
      if(window.location.hash == '#/singer'){
        this.setHiddenPlayer('visibility: hidden')
        return     
      }
      getSingerDetail(id).then((res)=>{
        this.setSinger(res.data.artist)

            this.$router.push({
              name:`${this.type}Singer`,
              query: {
                id: id
              }
            })

      setTimeout(()=>{
        this.setHiddenPlayer('visibility: hidden')
      },500)
      })
    },
    toComment(){
      console.log(this.currentSong)
      getComment(this.currentSong.id).then((res)=>{
        //修改当前currentSong的数据 (基本数据)  这里只添加了评论
        setTimeout(()=>{
          this.setHiddenPlayer('visibility: hidden')          
        },300)
        this.setComment(res.data)
        this.setSong(this.currentSong)
        this.$router.push({
          name: `${this.type}Comment`,
          params: {
            id:this.currentSong.id
            }
        })
      })
    },
    changeState(){
      this.state == 'play'? this.state='stop': this.state='play'
      if(this.audio.paused){
        this.audio.play()
        this.state='play'
        console.log(this.timeIndex)
        this.scale = parseFloat((this.$refs.progress.width/(this.duration)).toFixed(2))
        this.interval = this.timeinterval()
      }else{
        this.audio.pause()
        this.state='stop'
        clearInterval(this.interval)
      }
      this.audio.ontimeupdate = ()=>{
        if(this.state == 'stop') return
        for(let i=0; i<this.lrcTime.length; i++){
          if(this.audio.currentTime*1000>=this.lrcTime[i]&&this.audio.currentTime*1000<=this.lrcTime[i+1]){
          if(this.lrcIndex == i) return
            // console.log(this.slide)
            for(let j=0; j<this.lrc.length; j++){      //清除其他歌词颜色
              this.$refs.lrc.children[j].style.color = ''
            }

            this.$refs.lrc.children[i].style.color = '#fff'  //当前高亮
            this.slide==false?this.scrollY = (200-this.$refs.lrc.children[i].offsetTop):null
            this.lrcIndex = i
            return
          }else if(this.audio.currentTime*1000>this.lrcTime.slice(-1)){  //最后一行歌词高亮
            if(this.lrcIndex == this.lrcTime.length-1) return
            for(let j=0; j<this.lrcTime.length-1; j++){      //清除其他歌词颜色
              this.$refs.lrc.children[j].style.color = ''
            }
            this.$refs.lrc.children[this.lrcTime.length-1].style.color = '#fff'
            this.lrcIndex = this.lrcTime.length-1
          }
        }
      }
    },
    timeinterval(){   
     return setInterval(()=>{
          this.timeIndex = Math.ceil(this.audio.currentTime)*1000
          this.index = this.scale + this.index
          this.$refs.progress.dot.style.left = this.index + 'px'
          this.$refs.progress.wrap.style.width = this.index + 'px'

          this.timing = this.timeStr(this.timeIndex+=1000)
          if(this.timing==this.durationStr){   //结束恢复 初始化状态
            this.state= 'stop'
            this.original()
            clearInterval(this.interval)
            return
          }
        },1000)
    },
    timeStr(t){
      let min = Math.floor(t/60000)<10? '0'+Math.floor(t/60000) : Math.floor(t/60000)
      let sec = Math.floor(t/1000)%60<10? '0'+Math.floor(t/1000)%60 : Math.floor(t/1000)%60
      return min +':'+ sec
    },
    jump(e){
      this.toTurn = e
      this.audio.currentTime = this.duration*e
      this.timing = this.timeStr(this.duration*e*1000)
      this.index = +this.$refs.progress.dot.style.left.split('p')[0]
      if(this.audio.paused) return
      clearInterval(this.interval)
      this.interval = this.timeinterval()
    },
    drag(e){
      this.toTurn = e
      this.timing = this.timeStr(this.duration*e*1000)
      clearInterval(this.interval)
    },
    scrollStart(){
      this.slide==false?this.slide = true:null
    },
    scrollEnd(){
      this.slide = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setSinger: 'SET_SINGER',
      setScrollPos: 'SET_SCROLLPOS',
      setHiddenPlayer: 'SET_VISIBILITY',
      setComment: 'SET_COMMENT',
      setVisibility: 'SET_VISIBILITY',
      setSong: 'SET_SONG'
    }),
    ...mapActions(['changeSong']),

    jumpVolume(e){
      this.audio.volume = +e
    },
    changeShow(){
      if(this.listShow == true){
        this.listShow = false
        return
      }
      this.lrcShow = !this.lrcShow
      this.voc = true
      console.log(this.voc)
    },
    prv(){
      if(this.currentIndex == 0) return
      this.changeSong(this.currentIndex-1)
    },
    next(){
      console.log(this.currentIndex)
      console.log(this.currentSong)
      if(this.currentIndex == this.playList.length-1) return
      this.changeSong(this.currentIndex+1)
    },
    original(){
      clearInterval(this.interval)
      this.interval = null
      this.timing = '00:00'
      this.index=0
      this.timeIndex =0
      this.lrcIndex =-1
      this.$refs.progress.dot.style.left = this.$refs.progress.wrap.style.width = '0px'
      this.scrollY = 0
      for(let j=0; j<this.lrc.length; j++){      //清除其他歌词颜色
        this.$refs.lrc.children[j].style.color = ''
      }
    },
    setLrc(res){
      let timeReg = /\[\d.+?\d\]/g  
      let timeRowReg = /\[\d.+?\d\].+/g
      let emptyRowReg = /\[[\d\D]{8,9}\][\n]/g
      console.log(res)
      res.data.lrc.lyric = res.data.lrc.lyric.replace(emptyRowReg,'') //去掉无歌词的空行
      this.lrcTime = res.data.lrc.lyric.match(timeReg).map((item)=>{  //取出时间转化为毫秒
        item = item.slice(1,3)*60000+(+item.slice(4,6)*1000)+(+item.slice(7,9))
        return isNaN(item)? null:item
      })
      this.lrcTime.sort((a,b)=>a-b)
      //this.lrc = res.data.lrc.lyric.replace(emptyRowReg,'').match(timeReg) //取出时间 创建数组
      this.lrc = res.data.lrc.lyric.match(timeReg) //取出时间 创建时间点数组
      this.lrc.sort((a,b)=>{
        return a.slice(1,9).replace(/:/g,'')-b.slice(1,9).replace(/:/g,'')
      })
      let lrcConArr = res.data.lrc.lyric.match(timeRowReg) //匹配每一行歌词内容[02:10:12]...
      let tlrcConArr = []
      lrcConArr = lrcConArr.map((item,index)=>{ //去除空歌词
        if(item.match(/\]\[/)){
          let timeArr = item.match(timeReg)
          let cont = item.match(/(?<=\]\[[\d\D]+\]+).+/g)
          tlrcConArr.push(timeArr[1]+cont)
          item = timeArr[0]+cont
        }

        return item!==undefined?item:null
      })
      lrcConArr = lrcConArr.concat(tlrcConArr)
      lrcConArr.sort((a,b)=>{
        return a.slice(1,9).replace(/:/g,'')-b.slice(1,9).replace(/:/g,'')
      })

      if(!res.data.tlyric.lyric){  //无翻译时
        this.lrc = this.lrc.map((item,index)=>{  //将歌词内容中时间去掉 返回内容
          let empty = []
          // console.log(lrcConArr[index])
          lrcConArr[index]?empty[0]= lrcConArr[index].replace(/\[.+\]/g,''):null
          return empty
        })

      }else{                        //有翻译
        let tArr = res.data.tlyric.lyric.match(timeReg)   //取出时间点
        let tConArr = res.data.tlyric.lyric.match(/\[\d.+?\d\].*/g)  //匹配每一行歌词内容[02:10:12]...
        // let tConArr = res.data.tlyric.lyric.match(/(?<=\]).+?/g)
        tArr = tArr.map((item,index)=>{       //创建 时间,翻译 数组
          let empty = []
          empty[0]= item
          empty[1]= tConArr[index].replace(emptyRowReg,'').replace(/\[.+\]/g,'')
          // empty[1]= tConArr[index].replace(/[\n]/g,'')
          return empty
        })
        this.lrc = this.lrc.map((item,index)=>{   //创建 原歌词的(时间,歌词) 数组
          let empty = []
          empty[0]= item

          empty[1] = lrcConArr[index].replace(/\[.+\]/g,'')
          for(let tItem of tArr){
            if(empty[0]==tItem[0]){         //歌词时间一致，返回双语歌词
              return [empty[1],tItem[1]]
              break
            }
            if(tArr.indexOf(tItem) == tArr.length-1){    //无翻译时，翻译为空
              return[empty[1]]
              break
            }
          }
        })    
      }
    }
  },
  computed:{
    ...mapGetters(['fullScreen','playList','currentSong','currentIndex','type','visibility']),
  },
  created(){
    console.log(this.currentSong)
  },
  mounted(){
    this.audio = document.getElementsByTagName('audio')[0]
    this.audio.volume = .1
    // this.$nextTick(()=>{this.voc = true})
    
  },
  watch:{
    currentSong: function (){
      let reg = /\[[\d\D]+?\]/g
      console.log(this.currentSong)
      getSongUrl(this.currentSong.id).then((res)=>{
        console.log(this.currentSong.id)
        getLrc(this.currentSong.id).then((res)=>{
          this.setLrc(res)
        })
        this.currentUrl = res.data.data[0].url
      // this.scale = this.$refs.progress.width/this.duration
        this.original()
      })
      this.duration = Math.floor(this.currentSong.dt/1000)
      this.durationStr = this.timeStr(this.currentSong.dt)
      this.$refs.mask.style.background = `url('${this.currentSong.al.picUrl}?param=400y700') 0 0 no-repeat`
    }
  },
  components:{
    progressBar,
    bscroll,
    list,
    circleline
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .player
    position fixed
    bottom 0
    left 0
    right 0
    z-index 1

    .normal
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      background-color #414141
      // background url('https://p2.music.126.net/KTo5oSxH3CPA5PBTeFKDyA==/109951164581432409.jpg') 0 0 no-repeat
      // background-size 100% 100%
      // filter blur(10px)
      z-index 10
      overflow hidden
      .mask
        position absolute
        width 100%
        height 100%
        background-size 100% 100% !important
        background-repeat no-repeat
        z-index -1
        filter blur(50px)
      .title
        height 10%
        padding 0 20px
        display flex
        align-items center
        .back
          display inline-block
          width 25px
          height 25px
          background url('../../../static/img/back.png') 0 0 no-repeat
          background-size contain
        .song
          margin-left 20px
          color #bfbfbf
          .name
            font-size 16px
            margin-bottom 5px
            color #fff
          .singer
            font-size 14px
            color #8a8a8a
            &:after
              content ''
              display inline-block
              vertical-align bottom
              width 13px
              height 13px
              background url(../../../static/img/next.png) 0 0 no-repeat
              background-size contain
        .share
          width 35px
          height 35px
          display inline-block
          background url(../../../static/img/fenxiang.png) 0 0 no-repeat
          background-size contain
          position absolute
          right 20px
      .contain
        height 70%
        position relative
        .volume
          display flex
          justify-content space-evenly
          .volume-ico
            width 15px
            height 15px
            background url('../../../static/img/volume.png')
            background-size contain
          .volume-control
            margin-top 6px
            margin-right 10px
            width 75%
            display inline-block
        .rotate
          animation identifier 48s linear 0s infinite
          animation-play-state running !important
          -webkit-animation-play-state running !important
        .ablum
          width 200px
          height 200px
          background url(../../../static/img/coverall.png) -143px 912px
          position absolute
          top 0
          bottom 0
          left 0
          right 0
          margin auto
          transform scale(1.2)
          animation identifier 48s linear 0s infinite
          animation-play-state paused
          -webkit-animation-play-state paused
          // animation-play-state paused
          // -webkit-animation-play-state paused
          img
            width 130px
            height 130px
            border-radius 50%
            overflow hidden
            margin 35px
        .info
          color #8c8c8c
          position absolute
          bottom 0
          right 20%
        .hidden-lrc
          visibility hidden
        .lyric
          overflow hidden
          height 93%
          position relative
          top 10px
          color #939393
          z-index 100
          ul
            margin 0 auto
            width 80%
            position relative
            font-size 2vh
            text-align center
            padding-top 40%
            padding-bottom 50%
            li
              width 100%
              // height 70px
              // display flex
              // flex-wrap wrap
              // align-content center
              text-align center
              line-height 20px
              padding 15px 0
              // margin-bottom 15px
              // p
              //   width 100%
              //   margin-bottom 2px
      .footer
        height 20%
        font-size 12px
        color #818181
        .select
          height 20%
        .progress
          height 20%
          display flex
          justify-content center
          span
            transform scale(.9)
            &:nth-child(1)
              color #bbb
          .song-time
            width 70%
            margin 5px 10px
        .control
          display flex
          justify-content space-evenly
          align-items center
          i
            display inline-block
            width 30px
            height 30px
            // background-color #ccc
          .pre_song
            background url(../../../static/img/presong.png) 0 0 no-repeat
            background-size cover
          .stop
            width 60px
            height 60px
            background url(../../../static/img/stop.png) 0 0 no-repeat
            background-size contain
          .play
            width 60px
            height 60px
            background url(../../../static/img/play.png) 0 0 no-repeat
            background-size contain
          .next_song
            background url(../../../static/img/nextsong.png) 0 0 no-repeat
            background-size contain
          .list
            background url(../../../static/img/list.png) 0 0 no-repeat
            background-size contain
      &:after
        content ''
        display block
        width 100%  
        height 100%
        position absolute
        top 0
        left 0
        z-index -1
        background-color rgba(50,50,50,.7)
        // background url('https://p2.music.126.net/KTo5oSxH3CPA5PBTeFKDyA==/109951164581432409.jpg')
        // background-size 100% 100%
        // z-index -10
        // filter blur(70px)
    .hidden-player  
      left 100%  
      right -100%  
      // visibility hidden
      animation remove .4s
    .show-player
      left 0
      right 0
      animation enter .4s
    .mini
      position fixed
      bottom 0
      left 0
      right 0
      height 8%
      background-color #4b4a4d
      border-top #625e5e 1px solid
      display flex
      align-items center
      border-radius 12px 12px 0 0
      img
        width 40px
        height 40px
        border-radius 50%
        margin-left 10px
      .info
        font-size 14px
        margin-left 5px
        width 60%
        .song
          margin-bottom 5px
          width 100%
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .singer
          color #dbdbdb
          font-size 12px
      .control
        position absolute
        right 0
        i
          right 0
          display inline-block
          width 30px
          height 30px
          margin-right 10px
        .stop
          position absolute
          right 50px
          background url(../../../static/img/stop.png) 0 0 no-repeat
          background-size contain
        .play
          position absolute
          right 50px
          background url(../../../static/img/play.png) 0 0 no-repeat
          background-size contain
        .list
          background url(../../../static/img/list.png) 0 0 no-repeat
          background-size contain
    .sheet
      z-index 100
      position fixed
      bottom 0
      width 100%
      height 100vh
      
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translateX(100%)
  .show-enter-active, .show-leave-active
    transition opacity  .2s
  .show-enter, .show-leave-to
    opacity 0
  .listshow-enter-active, .listshow-leave-active
    transition all .2s
  .listshow-enter, .listshow-leave-to
    transform translateY(100%)

  @keyframes identifier {
    from {transform: rotate(0) scale(1.2)}
    to {transform: rotate(360deg) scale(1.2)}
  }
  @keyframes remove{
    from {left: 0; right: 0;}
    to {left: 100%; right: -100%;}
  }
  @keyframes enter{
    from {left: 100%; right:-100%}
    to {left: 0; right: 0;}
  }
</style>