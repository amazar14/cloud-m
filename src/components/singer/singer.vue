<template>
  <div class="singer">
    <scroll class="singer-list" :data= "singerList" :upLoad= "_getSingerList">
      <div>
        <keep-alive>
          <ul @click="select">
            <li>热门歌手</li>
            <li v-for= "(item,index) in singerList" class="singer-list-item" :key='index' :data-index='index'>
              <img v-lazy= "item.picUrl+'?param=60y60'" alt="" width="60" height="60">
              <span line-height="60">{{item.name}}</span>
            </li>
          </ul>
        </keep-alive>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer'
  import scroll from '../../base/scroll/bscroll'
  import {mapMutations} from 'vuex'
  export default {
    data(){
      return {
        singerList: [],
        index: 0
      }
    },
    methods:{
      print(e){
        console.dir(e.target.dataset.index)
      },
      _getSingerList(){             //上拉加载更多
        getSingerList(this.index).then((res)=>{
          this.singerList.push(...res.data.artists);
          this.index += 10;
          console.log("歌手:", this.singerList)
        })
      },
      select(e){
        console.dir(this.singerList[e.target.dataset.index])
        console.dir(e.target)
        let singer = this.singerList[e.target.dataset.index||e.target.parentElement.dataset.index]
        this.$router.push({
          path: `/singer/${singer.id}`,
          query: {
            type: 'singer'
          }
        }),
        this.setSinger(singer)   //简写了this.$store.commit("SET_SINGER")
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',  //...map 映射出mutations里面的方法(引号里的) 然后自定义变量
        setType: 'SET_TYPE'
      })                       // setSinger接收方法  this.setSinger就是this.$store.commit('')
    },
    created(){
      this._getSingerList()
      this.setType('singer')
    },
    components: {
      scroll: scroll
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable' 
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
    .singer-list
      width 100%
      height 100%
      overflow hidden
      font-size $font-size-medium-x
      color $color-theme-d
      & li
        padding-left 10px
      .singer-list-item
        padding 5px
        & img
          width 60px
          height 60px
          border-radius 50%
        & span
          position absolute
          left 80px
          line-height 60px
        &:nth-child(even)
          background-color rgba(0,0,0,.4)
    .slide-enter-active, .slide-leave-active
      transition all 0.2s
    .slide-enter, .slide-leave-to
      transform translateX(100%)
    // .singer-list
    //   width 100%
    //   height 100%
      
</style>