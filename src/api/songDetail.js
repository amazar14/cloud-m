import axios from "axios"

export function getSong(id){  //获取歌曲信息
  return axios.get("https://autumnfish.cn/song/detail?ids=" + id)
}