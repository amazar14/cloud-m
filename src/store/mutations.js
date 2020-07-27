import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state,singer) {
    state.singer = singer
  },
  [types.SET_COMMENT](state,comment){
    state.comment = comment
  },
  [types.SET_SONG](state,song){
    state.song = song
  },
  [types.SET_RANK](state,rank){
    state.rank = rank
  },
  [types.SET_FULLSCREEN](state,fullScreen){
    state.player.fullScreen = fullScreen
  },
  [types.SET_PLAYING](state,playing){
    state.player.playing = playing
  },
  [types.SET_PLAYLIST](state,playList){
    state.player.playList = playList
  },
  [types.SET_SEQUENCELIST](state,sequenceList){
    state.player.sequenceList = sequenceList
  },
  [types.SET_MODE](state,mode){
    state.player.mode = mode
  },
  [types.SET_CURRENTINDEX](state,currentIndex){
    state.player.currentIndex = currentIndex
  },

  [types.ADD_SONG](state,song){                           //下一首播放
    console.log(state.player.currentIndex)
    state.player.playList.splice(state.player.currentIndex+1,0,song)
    state.player.sequenceList.splice(state.player.currentIndex+1,0,song)
  },
  [types.DEL_SONG](state,index){                                //删除一首
    state.player.playList.splice(index,1)
    if(index<state.player.currentIndex){state.player.currentIndex -=1}
    // state.player.sequenceList.splice(index,1)
  },
  [types.SET_TYPE](state,type){
    state.type = type
  },
  [types.SET_VISIBILITY](state,visibility){
    state.visibility = visibility
  }
}
export default mutations
