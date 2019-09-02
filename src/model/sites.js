import Api from '../../src/utils/api'

export default class Sites {
  static list ({query}) {
    return Api.post('/tcb/databasequery',{query}).then(({data}) => data)
  }

  static create({query}) {
    return Api.post('/tcb/databaseadd', {query}).then(({data}) => data)
  }

  static delete({query}) {
    return Api.post('/tcb/databasedelete', {query}).then(({data}) => data)
  }
}
