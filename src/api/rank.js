import axios from 'axios'

export function rank(){
  return axios.get('https://autumnfish.cn/toplist/detail')
}
export function rankDetail(id){
  return axios.get('https://autumnfish.cn/playlist/detail?id='+id)
}