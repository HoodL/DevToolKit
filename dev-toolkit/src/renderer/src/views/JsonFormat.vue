<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NInput, NButton, NSpace, NText, NCode, NGrid, NGi } from 'naive-ui'

const inputText = ref('')
const errorMsg = ref('')
const formattedJson = ref('')

function format() {
  errorMsg.value = ''
  formattedJson.value = ''
  if (!inputText.value.trim()) {
    errorMsg.value = '请输入 JSON 内容'
    return
  }
  try {
    const parsed = JSON.parse(inputText.value)
    formattedJson.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    errorMsg.value = 'JSON 格式错误：' + (e.message || '解析失败')
  }
}

function minify() {
  errorMsg.value = ''
  formattedJson.value = ''
  if (!inputText.value.trim()) {
    errorMsg.value = '请输入 JSON 内容'
    return
  }
  try {
    const parsed = JSON.parse(inputText.value)
    formattedJson.value = JSON.stringify(parsed)
  } catch (e: any) {
    errorMsg.value = 'JSON 格式错误：' + (e.message || '解析失败')
  }
}

function copyResult() {
  if (!formattedJson.value) return
  navigator.clipboard.writeText(formattedJson.value)
}

function clearAll() {
  inputText.value = ''
  formattedJson.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="json-format">
    <h2 class="page-title">JSON 格式化</h2>

    <NGrid :cols="2" :x-gap="24">
      <NGi>
        <NCard title="输入">
          <NInput
            v-model:value="inputText"
            type="textarea"
            placeholder="粘贴 JSON 内容..."
            :rows="18"
            style="font-family: monospace"
          />
          <NSpace style="margin-top: 12px">
            <NButton type="primary" @click="format">格式化</NButton>
            <NButton @click="minify">压缩</NButton>
            <NButton @click="clearAll">清空</NButton>
          </NSpace>
          <NText v-if="errorMsg" type="error" style="margin-top: 8px; display: block">
            {{ errorMsg }}
          </NText>
        </NCard>
      </NGi>

      <NGi>
        <NCard title="输出">
          <NInput
            v-model:value="formattedJson"
            type="textarea"
            placeholder="格式化结果"
            :rows="18"
            readonly
            style="font-family: monospace"
          />
          <NSpace style="margin-top: 12px">
            <NButton @click="copyResult" :disabled="!formattedJson">复制结果</NButton>
          </NSpace>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
