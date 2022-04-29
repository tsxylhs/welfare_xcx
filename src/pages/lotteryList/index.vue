<template lang="pug">
  .w-100
    nav-bar(:title="'开奖中'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100(v-if="isLogged")
      .p-20p.df-col-ac-jc.mt-50p(v-if="queues.length <= 0 || queues == undefined")
        .queue-none
        .pf-subhead.mt-10p 您当前暂无开奖信息
        .mt-10p.w-80
          van-button(size="large" round custom-class="btn-minEdit" @click="toLineUpShop") 查看历史开奖信息
    .w-100.mt-50p(v-else)
      .df-col-ac.p-20p
        .login-none
        .mt-10p(v-if="!user") 请先登录，以查看开奖信息。
        button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar
    },
    data () {
      return {
        queues: [],
        showPop: false,
        order: {},
        isLogged: false,
        user: {},
        phoneNumber: '',
        filter: {ps: 10, p: 1},
        total: 0
      }
    },
    methods: {
      checkUser (e) {
        loginInfo(this.viewMyQueue)
      },
      toLineUpShop () {
        wx.navigateTo({
          url: '/pages/mybook/main'
        })
      },
      toShop (id) {
        wx.navigateTo({
          url: '/pages/appointment/main?shopId=' + id
        })
      },
      toShopDetail () {
        wx.navigateTo({
          url: '/pages/shopDetail/main'
        })
      },
      toOrder () {
        API.apply.delete(this.user.id).then((res) => {
          console.log(res)
        }).catch(() => {
        })
      },
      handleCancel (order) {
        this.order = order
        this.showPop = true
      },
      onClose () {
        this.showPop = false
      },
      viewMyQueue () {
        this.user = wx.getStorageSync('user')
        if (this.user) {
          this.isLogged = true
        }
        let param = {
          userId: this.user.id,
          IsQueue: true
        }
        param = Object.assign(this.filter, param)
        API.apply.list(param).then(res => {
          if (this.filter.p > 1) {
            this.queues.push(...res.data)
          } else {
            this.queues = res.data
          }
          // 总页数
          this.total = Math.ceil(res.page.cnt / res.page.ps)
          console.log('queueOrderList====>', this.queues)
        })
      }
    },
    onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      this.viewMyQueue()
    },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        // 下一页
        this.filter.p = this.filter.p + 1
        this.viewMyQueue()
      }
    },
    onShow () {
      this.filter = {ps: 10, p: 1}
      this.isLogged = false
      this.user = wx.getStorageSync('user')
      this.phoneNumber = wx.getStorageSync('phoneNumber')
      if (this.user.id !== '0') {
        this.viewMyQueue()
        this.isLogged = true
      }
    }
  }
</script>

<style>
</style>
