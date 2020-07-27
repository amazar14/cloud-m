export const singer = state => state.singer
export const comment = state => state.comment
export const song = state => state.song
export const rank = state => state.rank
export const playing = state => state.player.playing
export const fullScreen = state => state.player.fullScreen
export const playList = state => state.player.playList
export const sequenceList = state => state.player.sequenceList
export const mode = state => state.player.mode
export const currentIndex = state => state.player.currentIndex
export const currentSong = state => {
  return state.player.playList[state.player.currentIndex] || {}
}
export const type = state => state.type
export const visibility = state => state.visibility
