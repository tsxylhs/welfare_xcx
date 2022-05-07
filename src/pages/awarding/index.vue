<template lang="pug">
   .w-100
    nav-bar(:title="'已兑奖'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100(v-if="islogin")
        van-collapse(v-model="active" @change='onChange')
          van-collapse-item( v-for="item in domain" :key="item.id" :title='item.lottery_name' :name='item.id' :value="item.prize_msg")
            .df-row-ac-jb
              p 查询期号 {{item.lottery_no}}
            .df-row-ac-jb.mt-10p
              p 查询号码 {{item.lottery_res}}
            .df-row-ac-jb.mt-10p
              p 中奖号码 {{item.real_lottery_res}}
            .df-row-ac-jb.mt-10p

    .w-100.mt-50p(v-else)
      .df-col-ac.p-20p
        .login-none
        .mt-10p(v-if="!user") 请先登录，以查看兑奖信息。
        button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录
    van-toast#van-toast
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
        user: {},
        islogin: false,
        active: ['1'],
        domain: [],
        filter: {ps: 10, p: 1}
      }
    },
    methods: {
        onChange (event) {
        this.active = event.mp.detail
      },
      checkUser (e) {
        loginInfo(this.viewMyQueue)
      },
      viewMyQueue () {
        this.user = wx.getStorageSync('user')
        if (this.user) {
          this.islogin = true
        }
      },
     onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      this.load()
      },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        this.filter.p = this.filter.p + 1
      }
    },
      load(){
        var params = {
          user_id: this.user.id
        }
        API.awarding.list(params).then((res) => {
          this.domain = res.data
        }).catch((err) => {
          console.log('error', err)
        })
      }
    },
    mounted () {
    },
    onShow () {
      this.islogin = false
      this.user = wx.getStorageSync('user')
      if (this.user.id) {
        this.islogin = true
        this. load()
      }
    }
  }
</script>

<style >
</style>
