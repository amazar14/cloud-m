<template>
<div class='wraper'>
  <scroll class='wraper' :upLoad='loadSong'>
    <!-- <keep-alive> -->
      <ul>
        <div class='interest'>
          <p>你可能感兴趣</p>
          <div class='taste' v-if='multimatch.album' @click='checkAlbum(multimatch.album[0].id)'>
            <img :src="multimatch.album[0].picUrl" alt="">
            <div>
              <p class='name'>专辑: {{multimatch.album[0].name}}</p>
              <p class="info">{{multimatch.album[0].artist.name}}</p>
            </div>
          </div>
          <div class='taste' v-if='multimatch.artist' @click='checkSinger(multimatch.artist[0].id)'>
            <img :src="multimatch.artist[0].img1v1Url" alt="">
            <div>
              <p class='name'>歌手: {{multimatch.artist[0].name}}</p>
              <p class="info">
                粉丝:{{fans}}
                歌曲:{{multimatch.artist[0].musicSize}}
                专辑:{{multimatch.artist[0].albumSize}}
              </p>
            </div>  
          </div>
        </div>
        <li>单曲</li>
        <li v-for='(item,index) in cloneResult' @click='play(item.id)' :key="index">
          <div class='info'>
            <span class='song name' v-for='(i,index) in item.name' :class="{'light':word.toLowerCase()==i.toLowerCase()}" :key="index">
              {{i}}
            </span>
            <span class='song' v-if= 'item.transNames'>({{item.transNames[0]}})</span>
            <span class='song' v-else-if= 'item.alias.length !== 0'>({{item.alias[0]}})</span>
            <div class='mes'>
              <span class='singer'>
                <span v-for='(i,key) in item.artists' :class="{'light':word==i.name}" :key="key">
                  {{key>0?' / ':''}}{{i.name}}
                </span>
              </span>
              <span class='ablum' v-if='item.album'>-{{item.album.name}}</span>
              <span class='alias' v-if='item.alias.length'>{{item.alias[0]}}</span>
            </div>
          </div>
          <i class='mv'></i>
          <i class='more' @click.stop='more(item.id)'></i>
        </li>
      </ul>
    <!-- </keep-alive> -->
  </scroll>
  <!-- <keep-alive> -->
    <transition name='slide'>
      <moreSelect :id='mark' v-if='mark' v-show='moreShow' @hide='moreShow=!moreShow'></moreSelect>
    </transition>
  <!-- </keep-alive> -->
    <transition name='rowslide'>
      <router-view></router-view>
      <router-view name='moreto'></router-view>
    </transition>
</div>
</template>

<script>
import {mapMutations, mapActions} from 'vuex'
import {getSongDetail} from '../../api/getSongUrl'
import {getSerch, getSerchDetail} from '../../api/serch'
import scroll from '../../base/scroll/bscroll'
import moreSelect from '../../components/moreSelect/moreSelect'

export default {
  data(){
    return{
      pbj: {},
      mark: 0,
      moreShow: false,

    }
  },
  props:['serchResult','multimatch','word'],
  methods:{
    print(){
      console.log(this.pbj)
    },
    play(id,index){
      console.log(this.cloneResult)
      getSongDetail(id).then((res)=>{
        console.log(res.data.songs[0])
        this.playCurrent(res.data.songs[0])
      })
    },
    more(index){
      this.moreShow = true
      this.mark = index
    },
    loadSong(){
      getSerchDetail(this.$props.word, 20, 20).then((res)=>{
        this.$props.serchResult.push(...res.data.result.songs)
      })
    },
    checkAlbum(id){
      console.log(id)
      this.$router.push({
        name: 'album',
        params:{
          id: id
        }
      })
    },
    checkSinger(id){
      this.$router.push({
        // path: `/singer/${this.$props.multimatch.artist[0].id}`,
        name: 'serchSinger',
        query: {
          id: id,
          type: 'singer'
        }
      }),
      this.setSinger(this.$props.multimatch.artist[0])
      console.log(this.$props.multimatch)
    },
    ...mapActions(['selectPlay','playCurrent']),
    ...mapMutations({
      setPlayList: 'SET_PLAYLIST',
      setSequencelist:'SET_SEQUENCELIST',
      setSinger: 'SET_SINGER'
    }),

  },
  computed:{
    cloneResult(){                 //搜索结果展示数据
      let leng = this.$props.serchResult.length
      let tar = Object.assign([], this.$props.serchResult)   //克隆传过来的搜索结果数组
      let regBefore = new RegExp(`[\\d\\D]+(?=${this.$props.word})`, 'gi')
      let regAfter = new RegExp(`(?<=${this.$props.word})[\\d\\D]+`, 'gi')
      let reg = new RegExp(this.$props.word,'gi')
      for(let item of tar){
        if(typeof item.name == 'object') continue
        let arr =[]
        item.name.match(regBefore)==null?null:arr.push(item.name.match(regBefore)[0])
        item.name.match(reg)==null?arr.push(item.name):arr.push(item.name.match(reg)[0])
        item.name.match(regAfter)==null?null:arr.push(item.name.match(regAfter)[0])
        item.name = arr
      }
      return tar

    },
    fans(){
      return this.$props.multimatch.artist[0].fansSize>100000?((this.$props.multimatch.artist[0].fansSize)/10000).toString().substring(0,(this.$props.multimatch.artist[0].fansSize/10000).toString().indexOf('.')+2)+'w':this.$props.multimatch.artist[0].fansSize
    }
  },
  watch:{
    serchResult: function(){
      this.pbj = this.props
      console.log(this.$props)
      console.log(this.pbj)
    }
  },
  components:{
    scroll,
    moreSelect
  }
}
</script>

<style lang='stylus' scoped>
@import "~common/stylus/base"
.wraper
  height 100%
  ul
    padding-left 20px
    font-family "Times New Roman",Georgia,Serif
    // z-index 1
    .interest
      p:nth-child(1)
        line-height 20px
        font-size 16px
      .taste
        height 70px
        display flex
        align-items center
        img
          width 50px
          height 50px
          border-radius 50%
          margin-right 10px
        .name
          font-size 16px
        .info
          margin-top 5px
          font-size 14px
          color #8a8a8a
    li
      display flex
      align-items center
      // justify-content space-between
      // height 80px
      margin 20px 0
      font-size 18px
      line-height 18px
      &:nth-child(2)
        margin-top 30px
        height 20px
        line-height 20px
      div
        width 80%
        font-family 12px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        color #b1b1b1
        .song
          font-size 14px
          font-weight 100
        .name
          color #fff 
        .light
          color #91cae6
        .mes
          margin-top 2px
          font-size 12px 
          .alias
            display block
      i
        display inline-block
        width 22px
        height 22px
        margin-left 10px
      .mv
        background url('../../../static/img/mv.png') 0 0 no-repeat
        background-size contain
      .more
        background url('../../../static/img/更多.png') 0 0 no-repeat
        background-size contain
  .slide-enter-active,.slide-leave-active
    transition all .3s
  .slide-enter,.slide-leave-to
    transform translateY(100%)
  .rowslide-enter-active,.rowslide-leave-active
    transition all .3s
  .rowslide-enter,.rowslide-leave-to
    transform translateX(100%)
</style>