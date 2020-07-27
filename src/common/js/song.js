export default class Song{
  constructor({id, mid, name, singer, ablum, duration, image, url}){
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.singer = singer;
    this.ablum = ablum;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(songData){
  return new Song({
    id: songData.id,
    name: songData.name,
    singer: songData.singer,
    ablum: songData.ablum,
    image: songData.image,
    url: songData.url,
    duration: songData.duration
  })
}