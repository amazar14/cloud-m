import axios from 'axios'
export function getSerchHot(){
  return axios.get('https://autumnfish.cn/search/hot/detail')
}
export function getSerch(keyword){
  return axios.get('https://autumnfish.cn/search/multimatch?keywords='+keyword)
}
export function getSerchDetail(keyword,limit=20,offset=0){
  return axios.get('https://autumnfish.cn/search?keywords='+ keyword+ '&limit='+ limit+'&offset='+ offset)
}