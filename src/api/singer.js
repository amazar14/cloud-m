import axios from "axios"

export function getSingerList(index){   //歌手排行榜列表
  return axios.get("https://autumnfish.cn/top/artists?offset="+index+"&limit=10")
}

export function getSingerDetail(id){   //歌手详细信息
  return axios.get("https://autumnfish.cn/artists?id="+id)
}

export function getSingerDesc(id){        //歌手详细描述
  return axios.get('https://autumnfish.cn/artist/desc?id='+id)
}