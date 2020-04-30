// 项目状态
const _projectStatus = [
    {
      name: '正常',
      id: 0
    },
    {
      name: '暂停',
      id: 1
    },
    {
      name: '中止',
      id: 2
    },
    {
      name: '结束',
      id: 3
    },
  ]
  // 处理项目状态  数字转文字显示
  function _projectStatus2Word(status) {
    switch (status) {
      case 0:
        return "正常";
      case 1:
        return "暂停";
      case 2:
        return "中止";
      case 3:
        return "结束";
    }
  }
  // 处理项目状态  文字显示转数字
  function _projectStatus2Number(status) {
    switch (status) {
      case "正常":
        return 0;
      case "暂停":
        return 1;
      case "中止":
        return 2;
      case "结束":
        return 3;
    }
  }


//   项目等级
const _projectLevel = [
    {
      name: 'P0',
      id: 0
    },
    {
      name: 'P1',
      id: 1
    },
    {
      name: 'P2',
      id: 2
    },
    {
      name: 'P3',
      id: 3
    },
    {
      name: 'P4',
      id: 4
    },
    {
      name: 'P5',
      id: 5
    },
  ]
  // 处理项目等级  数字转文字显示
  function _projectLevel2Word(level) {
    switch (level) {
      case 0:
        return "P0";
      case 1:
        return "P1";
      case 2:
        return "P2";
      case 3:
        return "P3";
      case 4:
        return "P4";
      case 5:
        return "P5";
    }
  }
  // 处理项目等级  文字显示转数字
  function _projectLevel2Number(level) {
    switch (level) {
      case "P0":
        return 0;
      case "P1":
        return 1;
      case "P2":
        return 2;
      case "P3":
        return 3;
      case "P4":
        return 4;
      case "P5":
        return 5;
    }
  }
module.exports = {
    _projectStatus,
    _projectStatus2Word,
    _projectStatus2Number,
    _projectLevel,
    _projectLevel2Word,
    _projectLevel2Number
}