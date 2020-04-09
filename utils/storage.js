
// 获取token缓存
export const getToken = () => {
    const TOKEN = wx.getStorageSync('TOKEN')
    if(TOKEN) {
        return TOKEN
    }
}

// 读取用户id 缓存
export const getUserId = () => {
    const USER_ID = wx.getStorageSync('USER_ID');
    if(USER_ID) {
        return USER_ID
    }
}

// 设置token缓存
export const setToken = val => {
    wx.setStorageSync('TOKEN', val);
}

// 设置用户id 缓存
export const setUserId = id => {
    wx.setStorageSync('USER_ID', id);
}