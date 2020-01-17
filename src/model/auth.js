import Api from '../../src/utils/api'
import {wx} from "../config/certificate";

export default class Auth {
  static getAccessToken () {
    return Api.get(`/token`).then(({data}) => data)
  }
}
