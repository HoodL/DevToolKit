<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { NCard, NGrid, NGi, NText, NIcon } from 'naive-ui'
import { GlobeOutline } from '@vicons/ionicons5'

interface Timezone {
  label: string
  zone: string
}

const cities: Timezone[] = [
  { label: '🇨🇳 北京', zone: 'Asia/Shanghai' },
  { label: '🇭🇰 香港', zone: 'Asia/Hong_Kong' },
  { label: '🇹🇼 台北', zone: 'Asia/Taipei' },
  { label: '🇯🇵 东京', zone: 'Asia/Tokyo' },
  { label: '🇰🇷 首尔', zone: 'Asia/Seoul' },
  { label: '🇸🇬 新加坡', zone: 'Asia/Singapore' },
  { label: '🇮🇳 孟买', zone: 'Asia/Kolkata' },
  { label: '🇩🇪 柏林', zone: 'Europe/Berlin' },
  { label: '🇬🇧 伦敦', zone: 'Europe/London' },
  { label: '🇫🇷 巴黎', zone: 'Europe/Paris' },
  { label: '🇷🇺 莫斯科', zone: 'Europe/Moscow' },
  { label: '🇦🇪 迪拜', zone: 'Asia/Dubai' },
  { label: '🇺🇸 纽约', zone: 'America/New_York' },
  { label: '🇺🇸 洛杉矶', zone: 'America/Los_Angeles' },
  { label: '🇨🇦 多伦多', zone: 'America/Toronto' },
  { label: '🇦🇺 悉尼', zone: 'Australia/Sydney' },
  { label: '🇧🇷 圣保罗', zone: 'America/Sao_Paulo' },
  { label: '🇿🇦 开普敦', zone: 'Africa/Johannesburg' }
]

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

function getTimeForZone(zone: string): { date: string; time: string; day: string } {
  const d = new Date(now.value.toLocaleString('en-US', { timeZone: zone }))
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    day: dayNames[d.getDay()]
  }
}

function isTodayMidnight(zone: string): boolean {
  const d = new Date(now.value.toLocaleString('en-US', { timeZone: zone }))
  return d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="world-time">
    <h2 class="page-title">世界时间</h2>
    <NGrid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
      <NGi v-for="city in cities" :key="city.zone">
        <NCard>
          <div class="city-card">
            <div class="city-flag">{{ city.label }}</div>
            <div class="city-time">{{ getTimeForZone(city.zone).time }}</div>
            <div class="city-date">
              {{ getTimeForZone(city.zone).day }}
              {{ getTimeForZone(city.zone).date }}
            </div>
            <div v-if="isTodayMidnight(city.zone)" class="midnight-tip">午夜</div>
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
.city-card {
  text-align: center;
}
.city-flag {
  font-size: 14px;
  margin-bottom: 8px;
}
.city-time {
  font-size: 28px;
  font-weight: 700;
  font-family: 'SF Mono', 'Consolas', monospace;
  letter-spacing: 2px;
}
.city-date {
  font-size: 12px;
  color: var(--n-text-color-3, #999);
  margin-top: 4px;
}
.midnight-tip {
  margin-top: 4px;
  font-size: 11px;
  color: #f0a020;
}
</style>
