import axios from "axios"

export function getComment(id, index=0){ //获取歌曲评论
  return axios.get("https://autumnfish.cn/comment/music?id=" +id +"&offset="+ index)
}