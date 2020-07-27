<template>
<!-- <keep-alive> -->
  <div class="more-select">
    <div class="back" @click='$emit("hide")'></div>
    <div class='contain'>
      <ul v-if= "song.al">
        <li>
          <img :src="song.al.picUrl" alt="">
          <div>
            <span>歌曲 : {{song.name}}</span>
            <br>
            <span>{{song.ar[0].name}}
            <span v-if= "song.ar[1]">/ {{song.ar[1].name}}</span>
            <span v-if= "song.ar[2]">/ {{song.ar[2].name}}</span>
            <span v-if= "song.ar[3]">/ {{song.ar[3].name}}</span>
            </span>
          </div>
        </li>
        <li @click='add()'><i class="play"></i><span>下一首播放</span></li>
        <li><i class="collect"></i><span>收藏到歌单</span></li>
        <li v-if= "comment.data" @click= "commentDetail"><i class="comment"></i><span>评论 ({{comment.data.total}})</span></li>
        <li><i class="share"></i><span>分享</span></li>
        <li @click= "singerDetail(song.ar[0].id,song.id)"><i class="singer"></i><span>歌手: {{song.ar[0].name}}
          <span v-if= "song.ar[1]">/ {{song.ar[1].name}}</span>
          <span v-if= "song.ar[2]">/ {{song.ar[2].name}}</span>
          <span v-if= "song.ar[3]">/ {{song.ar[3].name}}</span>
          </span>
        </li>
        <li @click= 'albumDetail(song.al.id)'><i class="ablum"></i><span>专辑：{{song.al.name}}</span></li>
      </ul>
    </div>
    <transition name= 'slide-left'>
      <!-- <router-view></router-view> -->
      <!-- <router-view name= 'moreto'></router-view> -->
    </transition>
  </div>
  <!-- </keep-alive> -->
</template>

<script>
  //创建moreSelect组件时 create歌曲信息(评论,歌曲信息)
  //将评论传到vuex
  //跳转歌手  路由传出歌曲id
  //跳转专辑  路由传出专辑id
  //跳转评论  路由传出歌曲id
  import {getSingerDetail} from '../../api/singer'
  import {getComment} from '../../api/comment'
  import {getSongDetail} from '../../api/getSongUrl'
  import {mapGetters} from 'vuex'
  import {mapMutations} from 'vuex'
  export default {                       
    data(){
      return {
        song :{},
        comment:{},
        albumList:[]
      }
    },
    props:{
      id: {
        type: Number,
        default: null
      }
    },
    methods:{
      print(){
        console.log('离开了了')
      },
      _songDetail(){  //获取歌曲信息  created执行
        console.log(this.$route.params)
        getSongDetail(this.id).then((res)=>{this.song = res.data.songs[0];console.log("歌曲",this.song)})
        getComment(this.id).then((res)=>{this.comment = res;console.log("评论:",res)})
        // getSingerDetail(this.song.id).then((res)=>{this.setSinger(res.data.artist)})
      },
      commentDetail(){            //将评论传到vuex
        console.log('push')
        this.$router.push({   //跳转评论路由
          name: `${this.type}Comment`,
          params:{
            id: this.id,  //上一个路由传入歌曲id 再次传入下一个评论路由
            type: this.$route.params.type  //上一个路由传入查看类型 再次传入下一个评论路由
          }
        })
        this.setComment(this.comment.data)
        this.setSong(this.song)
      },
      singerDetail(id,ids){
        console.log(this.song)
        console.log(this.$route.params)
        console.log(this.singer.id)

        if(this.$route.params.type == 'singer'&&this.song.ar[0].id==this.singer.id){
          console.log('iop')
          this.$router.back()
          return
        }
        this.$router.push({     //跳转歌手详细信息路由
          name: `${this.type}Singer`,
          query:{            //歌手id
            id: id,           //传入歌手id 
            type: this.$route.params.type
          }
        })
      },
      albumDetail(id){      //params传入id 到album发送请求 获取专辑详细信息
      console.log(this.$route.params)
        this.$router.push({
          name: `${this.type}Album`,
          params:{
            id: id
          }
        })
      },
      // query用name和path都可以传参是有一个前提的，如果router/index.js下面配置的name和path是一样的
      // 你说的这种做法确实没有区别，但是一般他们用的是 path:'/index',name:'index'这样就不行的
      add(){
        this.addSong(this.song)
      },
      ...mapMutations({
        setComment: 'SET_COMMENT',
        setSong: 'SET_SONG',
        setSinger: 'SET_SINGER',
        addSong: 'ADD_SONG',
        delSong: 'DEL_SONG'
      })
    },
    watch:{
      song(){
        getSingerDetail(this.song.ar[0].id).then((res)=>{
          this.setSinger(res.data.artist)
        })
      },
      id(newV){
        console.log(newV)
        this._songDetail()
      }
    },
    computed:{
      ...mapGetters(["singer","type"]),
    },
    created(){
      console.log(this.id)
        this._songDetail()
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .more-select
    position fixed
    bottom 0
    left 0
    right 0
    width 100%
    height 100%
    z-index 10
    .back
      width 100%
      height 36%
    .contain
      width 100%
      height 64%
      position absolute
      bottom 0
      left 0
      right 0
      background-color #ccc
      border-radius 20px 20px 0 0
      background-color #2c2c2c
      font-size 14px
      li
        width 95%
        border-bottom 1px solid #515151
        line-height 7vh
        padding 0 15px
        display flex
        align-items center
        div
          // vertical-align middle
          // display inline-block
          // width 95%
          font-size 16px
          line-height 22px
          padding 15px
          span:nth-child(3)
            font-size 14px
            color #8a8a8a
          span:nth-child(4)
            font-size 14px
            color #8a8a8a
            // width 80%
        // span 
        //   // display inline-block
        //   overflow hidden
        //   white-space nowrap
        //   text-overflow ellipsis
        //   // width 80%
        i
          display inline-block
          width 20px
          height 20px
          vertical-align sub
          margin 0 15px 0 0 
          line-height 8vh
        img
          width 60px
          height 60px
          display inline-block
          vertical-align middle
          border-radius 10px
        .share
          background url(../../../static/img/fenxiang.png)
          background-size contain
        .comment
          background url(../../../static/img/pinglun.png)
          background-size contain
        .singer
          background url(../../../static/img/geshou.png)
          background-size contain
        .ablum
          background url(../../../static/img/zhuanji.png)
          background-size contain
        .play
          background url(../../../static/img/ziyuan.png)
          background-size contain
        .collect
          background url(../../../static/img/jiarugedan.png)
          background-size contain
    .slide-left-enter-active, .slide-left-leave-active
      transition all .2s
      transition-delay .2s
      // transition-delay .2s
    .slide-left-enter, .slide-left-leave-to
      transform translate3d(100%,0,0)

</style>