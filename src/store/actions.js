import * as types from './mutation-types'

export const selectPlay = function({commit,state},{list,index}){
  console.log(state)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const playCurrent  = function({commit,state},song){
  let list = Object.assign([],state.player.playList)
  list.push(song)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_CURRENTINDEX, list.length-1)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const changeSong = function({commit,state},index){
  // console.log(state)
  // console.log(commit)
  commit(types.SET_CURRENTINDEX, index)
}

export const setList = function({commit,state},list){
  commit(types.SET_PLAYLIST, list)
}

export const addSong = function({commit,state},song){    //下一首播放
  commit(types.ADD_SONG, song)
}

export const delSong = function({commit,state},index){    //删除一首
  commit(types.DEL_SONG, index)
}