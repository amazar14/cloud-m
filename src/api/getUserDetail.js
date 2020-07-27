import axios from 'axios'

export function getUserDetail(userId){  //用户信息
  return axios.get('https://autumnfish.cn/user/detail?uid='+userId)
}
