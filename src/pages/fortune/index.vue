<template lang="pug">
.w-100
  nav-bar(:title="'我的运势'" :back-visible="true" :home-path="'/pages/index/main'")
  .mt-20p.df-col-ac-jc
      flex

</van-grid>

</template>

<script>
  import API from '@/api/api'
  import NavBar from '@/components/NavBar.vue'

  export default {
    name: 'InfForm',
    components: {
      NavBar
    },
    data () {
      return {
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2019, 10, 1).getTime(),
        currentDate: new Date().getTime(),
        timeshow: false,
        show: false,
        resType: false,
        apply: {},
        addapplyFlag: false,
        user: {},
        showCode: false,
        domain: {},
        userId: '',
        item: {},
        columns: [],
        image: ''
      }
    },
    methods: {
      cancelTime () {
        this.timeshow = false
      },
      timeS (event) {
        this.timeshow = false
        var currentDate = event.mp.detail.value
        this.apply.time = currentDate
      },
      chooseT () {
        this.timeshow = true
      },
      onClose () {
        this.timeshow = false
        this.show = false
      },
      choose (val) {
        this.resType = true
        this.show = true
      },
      onConfirm (event) {
        this.timeshow = false
        this.show = false
        this.resType = false
        console.log(event.mp.detail.value)
      },
      TonConfirm (event) {
        this.timeshow = false
        this.show = false
        this.resType = false
        console.log(event.mp.detail.value)
        this.apply.site = event.mp.detail.value
      },
      onCancel () {
        this.resType = false
        this.show = false
        // Toast('取消')
      },
      ShowCodes (item) {
        this.showCode = true
      },

      handlenum (event) {
        this.apply.num = event.mp.detail
      },
      handlename (event) {
        this.apply.name = event.mp.detail
      },
      applyClose () {
        this.showCode = false
        this.addapplyFlag = false
      },
      toapply (item) {
        this.item = item
        var params = {
          id: item.id
        }
        API.table.list(params).then((res) => {
          console.log(res)
          this.addapplyFlag = true
          if (res.data.length <= 0) {
            this.columns = ['位置已满']
          } else {
            res.data.forEach((r) => {
              console.log(r)
              this.columns = []
              if (r.status === '1') {
                this.columns.push(r.location + ':' + r.name)
              }
            })
          }
        }).catch(() => {
        })
      },
      submint () {
        this.apply.libraryId = this.item.id
        this.apply.userId = this.user.id
        API.apply.create(this.apply).then((res) => {
          console.log('ok')
          this.addapplyFlag = false
        }).catch(() => {
          this.addapplyFlag = false
        })
      },
      getlibrarys () {
        API.books.applylibrary(this.user.id).then((res) => {
          this.domain = res.data
        }).catch(() => {
        })
      }
    },
    mounted () {
      this.getlibrarys()
    },
    onShow () {
      this.image = '../../static/images/show.png'
      this.user = wx.getStorageSync('user')
      this.getlibrarys()
    }
  }
</script>

<style scoped>

</style>
