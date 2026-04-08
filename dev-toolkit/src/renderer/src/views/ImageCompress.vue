<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton, NSlider, NCard, NUpload,
  NUploadDragger, NIcon, NText, NP, NGrid, NGi, NImage
} from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'
import imageCompression from 'browser-image-compression'
import type { UploadFileInfo } from 'naive-ui'

interface ImageItem {
  file: File
  originalUrl: string
  compressedUrl?: string
  originalSize: number
  compressedSize?: number
  compressing: boolean
  quality: number
}

const quality = ref(80)
const images = ref<ImageItem[]>([])
const compressing = ref(false)
const uploadFiles = ref<UploadFileInfo[]>([])

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function handleFileChange(options: { fileList: UploadFileInfo[] }) {
  const validFiles = options.fileList.filter(
    (f) => f.file && f.file.type.startsWith('image/')
  )
  for (const f of validFiles) {
    if (!f.file) continue
    const url = URL.createObjectURL(f.file)
    images.value.push({
      file: f.file,
      originalUrl: url,
      originalSize: f.file.size,
      compressing: false,
      quality: quality.value
    })
  }
}

async function compressImage(file: File, q: number, maxSizeMB: number): Promise<{ url: string; size: number }> {
  const compressed = await imageCompression(file, {
    maxSizeMB,
    initialQuality: q / 100,
    useWebWorker: true
  })
  const url = URL.createObjectURL(compressed)
  return { url, size: compressed.size }
}

async function compressAll() {
  compressing.value = true
  for (const item of images.value) {
    if (item.compressedUrl) continue
    item.compressing = true
    try {
      const maxSizeMB = item.originalSize / (1024 * 1024) * (item.quality / 100)
      const result = await compressImage(item.file, item.quality, Math.max(maxSizeMB, 0.1))
      item.compressedUrl = result.url
      item.compressedSize = result.size
    } catch (e: any) {
      console.error('Compress error:', e)
    } finally {
      item.compressing = false
    }
  }
  compressing.value = false
}

function downloadImage(item: ImageItem) {
  if (!item.compressedUrl) return
  const ext = item.file.name.split('.').pop() || 'jpg'
  const link = document.createElement('a')
  link.href = item.compressedUrl
  link.download = `compressed_${item.file.name.replace(/\.[^.]+$/, '')}.${ext}`
  link.click()
}

async function downloadAll() {
  for (const item of images.value) {
    if (item.compressedUrl) downloadImage(item)
  }
}

function clearAll() {
  for (const item of images.value) {
    URL.revokeObjectURL(item.originalUrl)
  }
  images.value = []
  uploadFiles.value = []
}
</script>

<template>
  <div class="image-compress">
    <h2 class="page-title">图片压缩</h2>

    <NCard class="settings-card">
      <div>
        <NText>压缩质量：{{ quality }}%</NText>
        <NSlider v-model:value="quality" :min="10" :max="100" :step="5" />
      </div>
    </NCard>

    <NCard style="margin-top: 16px">
      <NUpload
        v-model:file-list="uploadFiles"
        :max="20"
        accept="image/*"
        :show-file-list="false"
        @change="handleFileChange"
        multiple
        directory-dnd
      >
        <NUploadDragger style="padding: 40px">
          <div style="margin-bottom: 12px">
            <NIcon size="48" :depth="3">
              <CloudUploadOutline />
            </NIcon>
          </div>
          <NText style="font-size: 16px">点击或拖拽图片到此处</NText>
          <NP depth="3" style="margin: 8px 0 0 0">
            支持 JPG / PNG / WebP，最多 20 张
          </NP>
        </NUploadDragger>
      </NUpload>
    </NCard>

    <NSpace style="margin-top: 16px" v-if="images.length > 0">
      <NButton type="primary" @click="compressAll" :loading="compressing">
        开始压缩
      </NButton>
      <NButton @click="downloadAll" :disabled="!images.some(i => i.compressedUrl)">
        全部下载
      </NButton>
      <NButton @click="clearAll">清空</NButton>
    </NSpace>

    <div class="image-list" v-if="images.length > 0">
      <NCard v-for="(item, index) in images" :key="index" class="image-item">
        <NGrid :cols="2" :x-gap="16">
          <NGi>
            <div class="image-box">
              <NText strong>原始图片</NText>
              <NImage :src="item.originalUrl" object-fit="contain" style="max-height: 200px" />
              <NText depth="3">{{ formatSize(item.originalSize) }}</NText>
            </div>
          </NGi>
          <NGi>
            <div class="image-box">
              <NText strong>压缩后</NText>
              <template v-if="item.compressing">
                <NText depth="3">压缩中...</NText>
              </template>
              <template v-else-if="item.compressedUrl">
                <NImage :src="item.compressedUrl" object-fit="contain" style="max-height: 200px" />
                <NSpace align="center" justify="center">
                  <NText depth="3">{{ formatSize(item.compressedSize!) }}</NText>
                  <NText type="success" v-if="item.originalSize && item.compressedSize">
                    -{{ Math.round((1 - item.compressedSize / item.originalSize) * 100) }}%
                  </NText>
                  <NButton size="small" type="primary" @click="downloadImage(item)">
                    下载
                  </NButton>
                </NSpace>
              </template>
              <template v-else>
                <NText depth="3">等待压缩</NText>
              </template>
            </div>
          </NGi>
        </NGrid>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
.settings-card {
  max-width: 600px;
}
.image-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.image-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}
.image-box :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
