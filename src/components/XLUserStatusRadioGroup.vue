<template>
  <el-radio-group v-model="currentValue">
    <el-radio
      v-for="item in userStatusData"
      :key="item.value"
      :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'XLUserStatusRadioGroup',
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
