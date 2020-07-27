<template>
  <div class="rank" ref='rank'>
     <!-- @touchstart= 'changePageStart($event)' -->
    <!-- <keep-alive> -->
      <scroll class="scroll" :upLoad=null>
        <div>
          <div class="top">
            <p>官方榜</p>
            <div v-for = "(item,index) in list" @click="send(item.id,item.name)" :key='index'>
              <img :src="item.coverImgUrl" alt="">
              <span>{{item.updateFrequency}}</span>
              <ul>
                <li v-for= "(it,index) in item.tracks" :key="index">
                  {{(index+1) +'.'+ it.first}} - {{it.second}}
                </li>
              </ul>
            </div>
          </div>
          <div class="total">
            <p class="title">推荐榜</p>
            <ul>
              <li v-for= "item in recommendList" @click="send(item.id,item.name)" :key='item.id'>
                <img :src= "item.coverImgUrl" alt="">
                <span>{{item.updateFrequency}}</span>
                <p>{{item.name}}</p>
              </li>
            </ul>
            <p class="title">全球榜</p>
            <ul>
              <li v-for= "item in globalList" @click="send(item.id,item.name)" :key='item.id'>
                <img :src= "item.coverImgUrl" alt="">
                <span>{{item.updateFrequency}}</span>
                <p>{{item.name}}</p>
              </li>
            </ul>
            <p class="title">更多榜单</p>
            <ul>
              <li v-for= "item in moreList" @click="send(item.id,item.name)" :key='item.id'>
                <img :src= "item.coverImgUrl" alt="">
                <span>{{item.updateFrequency}}</span>
                <p>{{item.name}}</p>
              </li>
            </ul>
          </div>

        </div>
      </scroll>
    <!-- </keep-alive> -->
    <transition name="slide">
      <router-view></router-view>
      <!-- <router-view name='moreto'></router-view> -->
    </transition>
  </div>
</template>

<script>
import {rank,rankDetail} from '../../api/rank'
import scroll from '../../base/scroll/bscroll'
import musicList from '../../components/musicList/musicList'
import {mapMutations} from 'vuex'
export default {
  data(){
    return{
      list:[],
      recommendList:[],
      globalList:[],
      moreList:[]
    }
  },
  methods:{
    changePageStart(e){
      let {pageX:startX, pageY:startY} = e.changedTouches[0]
      console.log(startX,startY)
      let that = this
      function position(e){
        let {pageX:endX,pageY:endY} = e.changedTouches[0]
        let [slipX,slipY] = [endX-startX, endY-startY]
        if(slipX<-100){
          that.$router.push({
            path:'/serch'
          })
        }else if(slipX>100){
          that.$router.push({
            path:'/singer'
          })
        }
        that.$refs.rank.removeEventListener('touchend',position,false)
      }
      console.dir(this.$refs.rank)
      this.$refs.rank.addEventListener('touchend',position,false)
    },
    send(id,name){
      this.$router.push({     //跳转到singerDetail 展示排行榜单
        path: `/rank/${id}`,   // 歌单id
        query: {
          rankName: name,   //传给路由歌单名
          type: 'rank'      //类型
        }
      })
      rankDetail(id).then((res)=>{
        this.setRank([])
        this.setRank(res.data.playlist.tracks)
        })
    },
    ...mapMutations({
      setRank: 'SET_RANK',
      setType: 'SET_TYPE'
    })
  },
  created(){
    console.log('enternenternern')
    rank().then(res=>{
      console.log(res)
      this.list = res.data.list.splice(0,4)
      this.recommendList = res.data.list.splice(0,6)
      this.globalList = res.data.list.splice(0,6)
      this.moreList = res.data.list
      console.log(res)}),
    this.setType('rank')
  },
  components:{
    scroll
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .rank
    position fixed
    top 88px
    bottom 0
    left 0
    right 0
    padding 15px
    overflow hidden
    .scroll
      width 100%
      height 100%
      img
        width 25vw
        // height 27%
        border-radius 6px
      .top
        p
          font-size 5vw
        div
          margin-top 15px
          display flex
          position relative
          span
            position absolute
            bottom 5px
            left 2px
            font-size 12px
            transform scale(0.9,0.9)
          ul
            margin-left 10px
            font-size 14px
            color #bbb
            display flex
            flex-direction column
            justify-content space-around
            li
              text-overflow ellipsis
              overflow hidden
              white-space nowrap
              width 200px
      .total
        margin-top 30px
        .title
          margin-top 20px
          font-size 5vw
        ul
          display flex
          flex-wrap wrap
          justify-content space-between
          li
            margin-top 10px
            position relative
            font-size 3vw
            span
              top 20vw
              position absolute
              left 2px
              transform scale(0.9)
            p
              font-size 3vw
              margin-top 5px
              line-height 16px
              width 25vw
    .slide-enter-active, .slide-leave-active
      transition all 0.3s
    .slide-enter, .slide-leave-to
      transform translateX(100%)



              

          

          



</style>