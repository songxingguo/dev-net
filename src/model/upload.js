import Api from '../../src/utils/api'

export default class Upload {
  static getUploadUrl ({path}) {
    return Api.post('/tcb/uploadfile', {path}).then(({data}) => data)
  }

  static getDownloadUrl (filelist) {
    if (filelist.length == 0) return
    return Api.post('wx/download', {file_list: this._getFileList(filelist)}).then(({data}) => {
      return data.file_list.map((item, index) => {
        const fileid = item.fileid
        return {
          uid: Date.now() + index,
          file_id: fileid,
          url: item.download_url,
          name: fileid.slice(fileid.lastIndexOf('/') + 1),
          status: 'done'
        }
      })
    })
  }

  static _getFileList (filelist) {
    return filelist.map(item => {
      return {fileid: item, max_age: 7200}
    })
  }
}
