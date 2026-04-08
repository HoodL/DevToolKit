<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  NCard, NInput, NSlider, NSelect, NButton, NSpace, NColorPicker,
  NGrid, NGi, NText, NDivider
} from 'naive-ui'
import QRCode from 'qrcode'

const text = ref('https://')
const size = ref(256)
const errorCorrection = ref('M')
const fgColor = ref('#000000')
const bgColor = ref('#FFFFFF')
const qrDataUrl = ref('')
const history = ref<{ text: string; time: string }[]>([])

const defaults = {
  text: 'https://',
  size: 256,
  errorCorrection: 'M',
  fgColor: '#000000',
  bgColor: '#FFFFFF'
}

const errorLevelOptions = [
  { label: '低 (L)', value: 'L' },
  { label: '中 (M)', value: 'M' },
  { label: '较高 (Q)', value: 'Q' },
  { label: '高 (H)', value: 'H' }
]

function resetSettings() {
  text.value = defaults.text
  size.value = defaults.size
  errorCorrection.value = defaults.errorCorrection
  fgColor.value = defaults.fgColor
  bgColor.value = defaults.bgColor
}

async function generateQR() {
  if (!text.value.trim()) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: errorCorrection.value as any,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      }
    })
  } catch (e) {
    console.error(e)
    qrDataUrl.value = ''
  }
}

function downloadPNG() {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  link.href = qrDataUrl.value
  link.download = `qrcode_${Date.now()}.png`
  link.click()
  saveHistory()
}

async function downloadSVG() {
  if (!text.value.trim()) return
  const svgString = await QRCode.toString(text.value, {
    type: 'svg',
    width: size.value,
    margin: 2,
    errorCorrectionLevel: errorCorrection.value as any,
    color: {
      dark: fgColor.value,
      light: bgColor.value
    }
  })
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `qrcode_${Date.now()}.svg`
  link.click()
  URL.revokeObjectURL(url)
  saveHistory()
}

function saveHistory() {
  const item = { text: text.value, time: new Date().toLocaleString() }
  const list = [item, ...history.value.filter((h) => h.text !== text.value)].slice(0, 20)
  history.value = list
  localStorage.setItem('qr-history', JSON.stringify(list))
}

function loadHistory() {
  try {
    const saved = localStorage.getItem('qr-history')
    if (saved) history.value = JSON.parse(saved)
  } catch {}
}

function useHistory(item: { text: string }) {
  text.value = item.text
}

watch([text, size, errorCorrection, fgColor, bgColor], () => {
  generateQR()
})

onMounted(() => {
  loadHistory()
  generateQR()
})
</script>

<template>
  <div class="qr-code">
    <h2 class="page-title">二维码生成</h2>

    <NGrid :cols="2" :x-gap="24">
      <NGi>
        <NCard title="输入内容">
          <NInput
            v-model:value="text"
            type="textarea"
            placeholder="输入文本或 URL"
            :rows="4"
          />
        </NCard>

        <NCard title="参数设置" style="margin-top: 16px">
          <NSpace vertical :size="16">
            <div>
              <NText>尺寸：{{ size }}px</NText>
              <NSlider v-model:value="size" :min="128" :max="1024" :step="32" />
            </div>
            <div>
              <NText>纠错等级</NText>
              <NSelect v-model:value="errorCorrection" :options="errorLevelOptions" />
            </div>
            <div>
              <NText>前景色</NText>
              <NColorPicker v-model:value="fgColor" :modes="['hex']" :show-alpha="false" />
            </div>
            <div>
              <NText>背景色</NText>
              <NColorPicker v-model:value="bgColor" :modes="['hex']" :show-alpha="false" />
            </div>
          </NSpace>
        </NCard>

        <NSpace style="margin-top: 16px">
          <NButton type="primary" @click="downloadPNG" :disabled="!qrDataUrl">
            下载 PNG
          </NButton>
          <NButton @click="downloadSVG" :disabled="!text.trim()">
            下载 SVG
          </NButton>
          <NButton @click="resetSettings">
            重置参数
          </NButton>
        </NSpace>
      </NGi>

      <NGi>
        <NCard title="预览">
          <div class="qr-preview">
            <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" />
            <NText v-else depth="3">请输入内容生成二维码</NText>
          </div>
        </NCard>

        <NCard title="历史记录" style="margin-top: 16px" v-if="history.length > 0">
          <div class="history-list">
            <div
              v-for="(item, index) in history.slice(0, 10)"
              :key="index"
              class="history-item"
              @click="useHistory(item)"
            >
              <NText class="history-text">{{ item.text }}</NText>
              <NText depth="3" style="font-size: 12px">{{ item.time }}</NText>
            </div>
          </div>
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
.qr-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.qr-preview img {
  max-width: 100%;
  image-rendering: pixelated;
}
.history-list {
  max-height: 300px;
  overflow-y: auto;
}
.history-item {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.history-item:hover {
  background: rgba(0, 0, 0, 0.04);
}
.history-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}
</style>
