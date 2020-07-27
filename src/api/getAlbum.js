import axios from 'axios'

export function getAlbum(id){
  return axios.get('https://autumnfish.cn/album?id='+id)
}