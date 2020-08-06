<template>
  <div class="comment">
    <div class="title">
      <div class="backed" @click="back"><i></i></div>
      评论({{comment.total}})
    </div>
    <scroll class="scroll" :upLoad="_getComment">
      <div>
        <div class="song">
          <img :src="song.al.picUrl+'?param=80y80'" alt="">
          <div class="info">
            <span>{{song.name}}</span>
            <br>
            <span>{{song.ar[0].name}}</span>
          </div>
        </div>
        <div class="container">
          <ul>
            <li v-if='comment.hotComments.length'>精彩评论</li>
            <li v-for="(item,index) in comment.hotComments" :key='index'>
              <div class="info">
                <img :src="item.user.avatarUrl" alt="" class="profile-photo">
                <div class="commentator">
                  <span class="name">{{item.user.nickname}}
                    <span v-if= "item.user.userId == singer.accountId">作者</span>
                  </span>
                  <br>
                  <span class="time">{{item.time1}}</span>
                </div>  
                <div class="like">
                  <span class="like-account">{{item.likedCount>99999?(item.likedCount/10000).toFixed(1)+'万':item.likedCount}}</span>
                  <i class="like-png"></i>
                </div>
              </div>
              <div class="content">
                {{item.content}}
                <p v-if= "item.beReplied[0]"> <span>@{{item.beReplied[0].user.nickname}}</span>: {{item.beReplied[0].content}}</p>
              </div>
            </li>
            <li class='new-comment'>最新评论 <span class='total'>{{comment.total}}</span></li>
            <li v-for="(item) in comments" :key='item.id'>
              <div class="info">
                <img :src="item.user.avatarUrl" alt="" class="profile-photo">
                <div class="commentator">
                  <span class="name">{{item.user.nickname}}</span>
                  <br>
                  <span class="time">{{item.time1}}</span>
                </div>  
                <div class="like">
                  <span class="like-account">{{item.likedCount>99999?(item.likedCount/10000).toFixed(1)+'万':item.likedCount}}</span>
                  <i class="like-png"></i>
                </div>
              </div>
              <div class="content">{{item.content}}</div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>  
</template>

<script>
//vuex获取moreSelect评论(总数)、歌曲信息
//路由传入歌曲id 用于上拉加载更多的评论


import {getComment} from '../../api/comment'
import scroll from '../../base/scroll/bscroll'
import {mapGetters,mapMutations} from 'vuex'
export default {                
  data(){
    return{
      index: 20,
      comments:[],
      date:[]
    }
  },
  methods:{

    _getComment(){        //上拉加载更多 每次加载20条
      getComment(this.$route.params.id,this.index).then(
        (res)=>{
          this.comments.push(...res.data.comments)
          this.index += 20
          console.log(this.comments,this.index)
          this.time(this.comments)
        })
    },
    time(comment){           //整理评论时间
      comment.map((item,index)=>{
        var date = new Date(item.time).toLocaleString()
        var time = new Date(item.time).toTimeString()
        var now = new Date()
        var dated = date.split(' ')[0].split('/')
        var timed = time.split(' ')[0].split(':')
        var duration = now.getTime()-item.time
        if(duration<60000){
          comment[index].time1 = '刚刚'
        }else if(duration<3600000){
          // console.log(Math.floor((now.getTime()-item.time)/60000))
          comment[index].time1 = `${Math.floor((now.getTime()-item.time)/60000)}分钟前`
          now.getHours()!==timed[0]?comment[index].time1 = `${now.getMinutes()-timed[1]+60}分钟前`:
          comment[index].time1 = `${now.getMinutes()-timed[1]}分钟前`
        }else if(now.getFullYear()==dated[0]){
          comment[index].time1 = `${dated[1]}月${dated[2]}日`
        }else{
          comment[index].time1 = `${dated[0]}年${dated[1]}月${dated[2]}日`
        }

      })
    },
    
    back(){
      // this.$router.go(-1)
      this.$router.back()
      this.setHiddenPlayer('visibility: visible')
    },
    ...mapMutations({
      setHiddenPlayer: 'SET_VISIBILITY'
    })
  },
  computed:{
    
    ...mapGetters(['comment','song','singer']),  //vuex中取出 热评等数据
    
  },
  created(){ 
    // this.$nextTick(()=>{

        this.time(this.comment.hotComments)  //整理时间
        // this._getComment()
        // this.comment.hotComments.length<1?this._getComment():null//上拉加载的评论
        this._getComment()
        console.log('loadddddddddddd')
        console.log(this.$route.params)
        // this._getComment()
        // alert('none')
    // })
    
  },
  activated(){
    console.log('dsaad')
  },
  watch:{
    // comment: function(){
    //   console.log('12300-----------')
    //   this.comments = Object.assign({},this.comment.comments)
    //   this.time(this.comments)
    // },
  },
  components:{
    scroll
  },
  mounted(){
    console.dir(this.$refs.newComment)
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .comment
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    width 100%
    height 100% 
    background-color #fff
    z-index 11
    overflow hidden
    &:after
      background url(../../../static/img/bg.jpg) 0 0 no-repeat
      background-size 100% 100%
      content: ''
      display block
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      transform scale(1.1)
      filter: blur(10px)
      z-index: -10
    &:before
      content: ''
      display block
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      background rgba(0,0,0,.6)
      z-index -1
    .title
      height 40px
      padding 20px 0 0 20px
      .backed
        float left
        margin-right 10px
        z-index 11
        i
          border solid red
          border-width 3px 0 0 3px
          display inline-block
          transform rotate(-45deg)
          --webkit-transform rotate(-45deg)
          padding 6px
    .scroll
      height 90%
      overflow hidden
      .song
        background-color rgba(0,0,0,.2)
        margin-bottom 10px
        padding 10px
        display flex
        align-items center
        img
          display inline-block
          width 80px
          height 80px
          vertical-align middle
          border-radius 10px
        .info
          padding-left 10px
          display inline-block
          vertical-align middle
        span
          line-height 22px
        :nth-child(1)
          font-size 16px
          // color red
        :nth-child(3)
          font-size 14px
          color rgba(255,255,255,.4)
      .container
        background-color rgba(0,0,0,.2)

        li
          font-size 16px
          padding 10px
          // border-bottom 1px solid #515151
          position relative
          .total
            color #8c8c8c
            font-size 14px
          &:after
            content: ''
            position absolute
            right 0
            bottom 0
            width 87%
            border-bottom 1px solid #ffffff1c
          &:nth-child(1):after
            display none
          &:nth-child(17):after
            display none
          .info
            img
              display inline-block
              width 30px
              height 30px
              vertical-align middle
              border-radius 50%
              margin-right 5px
            div
              display inline-block
              vertical-align top
              font-size 12px
              color #818181
              .name
                color #dbdbdb
                font-size 12px
                vertical-align text-top
                span
                  display inline-block
                  border 1px solid #ccc
                  box-sizing border-box
                  border-radius 4px
                  padding 1px
                  -webkit-transform scale(0.6,0.6)
              .time
                font-size 10px
                display inline-block
                padding-top 5px
            .like
              float right
              margin-right 20px
              i
                width 22px
                height 22px
                display inline-block
                background url("../../../static/img/like.png") no-repeat
                background-size contain
                margin-bottom -3px
                vertical-align text-bottom
          .content
            font-size 2vh
            padding 10px 15px 5px 40px
            line-height 22px
            color #dbdbdb
            p
              border-left 2px solid #515151
              margin-top 5px
              font-size 10px
              padding-left 10px
              line-height 20px
              color #9c9c9c
              span
                color #6facdb
        .new-comment:after
          all unset
        

      
</style>