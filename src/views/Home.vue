<template>
  <div class="home">
    首页
  </div>
</template>
<script>
import { GetUserList } from '@/api'
export default {
  data () {
    return {}
  },
  mounted () {
    GetUserList({ pagenum: 1, pagesize: 10 }).then(res => {
      console.log(res)
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
