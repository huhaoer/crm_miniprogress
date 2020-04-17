const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
import parseTime from '../../utils/parseTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 时间选择器
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(),
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`;
        }
        return value;
      },
      token: '', 
      ContractCode: '',
      // ContractNewCode: '',//新合同编号
      ContractEffectTime: '',
      ContractNoEffectTime: '',
      ContractName: '',
      ContractType: '',
      ContractTypeMap: '',//合同类型对应的映射显示名字
      PartyA: '',
      PartyB: '',
      PartyC: '',
      ContractAmount: '',
      ContractParentCode: '',
      ContractSignTime: '',
      ContractEndTime: '',
      ContractRemark: '',
      ProjectCode: '',
      ProjectCodeMap: '',//项目code对应映射名字

      is_show_type: false,//是否显示合同分类菜单
      contract_kind_arr: [//合同分类列表
        {
          name: '种类一',
          type: 1
        },
        {
          name: '种类二',
          type: 2
        },
        {
          name: '种类三',
          type: 3
        },
        {
          name: '种类四',
          type: 4
        },
      ],

      is_show_item: false,//是否显示项目选择的菜单
      contract_item_arr: [],//项目选择的列表

      is_show_start: false,//是否显示选择开始时间

      is_show_stop: false,//是否显示选择结束时间
  },
  // 输入===========================监听
  // onNameInp
  onNameInp(e) {
    const ContractName = e.detail;
    this.setData({
      ContractName
    })
  },
  // onContractIdInp
  onContractIdInp(e) {
    const ContractCode = e.detail;
    this.setData({
      ContractCode
    })
  },
  // onRemarkInp
  onRemarkInp(e) {
    const ContractRemark = e.detail;
    this.setData({
      ContractRemark
    })
  },
  // onJIAInp
  onJIAInp(e) {
    const PartyA = e.detail;
    this.setData({
      PartyA,
    })
  },
  // onYIInp
  onYIInp(e) {
    const PartyB = e.detail;
    this.setData({
      PartyB
    })
  },
  // onBINGInp
  onBINGInp(e) {
    const PartyC = e.detail;
    this.setData({
      PartyC
    })
  },
  // onTotalInp
  onTotalInp(e) {
    if(this.data.ContractAmount.includes('￥')) {
      this.data.ContractAmount = '';//先清空 避免其余字符串
    }
    const ContractAmount = e.detail
    this.setData({
      ContractAmount,
    })
  },
  // onNewContractIdInp
  // onNewContractIdInp(e) {
  //   const ContractNewCode = e.detail;
  //   this.setData({
  //     ContractNewCode
  //   })
  // },


  // 显示==================================菜单
  // 点击合同分类
  showTypeMenu() {
    this.setData({
      is_show_type: true
    })
  },
  closeTypeMenu() {
    this.setData({
      is_show_type: false
    })
  },
  selectTypeMenu(e) {
    const ContractTypeMap = e.detail.name;
    const ContractType = e.detail.type;
    this.setData({
      ContractType,
      ContractTypeMap
      
    })
  },

  // 点击项目类
  async showItemMenu() {
    this.setData({
      is_show_item: true
    })
    let res = await this.getItemsList();//获取要选择的项目
    let result = res.result && JSON.parse(res.result);
    // 处理数据
    result.length > 0 && result.forEach(item => {
      item.name = item.ProjectName;
      item.code = item.ProjectCode
    })
    this.setData({
      contract_item_arr: result
    })
  },
  closeItemMenu() {
    this.setData({
      is_show_item: false
    })
  },
  selectItemMenu(e) {
    const ProjectCode = e.detail.code
    const ProjectCodeMap = e.detail.name
    this.setData({
      ProjectCode,
      ProjectCodeMap
    })
  },

  //点击开始时间
  showStartMenu() {
    this.setData({
      is_show_start: true
    })
  },
  confirmStart(e) {
    const t = parseTime(e.detail / 1000);
    this.setData({
      ContractSignTime: t,
      is_show_start: false
    })
  },
  cancelStart() {
    this.setData({
      is_show_start: false
    })
  },

  // 点击结束时间
  showstopMenu() {
    this.setData({
      is_show_stop: true
    })
  },
  confirmStop(e) {
    const t = parseTime(e.detail / 1000);
    this.setData({
      ContractEndTime: t,
      is_show_stop: false
    })
  },
  cancelStop() {
    this.setData({
      is_show_stop: false
    })
  },
  // 点击===================================提交信息表单
  handleSubmit() {
    // 判断是否为空
    if( !this.data.ContractName 
      || !this.data.ContractCode 
      || !this.data.ContractType 
      || !this.data.ProjectCode 
      || !this.data.ContractAmount 
      || !this.data.ContractSignTime 
      || !this.data.ContractEndTime
      ) {
      wx.showToast({
        title: '填写错误',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    const subData = {
      ContractName: this.data.ContractName,
      ContractCode: this.data.ContractCode,
      ContractRemark: this.data.ContractRemark,
      ContractType: this.data.ContractType,
      ProjectCode: this.data.ProjectCode,
      PartyA: this.data.PartyA,
      PartyB: this.data.PartyB,
      PartyC: this.data.PartyC,
      ContractAmount: this.data.ContractAmount.replace(',','').replace('￥',''),
      ContractSignTime: this.data.ContractSignTime.replace(/\./g,'-') + ' 00:00:00',
      ContractEndTime: this.data.ContractEndTime.replace(/\./g,'-') + ' 00:00:00',
      ContractEffectTime: '',
      ContractNoEffectTime: '',
      // ContractNewCode: this.data.ContractNewCode
    }
    console.log(subData)
    // 调用更新接口
    this.updateContract(subData);
  },
  // 请求===================================异步请求
  // 获取选择的项目菜单
  async getItemsList() {
    try {
      const that = this;
      const Token = getToken();//获取Token
      const UserId = getUserId(); //缓存中读取用户id
      const Option = 1; 
      let res = await cloudFunc("getOwnProjectList", {
        Token,
        UserId,
        Option
      });
      return res
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '获取失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  // 提交信息修改表单
  async updateContract(subData) {
    const that = this;
    try {
      const token = getToken();
      let res = await cloudFunc("updateContract", {
        token,
        ...subData,
      });
      console.log(res,'oppppppppppppppppppppppppppppppppppppppppppppppppp???????')
      // let result = JSON.parse(res.result); //转换为JSON
      if(res.result === '0') {
        wx.showToast({
          title: "新合同编号不存在",
          icon: "none",
          duration: 1000,
          mask: true,
        });
        wx.stopPullDownRefresh(); //下拉刷新成功
      }else {
        wx.showToast({
          title: "更新成功",
          icon: "none",
          duration: 1000,
          mask: true,
        });
        wx.stopPullDownRefresh(); //下拉刷新成功
      }
    } catch (error) {
      console.log(error, "错误");
      wx.showToast({
        title: "请求错误",
        icon: "none",
        duration: 1000,
        mask: true,
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const contractData = JSON.parse(options.contractData);
    console.log(contractData,'...........')
    this.setData({
      ContractName: contractData.ContractName,
      ContractCode: contractData.ContractCode,
      ContractRemark: contractData.ContractRemark,
      ContractType: contractData.ContractType,
      ContractTypeMap: `类型${contractData.ContractType}`,
      ProjectCode: contractData.ProjectCode,
      ProjectCodeMap: contractData.ProjectName,
      PartyA: contractData.PartyA,
      PartyB: contractData.PartyB,
      PartyC: contractData.PartyC,
      ContractAmount: contractData.ContractAmount,
      ContractSignTime: contractData.ContractSignTime,
      ContractEndTime: contractData.ContractEndTime,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})