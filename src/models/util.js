export default {
  columns: ['id', 'トラッカー', 'プロジェクト', '題名', '優先度', 'ステータス', '進捗率', '作成者', '担当者', '開始日', '期日', '更新日'],

  convertOptions: function (values) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.value,
        text: el.label
      }
      options.push(option)
    })
    return options
  },
  convertOptionObjs: function (values, key) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.id,
        text: el[key]
      }
      options.push(option)
    })
    return options
  },
  convertProjectObjs: function (values, key) {
    let options = []
    values.forEach(el => {
      let option = {
        id: el.id,
        name: el[key]
      }
      options.push(option)
    })
    return options
  },
  convertUsersObjs: function (values) {
    let options = []
    values.forEach(el => {
      let option = {
        value: el.id,
        text: el.firstname + ' ' + el.lastname
      }
      options.push(option)
    })
    return options
  },
  findValue: function (options, name) {
    let ret
    options.forEach(element => {
      if (element.text === name) {
        ret = element.value
      }
    })
    return ret
  },

  getNowYMD: function () {
    var dt = new Date()
    var y = dt.getFullYear()
    var m = ('00' + (dt.getMonth() + 1)).slice(-2)
    var d = ('00' + dt.getDate()).slice(-2)
    var result = y + '-' + m + '-' + d
    return result
  }
}
