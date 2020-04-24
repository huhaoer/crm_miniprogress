const cloudFunc  = require('../../api/index');
const regeneratorRuntime  = require('../../utils/runtime');//ES7 环境
import { getToken,getUserId } from "../../utils/storage";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: "", //手风琴页面默认显示的一条,数组形式
    active: "", //tab页面显示的选项页面 根据传递的name值判断显示哪一个页面
    // totalNameData: [],//项目总金额列表数据
    // willPayNameData: [],//暂未回款金额列表数据
    // waitPayNameData: [],//待回款金额列表数据
    projectNameData: [],//我的项目列表数据
    contractNameData: [],//我的合同列表数据

    disableStyle: 'background:#108ee9;color:#fff',// 禁用样式
    activeStyle: 'color:#333',
    normalStyle: '',// 禁用样式

    searchVal: '',//项目输入框的关键字
    searchValContract: '',//合同输入框的关键字
  },
  // 1.折叠面板方法
  onChangeColl(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  // 2.tab切换方法
  onChangeTab(event) {
    console.log(event);
    // 切换tab页时 先返回顶部
    wx.pageScrollTo({
      scrollTop: 0
    });

    // 改变时先切换到加载状态和修改当前激活的name
    this.setData({
      active: event.detail.name
    });

    console.log(this.data.active,'当前选择的tab')
    this.getCheckedTab(this.data.active);// 调用switch case方法  获取当前改变的tab选项的数据
  },

  // 3.返回顶部
  handleTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }
  },
  // 4.点击跳转到项目详情
  handleToItemdetail(e) {
    const proid = e.currentTarget.dataset.proid;//获取当前点击的项目id
    const proname = e.currentTarget.dataset.proname;//获取当前点击的项目名字
    wx.navigateTo({
      url: '/pages/itemDetail/itemDetail?proid=' + proid + '&proname=' + proname
    });
  },
  // 5.点击按钮添加项目
  addItem() {
    wx.navigateTo({
      url: '/pages/addItem/addItem'
    });
  },
  // 6.点击跳转到合同详情
  handleToContractdetail(e) {
    const conid = e.currentTarget.dataset.conid;//点击每个合同获取的合同id
    // 点击每一个合同跳转到合同详情
    wx.navigateTo({
      url: '/pages/contractDetail/contractDetail?conid=' + conid 
    });
  },
  // 7.点击按钮添加合同
  addContract() {
    console.log("添加合同")
    wx.navigateTo({
      url: '/pages/addContract/addContract'
    });
  },

  // 项目搜索框====================================================
  handleSearchChange(e) {
    const nowWord = e.detail;//当前改变的输入框文字
    this.setData({
      searchVal: e.detail
    })
    // 文字改变为空时 即删除关键字搜索 获取最初的列表数据
    !nowWord && this.getOwnProjectList();
  },
  handleSearchClear(e) {
    this.setData({
      searchVal: ''
    })
  },
  handleSearchOn(e) {
    const keyWord = e.detail;//输入框点击搜索时的关键字
    this.setData({
      searchVal: keyWord
    })
    // 有关键字时  发送请求
    keyWord && this.getProjectByLike(keyWord);
  },

  // 合同搜索框======================================================
  contractSearchChange(e) {
    const nowWord = e.detail;//当前改变的输入框文字
    this.setData({
      searchValContract: e.detail
      // fuzzySearchContract
    })
    // 文字改变为空时 即删除关键字搜索 获取最初的列表数据
    !nowWord && this.getOwnContractList();
  },
  contractSearchClear() {
    this.setData({
      searchValContract: ''
    })
  },
  contractSearchOn(e) {
    const keyWord = e.detail;//输入框点击搜索时的关键字
    this.setData({
      searchValContract: keyWord
    })
    // 有关键字时  发送请求
    keyWord && this.fuzzySearchContract(keyWord);
  },


  // 6.switch case选择当前tab选项获取数据
  getCheckedTab(tabName) {
    // 数据请求
    switch (tabName) {
      // case 'total':
      //   // 请求total数据
      //   break;
      // case 'hasPay':
      //   // 请求willPay数据
      //   break;
      // case 'noPay':
      //   // 请求waitPay数据
      //   break;
      case 'project':
        // 请求project数据
        this.getOwnProjectList();
        break;
      case 'contract':
        // 请求contract数据
        this.getOwnContractList();
        break;
    }
  },
  // 7.点击项目添加进收藏 主页显示
  async addCollect(item) {
    const Token = getToken();
    const UserId = getUserId();//缓存中读取用户id
    console.log(item,'收藏了')
    const ProjectCode = item.currentTarget.dataset.item.ProjectCode;//点击按钮时 传递的项目id
    const AttentionId = item.currentTarget.dataset.item.AttentionId;//点击按钮时 传递的收藏项目AttentionId
    const isCollected = item.currentTarget.dataset.item.AttentionId !== 0;//不为0就是已经收藏    判断是否收藏
    console.log(ProjectCode,isCollected)
    // 已经收藏了 ****
    if(isCollected) {
      try {
        let res = await cloudFunc('deleteAttention',{
          Token,
          AttentionId
        })
        console.log(res,'取消收藏======================')
        if(res.result === "1") {//取消收藏成功
          this.getOwnProjectList();
          wx.showToast({
            title: '取消收藏',
            icon: 'none',
            duration: 1000,
            mask: true,
          });
        }
        console.log(res,'取消收藏')
      } catch (error) {
        console.log(error,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    }else {//没有收藏
      try {
        let res = await cloudFunc('addAttentionProject',{
          Token,
          UserId,
          ProjectCode
        })
        console.log(res,'原始结果')
        if(res.result.toString().length > 0) {//添加完成返回的不是对象
          this.getOwnProjectList();
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      } catch (error) {
        console.log(error,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    }
    this.setData({
      searchVal: '',//点击收藏或取消收藏后  取消关键字
    })
  },
  // 生命周期函数  ==  获取我的项目
  async getOwnProjectList() {
    try {
      const that = this;
      const Token = getToken();
      const UserId = getUserId();//缓存中读取用户id
      const Option = 0;//Option为0获取全部项目列表信息  加上attention
      let res = await cloudFunc('getOwnProjectList',{
        Token,
        UserId,
        Option
      })
      // console.log(res,'转换前的结果','xxxxxxxxxxxxxxx')
      let result = res.result && JSON.parse(res.result);//转换为JSON
      console.log(result,'转换后的结果','xxxxxxxxxxxxxxxxx8888888888888')
      const newRes = result.filter(item => item.ProjectCode);//处理过滤有项目id的数据
      console.log(newRes,'...')
      // 判断状态的内部函数
      function _transformStatus (status) {
        switch (status) {
          case 0:
            return '状态未知';
          case 1:
            return '进行中';
          case 2:
            return '完成';
        }
      }
      newRes.length > 0 && newRes.forEach(item => {
        item.ProjectCreateTime = item.ProjectCreateTime && item.ProjectCreateTime.split('T')[0].replace(/\-/g,".")
        item.ProjectStatus =  _transformStatus(item.ProjectStatus)
      })
      // console.log(newRes,'...？？？')
      that.setData({
        projectNameData: newRes,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },

  // 生命周期函数  ==  获取我的合同
  async getOwnContractList() {
    try {
      const that = this;
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
      console.log(res,'show my contract list string','String????????????????')
      let result = res.result && JSON.parse(res.result);//转换为JSON
      // 处理时间 
      result._Items.length > 0 && result._Items.forEach(item => {
        item.ContractCreateTime = item.ContractCreateTime && item.ContractCreateTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractEndTime = item.ContractEndTime && item.ContractEndTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractAmount = item.ContractAmount && (+item.ContractAmount).toLocaleString();//处理总金额
        item.ContractAlreadyRec = item.ContractAlreadyRec && (+item.ContractAlreadyRec).toLocaleString();//处理已收金额

        // 处理发票 JSON
        item.InvoiceList = item.InvoiceList && JSON.parse(item.InvoiceList);
        // 处理阶段 JSON
        item.phaseList = item.phaseList && JSON.parse(item.phaseList);
        // 处理收款 JSON
        item.ReceivableList = item.ReceivableList && JSON.parse(item.ReceivableList);
      })
      console.log(result,'show data with handle') 
      that.setData({
        contractNameData: result,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },

  // 点击搜索模糊查询项目
  async getProjectByLike(kw) {
    try {
      const that = this;
      const Token = getToken();
      const Option = 0;
      const Skip = 0;
      const Size = -1;
      let res = await cloudFunc('getProjectByLike',{
        StrField: kw,
        Token,
        Option,
        Skip,
        Size
      })
      console.log(res,'11111111111111111111111111111')
      let result = res.result && JSON.parse(res.result);//转换为JSON
      console.log(result,'resultresultresultresult')
      // 处理时间 
      result._Items && result._Items.length > 0 && result._Items.forEach(item => {
        // 处理时间
        item.ProjectCreateTime = item.ProjectCreateTime && item.ProjectCreateTime.split('T')[0].replace(/\-/g,".")
        // 处理总金额
        // item.ContractTotal = item.ContractTotal.toLocaleString()
        // 处理已收金额
        // item.ReceiveTotal = item.ContractTotal.toLocaleString()
      })
      // console.log(result,'show data with handle')
      that.setData({
        projectNameData: result._Items,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },

  // 点合同搜索模糊查询
  async fuzzySearchContract(kw) {
    const that = this;

    try {
      const token = getToken();
      // const token = "c5MZKBH42dpB2FA3D3D";//模糊查询接口的token
      const Option = 2;
      const SearchCondition = kw;
      let res = await cloudFunc('fuzzySearchContract',{
        token,
        SearchCondition,
        Option,
      })
      let result = res.result && JSON.parse(res.result);//转换为JSON
      // 处理时间 
      result._Items.length > 0 && result._Items.forEach(item => {
        item.ContractCreateTime = item.ContractCreateTime && item.ContractCreateTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractEndTime = item.ContractEndTime && item.ContractEndTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractAmount = item.ContractAmount && (+item.ContractAmount).toLocaleString();//处理总金额
        item.ContractAlreadyRec = item.ContractAlreadyRec && (+item.ContractAlreadyRec).toLocaleString();//处理已收金额
      })
      that.setData({
        contractNameData: result,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const name = options.name || "project"; //获取跳转页面传递的tab页name名 默认为project
    console.log(name);
    this.setData({
      active: name,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCheckedTab(this.data.active);//传入初始化加载的那个tab页面的name值，请求数据
    this.setData({
      searchVal: '',//再次进入页面时  取消关键字搜索
      searchValContract: ''
    })
  },


  // 获取滚动条当前位置
  onPageScroll: function(e) {
    // 判断回到顶部按钮是显示还是隐藏
    if (e.scrollTop > 150) {
      this.setData({
        showScroll: true
      });
    } else {
      this.setData({
        showScroll: false
      });
    }
  }
});
