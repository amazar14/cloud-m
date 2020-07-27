<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    props:{
      probeType: {
        type: Number,
        default: 3,
      },
      click:{
        type: Boolean,
        default: true,
      },
      data:{
        type: Array,
        default: null,
      },
      upLoad:{
        type: Function,
        default: null
      },
      bounce:{
        type: Boolean,
        default: true
      },
      pos:{
        type: Number,
        default: 0
      },
      lrcShow:{
        type: Boolean,
        default: null
      }
    },
    mounted (){
      setTimeout(()=>{
        console.log('定时器')
        this._initScroll()
      },20)
      // this.$nextTick(()=>{
      //   console.log('next延迟')
      //   this._initScroll()
      // })
    },
    methods:{
      _initScroll (){     //创建 better-scroll 实例
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper,{
          probeType: this.probeType,
          click: this.click,
          resizePolling:100,
          bounce:{
              top: this.bounce,
              bottom: this.bounce,
              left: true,
              right: true,
            },
            bounceTime: 400,
            momentum: true,
          pullUpLoad:{
            threshold:-50,
            probeType: 3,
            
          },
          pullDownRefresh:{
            threshold: 50,
            probeType: 3
          }
        })
        this.scroll.on("pullingUp",()=>{
          if(this.$props.upLoad) this.$props.upLoad()
          console.log('shangla gengxin')
          this.$nextTick(()=>{
            // this.scroll.refresh()
          })

          this.scroll.finishPullUp()
        })

        this.scroll.on("pullingDown",()=>{
          this.$nextTick(()=>{
            console.log("refresh")
            this.scroll.refresh()
          })
          this.scroll.finishPullDown()
        })
        this.scroll.on('scroll', ()=>{
          this.$emit('scroll',this.scroll.y)
        })
        this.scroll.on('scrollStart', ()=>{
          this.$emit('scrollStart')
        })
        this.scroll.on('scrollEnd',()=>{
          this.$emit('scrollEnd')
        })

      },
      
      enable(){
        this.scroll && this.scroll.enable()
      },
      disable(){
        this.scroll && this.scroll.disable()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      ...mapMutations({
        setScrollPos: 'SET_SCROLLPOS'
      })
    },
    computed:{
      ...mapGetters(['scrollPos'])
    },
    watch: {    //监视data动态变化，执行重新渲染
      data (){
        setTimeout(() =>{
          console.log('watch refresh')
          this.refresh()
        },20)
      },
      pos(newScroll){
        this.scroll.scrollTo(0,newScroll,1500)
      },
    },
  }
</script>

<style lang="stylus">


</style>