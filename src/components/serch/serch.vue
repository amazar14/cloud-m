<template>
  <div class='serch'>
    <!-- 搜索栏 -->
    <div class="serch-bar">
      <i class='back' @click='back'></i>
        <input type="text" @keyup.enter='send' v-model='content' @focus='showSuggest=true' @blur="showSuggest=false" ref='input'>
      <i class='clear' @click= "clearContent"></i>
      <!-- 搜索建议 -->
      <transition name='suggestActive'>
        <div class="suggest"  v-show='showSuggest&&suggestList.length!==0'>
          <ul>
            <li class='content' @click='send()'> 搜索  "{{content}}"</li>
            <li v-for='(item,index) in suggestList' @click='send($event,item.keyword)' :key='index'><i class='serch-ico'></i>{{item.keyword}}</li>
          </ul>
        </div>
      </transition>
    </div>
    <!-- 热搜榜单 -->
    <p v-show='!serch[0]'>热搜榜</p>
    <scroll class='list' :bounce='false' :data='serch' v-show='!serch[0]'>
      <div>
        <ul class='hot-list' @click='send'>
          <li v-for='(item,index) in serchHot' :key='index' :data-index='index'>
            <span class='order'>{{index+1}}</span>
            <span class='info'>
              <span>{{item.searchWord}}<img :src="item.iconUrl" alt=""></span>
              <span>{{item.content}}</span>
            </span>
            <span class='score'>{{item.score}}</span>         
          </li>
        </ul>
      <!-- <serchResult class='serch-result' v-show='serch!==0':result='serch' :multimatch='serchMultimatch'></serchResult> -->
      </div>
    </scroll>
    <serchResult class='serch-result' :word='content' :serchResult='serch' :multimatch='serchMultimatch' v-show='serch[0]' @loadSong='loadMore'></serchResult>
  </div>
</template>

<script>
import {getSerchHot, getSerch, getSerchDetail} from '../../api/serch'
import {suggestSearch, defaultSearch} from '../../api/suggestSearch'
import scroll from '../../base/scroll/bscroll'
import serchResult from './serchResult'
import {mapMutations} from 'vuex'
export default {
  data(){
    return{
      content:'',
      hotContent: '',    //搜索框 placeholder热搜
      serchHot:[],      //热搜列表
      serch:[],         //搜索单曲结果
      serchMultimatch:{   //搜索多重匹配
        type: Object,
        default: null
      },
      timeout: null,   //搜索防抖
      suggestList:[],
      showSuggest: false
    }
  },
  methods:{
    back(){
      if(this.serch.length!==0){
        this.serch= []
        this.content =''
        this.serchMultimatch = {}
        return
      }
      this.$router.back()
    },
    clearContent(){
      this.content = ''
      this.suggestList = []
    },

    // send(word){
    //   console.log(word)
    //   typeof word =='object'?word ='':this.content =word
    //   this.content==''?this.content=this.hotContent:
    //   getSerch(this.content).then((res)=>{this.serchMultimatch = res.data.result;console.log(res.data)})
    //   getSerchDetail(this.content).then((res)=>{this.serch = res.data.result.songs;console.log(res.data.result.songs)})
    //   this.$refs.input.blur()
    // },

    send(e,keyword){
      keyword?this.content = keyword:null
      if(this.content ==''&&e.target.dataset.index>=0){                 //热搜歌曲播放
        let word = this.serchHot[e.target.dataset.index].searchWord
        typeof word =='object'?word ='':this.content =word
      }
      this.content==''?this.content=this.hotContent:
      getSerch(this.content).then((res)=>{this.serchMultimatch = res.data.result;console.log(res.data)})
      getSerchDetail(this.content).then((res)=>{this.serch = res.data.result.songs;console.log(res.data.result.songs)})
      this.$refs.input.blur()
    },

    loadMore(){                               //上拉加载
      getSerchDetail(this.content, 20, 20).then((res)=>{
        this.serch.push(...res.data.result.songs)
        console.log(this.content)
      })
    },

    debounce(fn,time){                     //搜索建议 防抖
        if(this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
          fn()
        },time)   
    },
    suggest(){                              //搜索建议提示
      this.content.trim()==''?null:
      suggestSearch(this.content.trim()).then((res)=>{
        console.log(res)
        if(res.data.result.allMatch==undefined) return
        this.suggestList = res.data.result.allMatch
      })
    },
    ...mapMutations({
      setType: 'SET_TYPE'
    })
  },
  created(){
    getSerchHot().then((res)=>{this.serchHot = res.data.data;console.log(this.serchHot)})
    console.log(this.serch)
    console.log(this.content)
    console.log(this.suggestList)
    this.setType('serch')
  },
  mounted(){
    defaultSearch().then((res)=>{
      this.hotContent = res.data.data.realkeyword   //搜索框 placeholder热搜
      this.$refs.input.placeholder = res.data.data.showKeyword
    })
  },
  activated (){
    console.log('ACTIVED')
  },
  deactivated(){
    console.log('deactivated')
  },
  watch: {
    content: function(){
      let _content = this.content.trim()
      _content ==''?this.suggestList = []:this.debounce(this.suggest, 500)
      
    }
  },
  components:{
    scroll,
    serchResult
  }
}
</script>

<style lang="stylus" scoped>
  .serch
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    overflow hidden
    .serch-bar
      padding 20px 0
      font-size 18px
      color #818181
      display flex
      flex-wrap wrap
      justify-content space-around
      background-color rgba(192,192,192,.2)
      input
        all unset
        width 60%
        height 10px
        border-bottom 1px solid #ccc
        padding 5px
        color #ccc
        &::-webkit-input-placeholder 
          color: #919191
        &::-moz-input-placeholder 
          color: #ccc
        &::-ms-input-placeholder 
          color: #ccc
      i
        width 25px
        height 25px
        display inline-block
        position absolute
        top 15px
        right 13%
        background url('../../../static/img/删除.png')
        background-size contain
      .back
        width 30px
        height 30px
        top 14px 
        left 15px
        background url('../../../static/img/左返回.png')
        background-size contain
      .suggest
        position absolute
        z-index 1
        top 9%
        left 5%
        width 76%
        background-color #0e1118
        color #fff
        font-size 16px
        .content
          color #91cae6
          padding 0 15px
          white-space pre-wrap
        li
          height 50px
          line-height 50px
          border-bottom 1px solid #262930
          display flex
          align-items center
          .serch-ico
            all unset
            float left
            width 25px
            height 25px
            margin 0 10px
            background url('../../../static/img/搜索.png')
            background-size contain
    p
      line-height 40px
      font-size 16px
      margin-left 20px
      margin 20px 0 0 20px
    .list
      font-size 16px
      height 82%
      overflow hidden
      .hot-list
        li
          display flex
          justify-content space-evenly
          align-items center
          height 60px
        .order
          width 30px
          text-align center
          color #999
          pointer-events none
        .info
          width 70%
          height 50px
          display flex
          flex-direction column
          justify-content space-evenly
          pointer-events none
          span:nth-child(1)
            font-size 16px
          span:nth-child(2)
            font-size 12px
            color #999
          img
            height 15px
            // height 20px
            display inline-block
            vertical-align center
            margin-left 5px
        .score
          margin-top -8px
          font-size 14px
          color #999
    .serch-result
      height 90%
      width 100%
      top 10%
      position absolute
      overflow hidden
    &:after
      content: ''
      display block
      position: fixed
      top 0
      bottom 0
      left 0
      right 0
      background url(../../../static/img/bg.jpg)
      background-size 100% 100%
      filter: blur(20px)
      z-index -10
      transform: scale(1.2)
    &:before
      content: ''
      display block
      position: absolute
      width 100%
      height 100%
      background-color rgba(0,0,0,.6)
      z-index: -1
    .suggestActive-enter-active, .suggestActive-leave-active
      transition opacity .1s
    .suggestActive-enter, .suggestActive-leave-to
      opacity 0

</style>