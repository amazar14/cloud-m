import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../components/rank/rank'
import Serch from '../components/serch/serch'
import Singer from '../components/singer/singer'
import Recommend from '../components/recommend/recommend'
import SingerDetail from '../components/singer-detail/singer-detail'
// import MoreSelect from '../components/moreSelect/moreSelect'
import Comment from '../components/comment/comment'
import musicList from '../components/musicList/musicList'
import Album from '../components/album/album'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      name: '1',
      path: '/recommend',
      component: Recommend,
      meta:{
        keepAlive: true
      },
      children: [
        {
          path: 'sheet',
          component: Album,
          children:[
            {
              path: 'singer',
              name: 'recommendSinger',
              component: SingerDetail
            },
            {
              path: 'comment',
              name: 'recommendComment',
              component: Comment
              // components:{
              //   comment: Comment
              // }
            },
            // {
            //   path: 'album',
            //   name: 'recommendAlbum',
            //   component: Album
            // }
          ],
        },
        {
          path: 'album',
          name: 'recommendAlbum',
          component: Album
        }
      ]
    },
    {
      name: '2',
      path: '/singer',
      component: Singer,
      meta:{
        keepAlive: true
      },
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: SingerDetail,
          children:[
            {
              path: 'comment',
              name: 'singerComment',
              component: Comment
              // components:{
              //   comment: Comment
              // }
            },
            {
              path: 'album',
              name: 'singerAlbum',
              component: Album
            },
            {
              path: 'singer',
              name: 'singerSinger',
              component: SingerDetail
            }
          ]
        }
      ]
    },
    {
      name: '3',
      path: '/rank',
      component: Rank,
      meta:{
        keepAlive: true
      },
      children:[
        {
          path: ':id',
          component: musicList,
          children:[
          {
            path: 'singer',
            name: 'rankSinger',
            component: SingerDetail
          },
          {
            path: 'comment',
            name: 'rankComment',
            component: Comment
            // components:{
            //   comment: Comment
            // }
          },
          {
            path: 'album',
            name: 'rankAlbum',
            component: Album
          }]
        }
      ]
    },
    {
      name: '4',
      path: '/serch',
      component: Serch,
      meta:{
        keepAlive: true
      },
      children:[
        {
          path: 'comment',
          name: 'serchComment',
          // component: Comment,
          components:{
            moreto: Comment
          }
        },
        {
          path: 'singer',
          name: 'serchSinger',
          // component: SingerDetail
          components:{
            moreto: SingerDetail
          }
        },
        {
          path: 'album',
          name: 'serchAlbum',
          // component: Album
          components:{
            moreto: Album
          }
        },
        // {
        //   path: 'album',
        //   name: 'album',
        //   // component: Album
        //   component: Album
        // },
        // {
        //   path: 'singer',
        //   name: 'singer',
        //   // component: SingerDetail
        //   component: SingerDetail
          
        // },
      ]
    },
  ]
})
