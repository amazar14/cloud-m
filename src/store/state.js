const state = {
  singer: {},
  comment: {},
  song: {},
  rank: [],
  player:{
    fullScreen: false,
    playing: false,
    playList: [],  //当前播放列表
    sequenceList: [],  //默认为顺序播放列表
    mode: 'sequence',  //loop random single   sequence：顺序播放
    currentIndex: -1
  },
  type: 'recommend',
  visibility: 'visibility: visible'
}

export default state