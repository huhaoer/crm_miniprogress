// components/backtop/backtop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    showScroll: false,//初始隐藏返回顶部
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回顶部
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
    }
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
