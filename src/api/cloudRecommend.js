import axios from "axios"

export function getRecommend(){
  return axios.get("https://autumnfish.cn/banner?type=1")
}

export function getSongsheetList(){
  return axios.get("https://autumnfish.cn/personalized?limit=8")
}

export function getNewSong(){
  return axios.get('https://autumnfish.cn/personalized/newsong')
}

export function getNewAlbum(){
  // return axios.get('https://autumnfish.cn/top/album?offset=0&limit=6')
  return axios.get('https://autumnfish.cn/album/newest')
  
}
