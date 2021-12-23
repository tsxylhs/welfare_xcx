<template lang="pug">
  .w-100
    nav-bar(:title="'ElB自助系统'")
    .bg-top.w-100.df-row-jc(style="position: relative")
      .bg-white.py-20p.w-90.border.borRadius-5.shadow.df-row-ac-jb.buttonBg(style="position: absolute;bottom:5%")
        .flex-1.df-col-ac.px-10p.border-right(@click="toLine")
          .icon-delivery
          .mt-10p.text-black 我的借阅
        .flex-1.df-col-ac.px-10p.border-right(@click="toLinelibrary")
          .icon-qrcode
          .mt-10p.text-black 二维码
        .flex-1.df-col-ac.px-10p.border-right(@click="toLineUp")
          .calendar
          .mt-10p.text-black 预约位置
        div.flex-1.df-col-ac(@click="toQueue")
          .df-col-ac.px-10p
            .order(style="position: relative")
              .bg-red.px-5p.text-white.borRadius-5.py-2p.text-center(style="position: absolute;right: -75%;top: -5px;width:15px" v-if="queueTotal && queueTotal > 0") {{queueTotal}}
            div.mt-5p.text-black 预约中
    .p-10p
      van-search(@search="search" placeholder="请输图书馆名称")
      div
        .df-row-ac-jb
          div
            .pf-subhead 附近图片书馆
          van-dropdown-menu.pr-10p(active-color='#FF7012')
            van-dropdown-item(v-model='val1', :options='option1' @change="changeRange" icon="")
      .mt-20p.df-col-ac-jc(v-if="domain.length === 0")
        span 暂无图书馆
        span 尝试扩大筛选距离?
      .first-padding
        .d-flex.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" @click="onChange(item)")
          //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
          img(:src="item.image" style="width:60px;height:60px")
          .df-col-jb.flex-1.ml-20p
            div.df-row-jb
              .fs-16.flex-1(style="font-weight:bold") {{item.name}}
            .df-row-jb.mt-10p.text-dark
              .fs-14.flex-1.text-overflow2 {{item.address}}
              .fs-14.ml-10p {{item.distanceDisplay }}
    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Swiper from '@/components/swiper'
  import Data from '@/utils/data'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar,
      Swiper
    },
    onShareAppMessage (object) {
      object.title = '在线ELB'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {
        queueTotal: '',
        user: {},
        val1: -1,
        queues: [],
        option1: [
          {text: '2公里内', value: 2000},
          {text: '5公里内', value: 5000},
          {text: '10公里内', value: 10000},
          {text: '50公里内', value: 50000},
          {text: '全部', value: -1}
        ],
        lnglat: {},
        searchKey: '',
        id: '0',
        isActive: 0,
        firstCagories: [],
        images: [
          {
            url: 'https://mtms.letsit.vip/bn1.png'
          },
          {
            url: 'https://mtms.letsit.vip/bn1.png'
          }
        ],
        domain: [],
        data: Data,
        shop: {
          name: '未选择图书馆'
        },
        shopId: '0',
        address: '',
        filter: {p: 1, ps: 10},
        total: 0
      }
    },
    methods: {
      toLinelibrary () {
        wx.navigateTo({
          url: '/pages/applyQrcode/main'
        })
      },
      getlibrarys () {
        API.library.list(this.filter).then((res) => {
          this.domain = res.data
        }).catch(() => {
        })
      },
      toLine () {
        wx.navigateTo({
          url: '/pages/mybook/main'
        })
      },
      toLineUp () {
        wx.switchTab({
          url: '/pages/queue/main'
        })
      },
      toQueue () {
        wx.navigateTo({
          url: '/pages/queueOrderList/main'
        })
      },
      checkUser (e) {
        let that = this
        loginInfo(e, this, function () {
          that.user = wx.getStorageSync('user')
          wx.setStorageSync('phoneNumber', that.user.mobile)
          API.order.queue({phoneNumber: that.user.mobile, IsQueue: true}).then(res => {
            console.log('我的所有预约', res)
            that.queues = res.data
            this.queueTotal = res.total
          })
        })
      },
      changeRange (e) {
        this.domain = []
        this.val1 = e.mp.detail
        this.checkLocation()
      },
      wxLocation (address, getshops) {
        wx.chooseLocation({
          success: function (res) {
            address = res
            wx.setStorageSync('address', res.address)
            getshops(res)
          },
          fail: function () {
            wx.getSetting({
              success: function (res) {
                var statu = res.authSetting
                if (!statu['scope.userLocation']) {
                  wx.showModal({
                    title: '是否授权当前位置',
                    content: '需要获取您的地理位置，请确认授权，否则将无法检索附近的图书馆',
                    success: function (tip) {
                      if (tip.confirm) {
                        wx.openSetting({
                          success: function (data) {
                            if (data.authSetting['scope.userLocation'] === true) {
                              wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 1000
                              })
                              // 授权成功之后，再调用chooseLocation选择地方
                              wx.chooseLocation({
                                success: function (res) {
                                  wx.setStorageSync('address', res)
                                  getshops(res)
                                }
                              })
                            } else {
                              wx.showToast({
                                title: '授权失败',
                                icon: 'success',
                                duration: 1000
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '调用授权窗口失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            })
          }
        })
      },
      onChange (item) {
        this.domain.forEach((shop) => {
          shop.check = 'false'
          if (item.id === shop.id) {
            shop.check = 'true'
            this.id = item.id
          }
        })
        wx.setStorageSync('libraryId', this.id)
        wx.navigateTo({
          url: '/pages/kind/main'
        })
      },
      checkLocation () {
        if (wx.getStorageSync('address') === '') {
          this.wxLocation(this.address, this.getshop)
        }
      },
      search (param) {
        this.searchKey = param.mp.detail
        this.getshop(this.lnglat, null)
      },
      getshop (lnglat, address) {
        if (lnglat.longitude && lnglat.latitude) {
          this.lnglat = lnglat
        } else {
          lnglat = this.lnglat
        }
        // let param = {
        //   lng: lnglat.longitude + '',
        //   Lat: lnglat.latitude + '',
        //   name: this.searchKey,
        //   dis: this.val1
        // }
        // param = Object.assign(this.filter, param)
        // API.wxshop.getShopListByLngLat(param).then((res) => {
        //   if (this.filter.p > 1) {
        //     this.domain.push(...res.data)
        //   } else {
        //     this.domain = res.data
        //   }
        //   console.log('this.domain-=======>', this.domain)
        //   // 总页数
        //   this.total = Math.ceil(res.page.cnt / res.page.ps)
        //   // this.domain = res.data
        //   for (let d of this.domain) {
        //     d.distanceDisplay = d.distance
        //     if (d.distance < 1000) {
        //       d.distanceDisplay = d.distance.toFixed(2) + '米'
        //     } else {
        //       let dis = d.distance / 1000
        //       d.distanceDisplay = dis.toFixed(2) + '公里'
        //     }
        //   }
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      toDetail (itemId) {
        wx.navigateTo({
          url: '/pages/productDetail/main?itemId=' + itemId
        })
      },
      toKind (item) {
        getApp().globalData.activeIndex = item
        wx.switchTab({
          url: '/pages/kind/main'
        })
      },
      loadData () {
        let filter = this.filter
        filter.shopId = this.shopId
        API.items.list(filter).then((res) => {
          wx.stopPullDownRefresh()
          if (this.filter.p > 1) {
            this.domain.push(...res.data)
          } else {
            this.domain = res.data
          }
          // 总页数
          this.total = Math.ceil(res.page.cnt / res.page.ps)
        }).catch(() => {
        })
      },
      toSelect (id, index) {
        this.isActive = index
      },
      changeTab (event) {
        this.active = event.mp.detail.index
      },

      handleCart (itemId) {
        wx.navigateTo({
          url: '/pages/productDetail/main?itemId=' + itemId + '&auto=true'
        })
      }
    },
    onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      // this.loadData()
      this.checkLocation()
    },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        // 下一页
        this.filter.p = this.filter.p + 1
        this.checkLocation()
      }
    },
    mounted () {
      this.address = wx.getStorageSync('address')
      this.getlibrarys()
    },
    onShow () {
      this.checkLocation()
    }
  }
</script>

<style>
</style>
