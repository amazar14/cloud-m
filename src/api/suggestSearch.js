import axios from 'axios'

export function suggestSearch(keyword){
  return axios.get('https://autumnfish.cn/search/suggest?keywords='+keyword+'&type=mobile')
}

export function defaultSearch(){
  return axios.get('https://autumnfish.cn/search/default')
}