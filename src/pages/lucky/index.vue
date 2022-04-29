<template lang="pug">
   .w-100
    nav-bar(:title="'幸运数'" :backVisible="true" :home-path="'/pages/index/main'")
    .w-100(v-if="islogin")
        van-collapse(v-model="active" @change='onChange')
          van-collapse-item(  title='双色球' name='1')
            .df-row-ac-jb
              van-button(round type="info" @click="random('1')" ) RANDOM
              | 点击一次产生一组幸运数字
            .df-row-ac-jb.mt-10p(v-for="(item,v) in domain" :key="v" )
              div(v-for="(val,i) in item" :key="i")
                van-tag(v-if="i!=6" type="success") {{val}}
                van-tag(v-else type="danger") {{val}}
              van-button(round  type="primary" size="mini" @click="buy('1',item)" ) BUY
          van-collapse-item(title='3D' name='2')
            .df-row-ac-jb
              van-button(round type="primary" @click="random('2')" ) RANDOM
              | 点击一次产生一组幸运数字
            .df-row-ac-jb.mt-10p(v-for="(item,v) in domain3D" :key="v" )
              div(v-for="(val,i) in item" :key="i")
                van-tag(v-if="i!=6" type="success") {{val}}
                van-tag(v-else type="danger") {{val}}
              van-button(round  type="primary" size="mini" @click="buy('2',item)" ) BUY
          van-collapse-item(title='七乐彩' name='3')
            .df-row-ac-jb
              van-button(round type="warning" @click="random('3')" ) RANDOM
              | 点击一次产生一组幸运数字
            .df-row-ac-jb.mt-10p(v-for="(item,v) in domainS" :key="v" )
              div(v-for="(val,i) in item" :key="i")
                van-tag(v-if="i!=6" type="success") {{val}}
                van-tag(v-else type="danger") {{val}}
              van-button(round  type="primary" size="mini" @click="buy('3',item)" ) BUY
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
        user: {},
        islogin: false,
        active: ['1'],
        domain: [],
        domainS: [],
        domain3D: []
      }
    },
    methods: {
      checkUser (e) {
        loginInfo(this.viewMyQueue)
      },
      viewMyQueue () {
        this.user = wx.getStorageSync('user')
        if (this.user) {
          this.islogin = true
        }
      },
      onChange (event) {
        this.active = event.mp.detail
      },
      buy (type, item) {
        console.log('type', type)
        console.log('item', item)
      },
      random (val) {
        const param =
            {
              user_id: this.user.id
            }
        switch (val) {
          case '1': {
            console.log('双色球')
            param.ty = '1'
            API.lucky.generateLuckyData(param).then((res) => {
              console.log(res.data)
              this.domain.push(res.data)
            }).catch((err) => {
              console.log('err', err)
            })
            break
          }
          case '2': {
            console.log('3D')
            param.ty = '2'
            API.lucky.generateLuckyData(param).then((res) => {
              console.log(res.data)
              this.domain3D.push(res.data)
            }).catch((err) => {
              console.log('err', err)
            })
            break
          }
          case '3': {
            console.log('七乐彩')
            param.ty = '3'
            API.lucky.generateLuckyData(param).then((res) => {
              console.log(res.data)
              this.domainS.push(res.data)
            }).catch((err) => {
              console.log('err', err)
            })
            break
          }
        }
      }

    },
    mounted () {
    },
    onShow () {
      this.islogin = false
      debugger
      this.user = wx.getStorageSync('user')
      if (this.user.id) {
        debugger
        this.islogin = true
      }
    }
  }
</script>

<style >
</style>
