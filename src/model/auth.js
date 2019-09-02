import Api from '../../src/utils/api'
import {wx} from "../config/certificate";

export default class Auth {
  static getAccessToken () {
    return Api.get(`/cgi-bin/token?grant_type=client_credential&appid=${wx.APPID}&secret=${wx.APPSECRET}`).then(({data}) => data)
  }
}
