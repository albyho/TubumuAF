<template>
  <el-radio-group v-model="currentValue">
    <el-radio
      v-for="item in genderData"
      :key="item.value"
      :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'XLGenderRadioGroup',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      currentValue: this.value,
      genderData: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
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
