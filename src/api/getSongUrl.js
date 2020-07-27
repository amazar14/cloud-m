import axios from 'axios'

export function getSongUrl(id){
  //    /song/detail?ids=347230  歌曲详情 下面的不详细
  return axios.get('https://autumnfish.cn/song/url?id='+ id) //歌曲url
}

// export function getSongDetail(id){
//   return axios.get('https://autumnfish.cn/song/detail?ids='+id)
// }

export function getSongDetail(id){
  return axios.get('https://api.imjad.cn/cloudmusic/?type=detail&id='+id)  //歌曲详情
}