import Api from '../../src/utils/api'
import Upload from '../model/upload'

export default class Sites {
  static list ({current = 1, pageSize = 10}) {
    return Api.post('/wx/query', {
      "query": `db.collection('sites').limit(${pageSize}).skip(${(current - 1) * pageSize}).get()`
    }).then(({data: {data, pager}}) => {
      if (!data) return {
        data: []
      }
      return {
        data: Promise.all(data.map(async item => {
          item = JSON.parse(item)
          return {
            id: item._id,
            title: item.title,
            type: {
              scenic: '景点',
              dept: '院系',
              building: '教学楼',
              dormitory: '宿舍',
              diningroom: '餐饮',
              library: '图书馆',
              site: '场馆',
              gate: '出入门',
              atm: 'ATM',
              toilet: '卫生间',
              service: '服务'
            }[item.type],
            desc: item.desc.toString(),
            position: item.position,
            location: item.location.coordinates.toString(),
            audio: {
              name: item.audio && item.audio.name,
              poster: item.audio && (await Upload.getDownloadUrl([item.audio.poster]))[0],
              src: item.audio && (await Upload.getDownloadUrl([item.audio.src]))[0]
            },
            images: await Upload.getDownloadUrl(item.images)
          }
        })),
        pagination: {
          current: pager.Offset,
          pageSize: pager.Limit,
          total: pager.Total
        }
      }
    })
  }

  static show (id) {
    return Api.post(`/wx/query`, {
      "query": `db.collection("sites")
      .where({_id:${JSON.stringify(id)}}).get()`
    }).then(async ({data}) => {
      const item = JSON.parse(data.data)
      return {
        id: item._id,
        title: item.title,
        type: item.type,
        desc: item.desc.join('\n'),
        position: item.position,
        location: item.location.coordinates.toString(),
        audio: {
          name: item.audio && item.audio.name,
          poster: item.audio && item.audio.poster,
          src: item.audio && item.audio.src
        },
        images: item.images
      }
    })
  }

  static edit (id, record) {
    return Api.post(`/wx/update`, {
      "query": `db.collection("sites").where({_id:${JSON.stringify(id)}})
      .update({data: ${this._formatData(record)}})`
    }).then(({data}) => data)
  }

  static create (record) {
    return Api.post('/wx/add', {
      "query": `db.collection('sites')
      .add({data: ${this._formatData(record)}})`
    }).then(({data}) => data)
  }

  static _formatData (data) {
    return `{title: ${JSON.stringify(data.title)},
      type: ${JSON.stringify(data.type)},
      desc: ${JSON.stringify(data.desc.trim().split(/[\s+\n]/))},
      position: "${data.position}",
      location: new db.Geo.Point(${data.location.split(",")[0]}, ${data.location.split(",")[1]}),
      audio: ${JSON.stringify(data.audio)},
      images: ${JSON.stringify(data.images)},
    }`
  }

  static delete (id) {
    return Api.post('/wx/delete', {
      "query": `db.collection('sites').doc('${id}').remove()`
    }).then(({data}) => data)
  }
}
