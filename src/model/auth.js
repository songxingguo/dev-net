import Api from '../../src/utils/api'

export default class Auth {
  static getAccessToken () {
    return Api.get(`/wx/token`).then(({data}) => data)
  }
}
