<template>
  <div class="recommend" ref='recommend'>
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <keep-alive>
            <slider v-if = "recommends.length" ref='banner' key='banner'>
              <div class="swiper-slide" v-for= "(item,index) in recommends" :key='index'>
                <a href="javascript:;">
                  <img :src="item.pic" alt="">
                  <span :style= "{'backgroundColor':(item.titleColor=='red'?'#ff3b3b':'#4c8aee')}">{{item.typeTitle}}</span>
                </a>
              </div>
            </slider>
          </keep-alive>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <keep-alive>
            <ul>
              <li v-for= "(item,index) in songSheets" @click='showSheet(item.id)' :key='index'>
                <a href="javascript:;">
                  <span><i></i>{{item.playCount.toString().length >=9 ? (item.playCount/100000000).toFixed(2)+"亿" : (item.playCount/10000).toFixed(2)+"万"}}</span>
                  <img width="50" height="50" :title= 'item.name' :src= "item.picUrl" alt="">
                  <p>{{item.name}}</p>
                </a>
              </li>
            </ul>
          </keep-alive>
        </div>
        <div class='new-song-recommend'>
          <div class='title'>
            <p class='date'>{{date}}</p>
            <p>
              <span :class="{'light':active}" @click='active=true'>新歌</span> |
              <span :class="{'light':!active}" @click='active=false'>新碟</span>
            </p>
          </div>
          <sliderb ref= 'newSong' key='newSong' :prue='false' :new='1'>
            <div class='swiper-slide' v-show='active'>
              <ul>
                <li v-for='(item,index) in newSong' @click='playItem(item.id)' :key='index'>
                  <img :src="item.picUrl+'?param=60y60'" alt="">
                  <div class="info">
                    <p>{{item.name}}
                      <span class='singer'>- {{item.song.artists[0].name}}</span>
                    </p>
                    <p class='album'>{{item.song.album.name}}</p>
                  </div>
                  <i class="play"></i>
                </li>
              </ul>
            </div>
            <div class='swiper-slide' v-show='active'>
              <ul>
                <li v-for='(item,index) in newSong2' @click='playItem(item.id)' :key='index'>
                  <img :src="item.picUrl+'?param=60y60'" alt="">
                  <div class="info">
                    <p>{{item.name}}
                      <span class='singer'> - {{item.song.artists[0].name}}</span>
                    </p>
                    <p class='album'>{{item.song.album.name}}</p>
                  </div>
                  <i class="play"></i>
                </li>
              </ul>       
            </div>
            <div class='swiper-slide' v-show='!active'>
              <ul>
                <li v-for='(item,index) in newAlbum' @click='showAlbum(item.id)' :key='index'>
                  <img :src="item.picUrl+'?param=60y60'" alt="">
                  <div class="info">
                    <p>{{item.name}}
                      <span class='singer'>- {{item.artist.name}}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class='swiper-slide' v-show='!active'>
              <ul>
                <li v-for='(item,index) in newAlbum2' @click='showAlbum(item.id)' :key='index'>
                  <img :src="item.picUrl+'?param=60y60'" alt="">
                  <div class="info">
                    <p>{{item.name}}
                      <span class='singer'>- {{item.artist.name}}</span>
                    </p>
                    <!-- <p class='album'>{{item.song.album.name}}</p> -->
                  </div>
                  
                </li>
              </ul>
            </div>
          </sliderb>
        </div>
      </div>
    </scroll>
    <div class= "loading-container" v-show= "!songSheets.length">
      <loading></loading>
    </div>
    <transition name='slider'>
      <router-view></router-view>
      <router-view name='moreto'></router-view>
    </transition>
  </div>
</template>


<script> 

    //轮播图 targetType= 1 单曲
  import Loading from '../../base/loading/loading.vue'
  import scroll from '../../base/scroll/bscroll'
  import Slider from '../../base/slider/slider'
  import Sliderb from '../../base/slider/sliderb'
  import {getRecommend, getSongsheetList, getNewSong,getNewAlbum} from '../../api/cloudRecommend'
  import {ERR_OK} from '../../api/config'
  import {getSheet} from '../../api/getSheet'
  import {mapMutations,mapActions,mapGetters} from 'vuex'
  import {getSongDetail} from '../../api/getSongUrl'
  export default {
    data (){
      return{
        recommends:[],
        songSheets:[],
        newSong:[],
        newSong2:[],
        newAlbum:[],
        newAlbum2:[],
        active: true
      }
    },
    created() {
      this._getRcommend(),
      this._getSongsheetList()
      this._getNewSong()
      this._getNewAlbum()
      this.setType('recommend')
    },
    mounted(){
      this.currentIndex >=0? this.$refs.recommend.style.bottom = '60px':null
    },
    watch: {
      currentIndex(newIndex){
        newIndex>=0? this.$refs.recommend.style.bottom = '60px':null
      }
    },
    methods: {
      _getRcommend(){
        getRecommend().then((res)=>{this.recommends = res.data.banners;console.log(this.recommends)})
      },
      _getSongsheetList(){
        getSongsheetList().then((res)=>{this.songSheets = res.data.result;console.log(this.songSheets)})
      },
      _getNewSong(){
        getNewSong().then((res)=>{
          this.newSong = Array.from(res.data.result).slice(0,3)
          this.newSong2 = Array.from(res.data.result).slice(3,6)
          })
      },
      _getNewAlbum(){
        getNewAlbum().then((res)=>{
          this.newAlbum= Array.from(res.data.albums).slice(0,3)
          this.newAlbum2= Array.from(res.data.albums).slice(3,6)
        })
      },
      showSheet(id){
        console.log(id)
        this.$nextTick(()=>{
          this.$router.push({
            path: `/recommend/sheet`,
            query: {
              ids: id,
              type: 'sheet'
            }
          })
        })
      },
      playItem(id){
        getSongDetail(id).then((res)=>{
          console.log(res)
          this.playCurrent(res.data.songs[0])
        })
      },
      showAlbum(id){
        this.$nextTick(()=>{
          this.$router.push({
            name: `recommendAlbum`,
            params: {
              id: id
            }
          })
        })
      },
      ...mapMutations({
        setType: 'SET_TYPE'
      }),
      ...mapActions(['playCurrent'])
    },
    computed:{
      ...mapGetters(['currentIndex']),
      date(){
        let dateArr = new Date().toLocaleDateString().match(/(?<=[\/])[\d]+/g)
        return `${dateArr[0]}月${dateArr[1]}日`
      }
    },
    components: {
      slider: Slider,
      sliderb: Sliderb,
      scroll: scroll,
      loading: Loading,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
        span
          position absolute
          bottom 0
          right 5%
          border-radius 5px 0 5px 0
          padding 5px
          font-size 14px
          display inline-block
          color #fff
      .recommend-list
        .list-title
          height 50px
          line-height 50px
          text-align left
          padding-left 15px
          font-size $font-size-medium-x
          color $color-theme
        ul
          display flex
          width 100%
          height 100%
          flex-wrap wrap
          justify-content space-evenly
          li
            position relative           
            width 100px
            margin 5px 0
            img
              width 100%
              height 100px
              border-radius 8px
            p
              font-size 12px
              line-height 16px
              color #cfcfcf
              padding-top 3px
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 2
              overflow hidden
            i
              display inline-block
              border 5px solid transparent
              border-left 5px solid white
              width 0
              height 0
            span
              position absolute
              right 0
              color white
              font-size  .3rem
              margin 5px
      .new-song-recommend
        margin-top 3vh
        padding 0 2vh 0 2vh
        .title
          font-size 18px  
          color #aeaeae
          margin-bottom 2vh
          .date
            font-size 14px
            margin-bottom 1vh
          .light
            color #fff
        // color red
      //   .swiper-wrapper
      //     width 400px
      //     color green
      //     .swiper-slide
      //       // margin-left -20px
      //       width 100px
      //       ul
      //         width 80%
      //         // color green
    .loading-container
      position absolute
      width 100% 
      top 80%
      transform translateY(-50%)
    .slider-enter-active, .slider-leave-active
      transition all .3s
    .slider-enter, .slider-leave-to
      transform translateX(100%)


</style>