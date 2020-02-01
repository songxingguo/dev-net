import Api from '../../src/utils/api'

const prefixUrl = 'https://net.songxingguo.workers.dev'

export default class album {
  static getImgs (marker, limit) {
    return Api.get(`${prefixUrl}/album/imgs?marker=${marker}&limit=${limit}`).then(({data}) => data)
  }

  static uploadToken () {
    return Api.get(`${prefixUrl}/album/token`).then(({data}) => data)
  }

  static edit (key, deskey) {
    return Api.get(`${prefixUrl}/album/edit?key=${key}&deskey=${deskey}`).then(({data}) => data)
  }

  static delete (key) {
    return Api.get(`${prefixUrl}/album/delete?key=${key}`).then(({data}) => data)
  }
}
