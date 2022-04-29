<template lang="pug">
  .w-100
    nav-bar(:title="'我的'")
    .w-100
      .p-20p
        .df-row-ac.py-3
          img.wh-50p(style="border-radius:50px" :src="user.avatarUrl" )
          .ml-10p.df-row-jb.flex-1
            div
              .df-row-ac
                .pf-title {{user.nickName}}
                .border.px-10p.py-5p.ml-10p.text-dark.fs-12( v-if="disable" plain size="mini" @click="toInf") 修改
              button.btn-main(v-if="!user" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" lang="zh_CN" type="primary" round @click="bindGetUserInfo") 微信授权登录
        .shadow.borRadius-5.p-20p.mt-20p
          .df-row-ac-jb
            .pf-subhead 我的开奖
            .df-row-ac
              .text-red.pointer(@click="toOrder(0)")  全部
              .red-arrow
          .df-row-jb.mt-10p
            .df-col-ac.pointer(@click="scanQrCode")
              .order5
              .text-dark.mt-2 扫码兑奖
      .pl-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toinfom")
          .df-row-ac
            .delivery
            span.ml-10p.fs-16 修改个人信息
          .arrow.pr-20p
      .pl-20p
        .df-row-ac-jb.py-20p.border-bottom(@click="toAbout")
          .df-row-ac
            .info
            span.ml-10p.fs-16 关于小程序
          .arrow.pr-20p
    van-toast#van-toast
</template>
<script>
import NavBar from '@/components/NavBar.vue'
import {loginInfo, CallPhone} from '../../utils/login'
import Toast from '../../../static/vant/toast/toast'
import API from '../../api/api'

export default {
  name: 'AlarmInfo',
  components: {
    NavBar
  },
  onShareAppMessage (object) {
    object.title = '在线Elb'
    object.path = '/pages/index/main'
    object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
    return object
  },
  data () {
    return {

      disable: false,
      user: {},
      sharePop: false,
      shopId: '',
      userId: '',
      shop: {},
      imageurl: '',
      canvasDialog: false
    }
  },
  methods: {
    bindGetUserInfo () {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      let code = ''
      wx.login({
        success: (res) => {
          code = res.code
        }
      })
      // 获取用户信息
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '用户登录',
        success: (res) => {
          let loginParams = {
            code: code,
            encryptedData: res.encryptedData,
            iv: res.iv,
            rawData: res.rawData,
            signature: res.signature
          }
          API.login(loginParams).then((res) => {
            this.user = res
            wx.setStorageSync('user', res)
          }).catch((err) => {
            console.log(err)
          })
        },
        // 失败回调
        fail: () => {
          // 弹出错误
          App.showError('已拒绝小程序获取信息')
        }
      })
    },
    saveImage () {
      // debugger
      var that = this
      that.canvasDialog = false
      wx.saveImageToPhotosAlbum({
        filePath: that.imageurl,
        success (res) {
          wx.showModal({
            content: '图片已保存到相册',
            showCancel: false,
            confirmText: '好的',
            success: function (res) {
              if (res.confirm) {
                console.log('用户确定了')
              }
            }
          })
        }
      })
    },
    shareImage () {
      let url = '/pages/restaurantCard/main'
      wx.navigateTo({
        url: url
      })
    },
    shareQrcode () {
      let url = '/pages/shareCard/main?shopId=' + this.shopId
      wx.navigateTo({
        url: url
      })
    },
    shareDialog () {
      this.sharePop = true
    },
    onClose (item) {
      if (item === 'sharePop') {
        this.sharePop = false
      } else if (item === 'canvasDialog') {
        this.canvasDialog = false
      }
    },
    callPhone () {
      let params = {
        phone: this.shop.bdMobile,
        callSuccess: this.callSuccess,
        callFail: this.callFail,
        completeSuccess: this.completeSuccess
      }
      CallPhone(params)
    },
    callSuccess (e) {
    },
    callFail (e) {

    },
    scanQrCode () {
      wx.scanCode({
        success (res) {
          console.log(res.result)
          Toast(res.result + '门已开锁，请取走你的物品')
        }
      })
    },
    completeSuccess (e) {
    },
    checkUser (e) {
      loginInfo(e, this, this.getMessage)
    },
    getMessage () {
    },
    toRestaurant () {
      if (!this.disable) {
        return
      }
      if ((!this.shop.name) || (!this.shopId && this.shopId + '' === '0')) {
        wx.navigateTo({
          url: '/pages/restaurantForm/main'
        })
      } else {
        wx.navigateTo({
          url: '/pages/restaurant/main?showEdit=' + true + '&showNotice=' + false
        })
      }
    },
    popClose () {
      this.show = false
    },
    submit () {
      this.show = true
    },
    toOrder (item) {
      getApp().globalData.tabIndex = item
      wx.switchTab({
        url: '/pages/mybook/main'
      })
    },
    toinfom () {
      wx.navigateTo({
        url: '/pages/infForm/main?userId=' + this.user.id
      })
    },
    toFeedBack () {
      wx.navigateTo({
        url: 'FeedBack'
      })
    },
    toAbout () {
      wx.navigateTo({
        url: '/pages/about/main'
      })
    }
  },
  // mounted () {
  //   let user = wx.getStorageSync('user')
  //   this.user = user
  //   if (user) {
  //     this.loadUser()
  //   }
  //   // this.shopId = wx.getStorageSync('shopId')
  //   this.getMessage()
  // },
  onLoad () {
    this.shopId = wx.getStorageSync('shopId')
    this.getMessage()
    console.log('检查登录态')
    let user = wx.getStorageSync('user')
    this.user = user
    // if (user) {
    //   this.loadUser()
    //   return
    // }
    // wx.navigateTo({
    //   url: '/pages/login/main'
    // })
  },
  onShow () {
    this.shopId = wx.getStorageSync('shopId')
    this.getMessage()
    let user = wx.getStorageSync('user')
    if (user) {
      this.disable = true
    }
    this.user = user
  }
}
</script>
<style scoped>
</style>
