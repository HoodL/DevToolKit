<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NCard, NInput, NButton, NSpace, NText, NRadioGroup, NRadioButton, NGrid, NGi } from 'naive-ui'

type InputMode = 'seconds' | 'milliseconds'
const inputValue = ref('')
const inputMode = ref<InputMode>('seconds')
const errorMsg = ref('')

const result = computed(() => {
  errorMsg.value = ''
  const raw = inputValue.value.trim()
  if (!raw) return ''
  const num = Number(raw)
  if (isNaN(num)) {
    errorMsg.value = '请输入有效的数字'
    return ''
  }
  const ms = inputMode.value === 'seconds' ? num * 1000 : num
  const d = new Date(ms)
  if (isNaN(d.getTime())) {
    errorMsg.value = '时间戳超出范围'
    return ''
  }
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const currentTimestamp = ref('')
const currentMs = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function now() {
  const ms = Date.now()
  currentMs.value = String(ms)
  currentTimestamp.value = String(Math.floor(ms / 1000))
}

function copyTimestamp() {
  if (!currentTimestamp.value) return
  navigator.clipboard.writeText(currentTimestamp.value)
}

function copyMs() {
  if (!currentMs.value) return
  navigator.clipboard.writeText(currentMs.value)
}

function copyResult() {
  if (!result.value) return
  navigator.clipboard.writeText(result.value)
}

function fillNow() {
  inputValue.value = currentTimestamp.value
}

onMounted(() => {
  now()
  timer = setInterval(now, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="timestamp">
    <h2 class="page-title">时间戳转换</h2>

    <NGrid :cols="2" :x-gap="24">
      <NGi>
        <NCard title="当前时间戳">
          <div class="now-panel">
            <div class="now-row">
              <NText>秒级：</NText>
              <NText strong style="font-size: 20px; font-family: monospace">{{ currentTimestamp }}</NText>
              <NButton size="small" @click="copyTimestamp">复制</NButton>
            </div>
            <div class="now-row">
              <NText>毫秒级：</NText>
              <NText strong style="font-size: 20px; font-family: monospace">{{ currentMs }}</NText>
              <NButton size="small" @click="copyMs">复制</NButton>
            </div>
          </div>
        </NCard>

        <NCard title="时间戳转日期" style="margin-top: 16px">
          <NSpace vertical :size="12">
            <NRadioGroup v-model:value="inputMode" name="inputMode">
              <NSpace>
                <NRadioButton value="seconds">秒级</NRadioButton>
                <NRadioButton value="milliseconds">毫秒级</NRadioButton>
              </NSpace>
            </NRadioGroup>
            <NInput
              v-model:value="inputValue"
              placeholder="输入时间戳，如 1712505600"
              style="font-family: monospace"
            >
              <template #suffix>
                <NButton size="tiny" @click="fillNow">当前</NButton>
              </template>
            </NInput>
            <NText v-if="result" strong style="font-size: 16px; font-family: monospace">
              {{ result }}
            </NText>
            <NText v-if="errorMsg" type="error">{{ errorMsg }}</NText>
            <NButton @click="copyResult" :disabled="!result">复制结果</NButton>
          </NSpace>
        </NCard>
      </NGi>

      <NGi>
        <NCard title="说明">
          <NSpace vertical :size="8">
            <NText>
              <strong>时间戳</strong>：从 1970-01-01 00:00:00（UTC）到某个时刻经过的秒数/毫秒数
            </NText>
            <NText depth="3">
              北京时间 = UTC + 8 小时<br />
              转换结果默认显示北京时间
            </NText>
            <NText depth="3">
              例：<br />
              秒级 1712505600 → 2024-04-08 00:00:00<br />
              毫秒级 1712505600000 → 2024-04-08 00:00:00
            </NText>
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
.now-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.now-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
