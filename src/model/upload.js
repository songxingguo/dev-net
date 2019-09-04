import Api from '../../src/utils/api'

export default class Upload {
  static getUrl ({path}) {
    return Api.post('/tcb/uploadfile',{path}).then(({data}) => data)
  }
}
