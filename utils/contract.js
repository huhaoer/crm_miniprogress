// 合同类型
const _contractType = [
    {
      name: '维护类',
      id: 0
    },
    {
      name: '开发类',
      id: 1
    },
    {
      name: '服务类',
      id: 2
    },
    {
      name: '产品类',
      id: 3
    },
  ]
  // 处理合同类型  数字转文字显示
  function _contractType2Word(type) {
    switch (type) {
      case 0:
        return "维护类";
      case 1:
        return "开发类";
      case 2:
        return "服务类";
      case 3:
        return "产品类";
    }
  }
  // 处理合同类型  文字显示转数字
  function _contractType2Number(type) {
    switch (type) {
      case "维护类":
        return 0;
      case "开发类":
        return 1;
      case "服务类":
        return 2;
      case "产品类":
        return 3;
    }
  }

  module.exports = {
    _contractType,
    _contractType2Word,
    _contractType2Number
  }