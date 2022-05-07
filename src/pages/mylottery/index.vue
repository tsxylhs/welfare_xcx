<template lang="pug">
  .w-100
    nav-bar(title="我的彩票" :backVisible="true" :home-path="'/pages/index/main'")
    .p-10p

      .mt-20p.df-col-ac-jc(v-if="domain.length === 0&&user")
        span 暂未购买彩票
        span
      .first-padding
        .d-flex.p-20p.border-bottom.pa( v-if="domain.length !== 0" v-for="(item, index) in domain" :key="index" )
          //img( :src="item.cover.prefixUri + item.cover.relativePath" style="width:60px;height:60px")
          //img(:src="item.book.image" style="width:60px;height:60px")
          .df-col-jb.flex-1.ml-20p
            .df-row-jb
              .fs-16.flex-1(style="font-weight:bold") {{item.type_name}}
              .fs-12.flex-1 {{item.lucky_data}}
            .df-row-jb.mt-10p.text-dark
              .fs-14.flex-1.text-overflow2 购买日期： {{item.crt}}
              .fs-14.ml-10p(v-if="item.winning_amount!=-1" style="color:#0066CC" @click="checkLuckyData(item)") 对奖
              .fs-14.ml-10p(v-else style="color:#0066CC" @click="checked(item)") 已兑奖
      .w-100.mt-50p(v-if="!user")
        .df-col-ac.p-20p
          .login-none
          .mt-10p 请先登录，以查看购彩记录。
          button.btn-main.mt-10p(v-if="!user" open-type="getUserInfo" @getuserinfo="checkUser" lang="zh_CN" type="primary" round @click="checkUser") 微信授权登录

    van-dialog(use-slot title="请输入期号" :show="show"  show-cancel-button confirm-button-open-type="checkLucky" @close="onClose" @confirm="checkLucky" width="680px")
      van-field(v-model="value" placeholder="请输入期号" @change="handleValue")
    van-toast#van-toast
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Swiper from '@/components/swiper'
  import Data from '@/utils/data'
  import API from '@/api/api'
  import {loginInfo} from '../../utils/login'
  // import {loginInfo} from '../../utils/login'

  export default {
    components: {
      NavBar,
      Swiper
    },
    onShareAppMessage (object) {
      object.title = 'welfare'
      object.path = '/pages/index/main'
      object.imageUrl = 'https://mtms.letsit.vip/share.jpg'
      return object
    },
    data () {
      return {
        value:'',
        show:false,
        user: {},
        lnglat: {},
        searchKey: '',
        id: '0',
        isActive: 0,
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
        shopId: '0',
        filter: {ps: 10, p: 1},
        total: 0,
        itemVal: {}
      }
    },
    methods: {
      handleValue (e){
       this.value = e.mp.detail
      },
      checkLucky (){
        this.show=false
        console.log('check')
        console.log('val'+this.value)
        console.log('item'+this.itemVal.id)
        const param={
          issue: this.value,
          lucky_data_id: this.itemVal.id
        }
        API.lucky.checkLucky(param).then((res)=>{
          wx.showToast({
              title:'已兑奖',
              icon: 'success',
              duration: 1000
                              })
        }).catch((err)=>{
          wx.showToast({
              title:'兑奖失败',
              icon: 'error',
              duration: 1000
                              })

        })
      },
      onClose (){
        console.log('close')
        this.show = false
      },
      checkUser (e) {
        loginInfo(e, this, this.getluckyData)
      },
      checked(){
        wx.showToast({
              title:'已兑奖',
              icon: 'success',
              duration: 1000
                              })
      },
      checkLuckyData (item) {
        this.show = true
        this.itemVal=item
        console.log('兑奖')

        // API.lucky.checkLucky(item.id).then((res) => {
        //   console.log(res)
        // }).catch(() => {
        // })
      },
      changeRange (e) {
        this.domain = []
        this.val1 = e.mp.detail
        this.checkLocation()
      },
      getluckyData () {
        var params = {
          user_id: this.user.id
        }
        API.lucky.list(params).then((res) => {
          this.domain = res.data
        }).catch((err) => {
          console.log('error', err)
        })
      },

    },
    onPullDownRefresh () {
      console.log('下拉刷新')
      // 初始化页码
      this.filter.p = 1
      this.checkLocation()
    },
    onReachBottom () {
      if (this.filter.p > this.total) {
        console.log('上拉数据加载完了')
      } else {
        this.filter.p = this.filter.p + 1
      }
    },
    mounted () {
    },
    onShow () {
      this.filter = {ps: 10, p: 1}
      this.total = 0
      this.val1 = -1
      this.domain = []
      this.user = wx.getStorageSync('user')
      console.log('this.user', this.user)
      this.getluckyData()
      // 解决之前登录的用户没有session_key的问题
    }
  }
</script>

<style>
</style>
