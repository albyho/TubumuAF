<template>
  <el-select
    v-model="currentValue"
    clearable
    placeholder="状态">
    <el-option
    v-for="item in userStatusData"
    :key="item.value"
    :label="item.label"
    :value="item.value" />
  </el-select>
</template>

<script>
export default {
  name: 'XLUserStatusSelect',
  props: {
    value: {
      type: String,
      default: 'Normal'
    }
  },
  data () {
    return {
      currentValue: this.value,
      userStatusData: [
        { label: '默认', value: 'Normal' },
        { label: '待审', value: 'PendingApproval' },
        { label: '删除', value: 'Removed' }
      ]
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
