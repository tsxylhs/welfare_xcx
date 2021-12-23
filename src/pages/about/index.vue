<template lang="pug">
  .w-100
    nav-bar(:title="'关于小程序'" :backVisible="true" :home-path="'/pages/index/main'")
    .p-20p
      .text-indent 该是一个为彩民随机生成幸运数。记录彩民购彩小程序
</template>

<script>
  import NavBar from '@/components/NavBar.vue'

  export default {
    components: {
      NavBar
    },
    data () {
      return {
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>

<style >
</style>
