<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NInput, NButton, NSpace, NText, NRadioGroup, NRadioButton, NGrid, NGi } from 'naive-ui'

type Mode = 'b64-encode' | 'b64-decode' | 'unicode-encode' | 'unicode-decode'

const mode = ref<Mode>('b64-encode')
const inputText = ref('')
const errorMsg = ref('')

const result = computed(() => {
  errorMsg.value = ''
  if (!inputText.value) return ''
  try {
    switch (mode.value) {
      case 'b64-encode':
        return btoa(unescape(encodeURIComponent(inputText.value)))
      case 'b64-decode':
        return decodeURIComponent(escape(atob(inputText.value)))
      case 'unicode-encode':
        return [...inputText.value]
          .map((c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
          .join('')
      case 'unicode-decode':
        return inputText.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, p) =>
          String.fromCharCode(parseInt(p, 16))
        )
    }
  } catch (e: any) {
    errorMsg.value = '转换失败：' + (e.message || '无法解析')
    return ''
  }
})

function swapInputOutput() {
  inputText.value = result.value
}

function copyResult() {
  if (!result.value) return
  navigator.clipboard.writeText(result.value)
}

function clearAll() {
  inputText.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="encode-convert">
    <h2 class="page-title">编码转换</h2>

    <NCard>
      <NSpace vertical :size="16">
        <NRadioGroup v-model:value="mode" name="modeGroup">
          <NSpace>
            <NRadioButton value="b64-encode">Base64 编码</NRadioButton>
            <NRadioButton value="b64-decode">Base64 解码</NRadioButton>
            <NRadioButton value="unicode-encode">Unicode 编码</NRadioButton>
            <NRadioButton value="unicode-decode">Unicode 解码</NRadioButton>
          </NSpace>
        </NRadioGroup>

        <NGrid :cols="2" :x-gap="24">
          <NGi>
            <NText depth="3" style="margin-bottom: 6px; display: block">输入</NText>
            <NInput
              v-model:value="inputText"
              type="textarea"
              placeholder="输入要转换的内容..."
              :rows="12"
              style="font-family: monospace"
            />
          </NGi>
          <NGi>
            <NText depth="3" style="margin-bottom: 6px; display: block">输出</NText>
            <NInput
              :value="result"
              type="textarea"
              placeholder="转换结果"
              :rows="12"
              readonly
              style="font-family: monospace"
            />
          </NGi>
        </NGrid>

        <NText v-if="errorMsg" type="error">{{ errorMsg }}</NText>

        <NSpace>
          <NButton type="primary" @click="copyResult" :disabled="!result">复制结果</NButton>
          <NButton @click="swapInputOutput" :disabled="!result">结果作为输入</NButton>
          <NButton @click="clearAll">清空</NButton>
        </NSpace>
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
