import axios from "axios"

export function getLrc(id){ //获取歌词
  // return axios.get("https://autumnfish.cn/comment/music?id=" +id +"&offset="+ index)
  return axios.get("https://autumnfish.cn/lyric?id="+id)
}