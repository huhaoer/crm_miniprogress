const cloudFunc = require("../../api/index");
import parseTime from '../../utils/parseTime';
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
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
    contract_name_val:'',//合同名称  需要校验
    contract_item_val:'',//所属项目  需要校验
    contract_item_id:'',//项目对应的id
    contract_item_arr: [],//要展示的选择项目的列表
    contract_id_val:'',//合同编号   
    contract_parent_val:'',//父合同编号名称   
    contract_parent_id:'',//父合同编号code   
    contract_parent_arr:'',//父合同列表选择数据  
    contract_kind_val: '',//合同类型
    contract_kind_id: '',//合同类型对应的字段id
    contract_kind_arr: [//动态获取的项目类型数组列表 
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
    contract_price_val: '',//合同金额
    contract_start_val: '',//合同开始时间
    contract_stop_val: '',//合同结束时间
    contract_remark_val: '',//合同备注

    is_show_item: false,//是否展示弹出选择项目
    is_show_type: false,//是否展示弹出合同分类
    is_show_start: false,//是否展示选择开始时间
    is_show_stop: false,//是否展示选择结束时间
    is_show_parent: false,//是否展示选择父合同

    columns: [],//选择的显示的项目列表  
    loading: true,//是否为加载状态

    columns2: [],//父合同列表
    loading2: true,


    // 阶段信息
    parseList: [{
      parse_desc: '',//阶段描述
      parse_type: null,//阶段类型
      parse_total: null,//阶段总金额
      parse_time: '',//阶段计划时间
      now_showType_index: '',//当前点击的类型阶段显示哪一个
      now_showTime_index: '',//当前点击的时间显示哪一个
    }],//阶段信息的列表
    /**
     * {
      parse_desc: '',//阶段描述
      parse_type: null,//阶段类型
      parse_total: null,//阶段总金额
      parse_time: '',//阶段计划时间
      now_showType_index: '',//当前点击的类型阶段显示哪一个
      now_showTime_index: '',//当前点击的时间显示哪一个
    }
     */

    parse_type_arr: [{
      name: '类型一',
      id: 1
    },{
      name: '类型二',
      id: 2
    },{
      name: '类型三',
      id: 3
    },{
      name: '类型四',
      id: 4
    }],//阶段类型的列表 原生数据
    parse_type_arrShow: [],//展示的类型数组
    parse_type_id: '',//选中类型对应上传服务器的字段id

  },

/*************************点击弹出菜单**********************/
  // 1.点击选择弹出项目分类菜单
  async showItemMenu() {
    this.setData({
      is_show_item: true,
      loading: true
    })

    let res = await this.getItemsList();//获取要选择的项目
    let result = res.result && JSON.parse(res.result);
    // 处理数据
    result.length > 0 && result.forEach(item => {
      item.name = item.ProjectName;
      item.code = item.ProjectCode
    })
    const columnsData = result.map(item => item.name)
    this.setData({
      columns: columnsData,
      contract_item_arr: result,//设置该值 便于下面选择根据索引查询用户id
      loading: false//取消加载
    })
  },
  // 2.点击关闭项目选择
  cancelItemMenu(e) {
    this.setData({
      is_show_item: false
    })
  },
  // 3.点击选中某一个项目
  confirmItemMenu(e) {
    console.log(e,'当前选择的项目')
    const proName = e.detail.value;//点击的项目名字
    const index = e.detail.index;//点击项目的索引值
    const proId = this.data.contract_item_arr[index].ProjectCode;//根据索引获取项目id
    this.setData({
      contract_item_val: proName,
      contract_item_id: proId,
      is_show_item: false
    })
  },
  // 4.点击展示合同分类的菜单
  showTypeMenu() {
    this.setData({
      is_show_type: true
    })
  },
  // 5.点击关闭合同分类的菜单
  closeTypeMenu() {
    this.setData({
      is_show_type: false
    })
  },
  // 6.点击选中某一个合同分类
  selectTypeMenu(e) {
    const name = e.detail.name;
    const type = e.detail.type;
    this.setData({
      contract_kind_val: name,//选择的合同类型
      contract_kind_id: type//选择的合同类型对应的字段id
    })
  },

  // 7.点击弹出选择开始时间
  showStartMenu() {
    this.setData({
      is_show_start: true
    })
  },
  // 8.点击确定按钮
  confirmStart(e) {
    // 处理为Date 格式
    const t = parseTime(e.detail/1000);
    // const newTime = `${t} 00:00:00`;
    this.setData({
      contract_start_val: t,
      is_show_start: false
    })
  },
  // 9.点击取消按钮
  cancelStart() {
    this.setData({
      is_show_start: false
    })
  },
  // 10.点击弹出选择开始时间
  showStopMenu() {
    this.setData({
      is_show_stop: true
    })
  },
  // 11.点击确定按钮
  confirmStop(e) {
    // 处理为Date 格式
    const t = parseTime(e.detail/1000);
    // const newTime = `${t} 00:00:00`;
    this.setData({
      contract_stop_val: t,
      is_show_stop: false
    })
  },
  // 12.点击取消按钮
  cancelStop() {
    this.setData({
      is_show_stop: false
    })
  },
  // 13.点击弹出选择父合同编号
  async showParentMenu() {
    
    this.setData({
      is_show_parent: true,
      loading2: true
    })
    let res = await this.getParentLists();//获取要选择的父合同
    let result = res.result && JSON.parse(res.result);//转换为JSON
    // 处理数据 获取合同名和合同code
    let newArr = result._Items && result._Items.length > 0 && result._Items.map(item => {
      return {
        name: item.ContractName,
        code: item.ContractCode
      }
    })
    const columns2Data = newArr.map(item => item.name);//处理渲染的列表
    this.setData({
      contract_parent_arr: newArr,//设置返回渲染的数据
      columns2: columns2Data,
      loading2: false
    })
  },
  // 14.关闭选择父合同
  cancelParentMenu() {
    this.setData({
      is_show_parent: false
    })
  },
  // 15.点击选择一个父合同
  confirmParentMenu(e) {
    //将当前的选择合同的id  赋值
    const parentName = e.detail.value;//点击的项目名字
    const index = e.detail.index;//点击项目的索引值
    const parentId = this.data.contract_parent_arr[index].code;//根据索引获取项目id
    this.setData({
      contract_parent_val: parentName,
      contract_parent_id: parentId,
      is_show_parent: false
    })
  },

  /******************输入事件监听****************/
  // 合同名称监听输入事件
  contractNameInp(e) {
    this.setData({
      contract_name_val: e.detail
    })
  },
  // 合同编号输入监听
  contractIdInp(e) {
    this.setData({
      contract_id_val: e.detail
    })
  },
  // 合同金额输入监听
  contractPriceInp(e) {
    this.setData({
      contract_price_val: e.detail
    })
  },
  // 合同备注输入监听
  contractRemarkInp(e) {
    this.setData({
      contract_remark_val: e.detail
    })
  },

  // ================阶段描述信息===============
  // 阶段描述的输入事件
  onParseDesc(e) {
    console.log(e,'输入的阶段描述')
    // 解构出当前阶段描述信息   添加的遍历索引值  遍历的field类型名称  和detail具体值
    const { currentTarget: { dataset: { field, index } }, detail} = e;
    console.log(field,index,detail)
    let { parseList } = this.data;
    parseList[index][field] = detail;//使用每一项修改时身上的标记索引和field字段 标记哪一项 然后修改对应的数据  最后赋值修改data
    this.setData({
      parseList
    })
  },

  // ==================阶段类型信息===============
  // 是否展开阶段类型
  onParseType(e) {
    console.log(e,'点击的类型 第几个')
    const nowShow = e.currentTarget.dataset.showindex;
    const newTypeArr = this.data.parse_type_arr.map(item => item.name)
    const { parseList } = this.data;
    parseList[nowShow].now_showType_index = true;
    this.setData({
      parse_type_arrShow: newTypeArr,
      parseList
    })
  },
  // 取消选择阶段类型
  cancelParseType(e) {
    console.log(e,'取消选择的个数000000000')
    const nowHide = e.currentTarget.dataset.index;
    const { parseList } = this.data;
    parseList[nowHide].now_showType_index = false;
    this.setData({
      parseList,
    })
  },
  // 选择了某一个阶段类型
  confirmParseType(e) {
    const that = this;
    const { value, index:oIndex } = e.detail;//解构出picker选择的value和对应的index
    const { dataset: { field, index } } = e.currentTarget
    // 给当前展示的选中值赋值
    let { parseList } = this.data;
    parseList[index][field] = value;//给当前的值赋值
    parseList[index].now_showType_index = false;//选择当前的时间那一项 隐藏
    this.setData({
      parseList,
      parse_type_id: that.data.parse_type_arr[oIndex].id
    })
  },

  // =================阶段总金额输入=================
  // 总金额输入
  onParseTotal(e) {
    console.log(e,'输入的总金额')
    // 解构出当前阶段描述信息   添加的遍历索引值  遍历的field类型名称  和detail具体值
    const { currentTarget: { dataset: { field, index } }, detail} = e;
    console.log(field,index,detail)
    let { parseList } = this.data;
    parseList[index][field] = detail;//使用每一项修改时身上的标记索引和field字段 标记哪一项 然后修改对应的数据  最后赋值修改data
    this.setData({
      parseList
    })
  },

  // ================计划时间选择==============
  // 展开选择时间
  onParseTime(e) {
    const nowShow = e.currentTarget.dataset.showindex;
    const { parseList } = this.data;
    parseList[nowShow].now_showTime_index = true;
    this.setData({
      parseList,
    })
  },
  // 取消选择时间
  cancelParseTime() {
    const nowHide = e.currentTarget.dataset.index;
    const { parseList } = this.data;
    parseList[nowHide].now_showTime_index = false;
    this.setData({
      parseList,
    })
  },
  // 点击选择某一个时间
  confirmParseTime(e) {
    const that = this;
    const oTime = parseTime(e.detail / 1000);
    const { dataset: { field, index } } = e.currentTarget
    // 给当前展示的选中值赋值
    let { parseList } = this.data;
    parseList[index][field] = oTime;//给当前的值赋值
    parseList[index].now_showTime_index = false;//当前选择了时间 就隐藏
    this.setData({
      parseList,
    })
  },
  // ==============点击按钮添加一个阶段==================
  addOneParse() {
    let { parseList } = this.data
    parseList.push({
      parse_desc: '',//阶段描述
      parse_type: null,//阶段类型
      parse_total: null,//阶段总金额
      parse_time: ''//阶段计划时间
    })
    this.setData({
      parseList
    })
  },

  // ==============点击按钮删除当前填写的阶段==========
  cancelOneParse(e) {
    console.log(e,'当前删除阶段的index =================')
    const index = e.currentTarget.dataset.index;//当前要删除的阶段的索引
    const { parseList } = this.data;
    parseList.splice(index,1);
    this.setData({
      parseList
    })
  },
 
  // ===============检查阶段信息================
  async addPhaseBatch() {
    const that = this;
    function _transformType (type) {
      switch (type) {
        case "类型一":
          return 1;
        case "类型二":
          return 2;
        case "类型三":
          return 3;
        case "类型四":
          return 4;
      }
    }
    console.log(this.data.parseList,'阶段信息')
    const newParseList = this.data.parseList.length > 0 && this.data.parseList.map(item => {
      return {
        PhaseDescribe: item.parse_desc,
        PhaseType: item.parse_type && _transformType(item.parse_type),
        PhaseAmount: item.parse_total && parseInt(item.parse_total),
        PlanTime: item.parse_time && item.parse_time.replace(/\./g,'-') + " 00:00:00"
      }
    })
    console.log(newParseList,'newParseList')
    let PhaseStr = {};//PhaseStr字段对应的对象数据
    for (let i = 0; i < newParseList.length; i++) {
      PhaseStr[i] = newParseList[i]
    }
    console.log(PhaseStr,'PhaseStrPhaseStrPhaseStrPhaseStr')
    try {
      const token = getToken();//获取Token
      const ContractCode = that.data.contract_id_val;//合同编号id
      let res = await cloudFunc("addPhaseBatch", {
        token,
        ContractCode,
        PhaseStr: JSON.stringify(PhaseStr),
      });
      console.log(res,'添加阶段信息的结果')

      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000,
        mask: true
      });
      // 返回上一页
      setTimeout(_ => {
        wx.navigateBack();
      },1000)

    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },
  
/******************点击提交按钮*******************/
  // 提交项目表单
  handleSubmit() {
    // 校验 合同名不能为空
    if(!this.data.contract_name_val) {
      wx.showToast({
        title: '合同名不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目不能为空
    if(!this.data.contract_item_val) {
      wx.showToast({
        title: '项目不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同编号不能为空
    if(!this.data.contract_id_val) {
      wx.showToast({
        title: '合同编号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同分类不能为空
    if(!this.data.contract_kind_id) {
      wx.showToast({
        title: '合同分类不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同金额不能为空
    if(!this.data.contract_price_val) {
      wx.showToast({
        title: '合同金额不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 签订时间不能为空
    if(!this.data.contract_start_val) {
      wx.showToast({
        title: '签订时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 到期时间不能为空
    if(!this.data.contract_stop_val) {
      wx.showToast({
        title: '到期时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    
    if(this.data.parseList.length > 0) {
      for (const parse of this.data.parseList) {
        console.log(parse,'parse===================')
        if(!parse.parse_total || !parse.parse_desc || !parse.parse_type || !parse.parse_time) {
          wx.showToast({
            title: '阶段信息错误',
            icon: 'none',
            duration: 1000,
            mask: true
          });
          return
        }
      }
    }

    // 发送的数据
    let sendData = {
      ContractName: this.data.contract_name_val,
      ProjectCode: this.data.contract_item_id,
      ContractCode: this.data.contract_id_val,
      ContractType: this.data.contract_kind_id,
      ContractAmount: parseInt(this.data.contract_price_val),
      ContractSignTime: `${this.data.contract_start_val} 00:00:00`,//处理为后端的Date格式
      ContractEndTime: `${this.data.contract_stop_val} 00:00:00`,
      ContractRemark: this.data.contract_remark_val,
      ContractParentCode: this.data.contract_parent_id,//父合同的id
    }
    // 添加合同接口
    this.addContract(sendData);

    // 添加阶段接口
    this.addPhaseBatch();
  },
  // 点击按钮 - 添加合同
  async addContract(data) {
    try {
      const that = this;
      const token = getToken();//获取Token
      let res = await cloudFunc("addContract", {
        token,
        ...data
      });
      // console.log(res,'添加合同的结构？？？？？？？？？？？')
      // if(res.result.toString().length > 0) {
      //   wx.showToast({
      //     title: '添加成功',
      //     icon: 'success',
      //     duration: 1000,
      //     mask: true
      //   });
      // }
      // // 返回上一页
      // setTimeout(_ => {
      //   wx.navigateBack();
      // },1000)
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  // 获取项目列表
  async getItemsList() {
    const that = this;
    try {
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
    that.setData({
      loading: false,
      is_show_item: false
    })
  },

  // 获取选择的父合同列表
  async getParentLists() {
    const that = this;
    try {
      const token = getToken();
      const Option = 0;
      const skipNum = 0;
      const sizeNum = 100;//默认为翻页查询100条合同  合同数量不可能为100
      let res = await cloudFunc('getOwnContractList',{
        token,
        Option,
        skipNum,
        sizeNum
      })
      return res
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
    that.setData({
      loading2: false,
      is_show_parent: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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