import axios from 'axios'

export function getSheet(id){
  return axios.get('https://autumnfish.cn/playlist/detail?id='+id)
}