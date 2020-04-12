import Api from '../../src/utils/api'
import axios from 'axios'

const prefixUrl = 'https://net.songxingguo.workers.dev'

// Exif 实体
function Exif ({DateTime, ExposureTime, FNumber, FocalLength, Model, ISOSpeedRatings} = {}) {
  return {
    dateTime: DateTime.val, // 拍摄时间
    exposureTime: ExposureTime.val, // 快门时间
    fNumber: FNumber.val, // 光圈大小
    focalLength: FocalLength.val, // 焦距
    model: Model.val, // 机型
    ISO: ISOSpeedRatings.val, // ISO
  }
}

export default class album {
  static getImgs ({prefix, marker = '', limit = 10} = {}) {
    return Api.get(`${prefixUrl}/calbum/imgs?marker=${marker}&limit=${limit}&prefix=${prefix}`).then(({data}) => data)
  }

  static getImgExif (imgUrl) {
    return axios.get(`${imgUrl}?exif`).then(({data}) => Exif(data))
  }

  static uploadToken () {
    return Api.get(`${prefixUrl}/album/token`).then(({data}) => data)
  }

  static edit (key, deskey) {
    return Api.get(`${prefixUrl}/album/edit?key=${key}&deskey=${deskey}`).then(({data}) => data)
  }

  static copy (key, deskey) {
    return Api.get(`${prefixUrl}/album/copy?key=${key}&deskey=${deskey}`).then(({data}) => data)
  }

  static delete (key) {
    return Api.get(`${prefixUrl}/album/delete?key=${key}`).then(({data}) => data)
  }

  static check (key) {
    return Api.get(`${prefixUrl}/album/check?key=${key}`).then(({data}) => data)
  }

  static batchCheck (keys = []) {
    return Api.post(`${prefixUrl}/album/batchCheck`, {keys}).then(({data}) => data)
  }

  static async upload (formData) {
    const uploadUrl = 'https://up.qiniup.com'
    return axios.post(uploadUrl, formData, {
      headers: {'Content-Type': 'multipart/form-data"'}
    }).then(({data}) => data)
  }
}
