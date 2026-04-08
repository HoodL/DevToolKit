<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NSelect, NGrid, NGi, NText, NIcon, NSpin, NInput, NButton, NSpace } from 'naive-ui'

interface City {
  label: string
  value: string
  locationId: string
}

const CITIES: City[] = [
  { label: '湖北武汉', value: 'wuhan', locationId: '101200101' },
  { label: '上海', value: 'shanghai', locationId: '101020100' },
  { label: '北京', value: 'beijing', locationId: '101010100' },
  { label: '广州', value: 'guangzhou', locationId: '101280101' },
  { label: '成都', value: 'chengdu', locationId: '101270101' },
  { label: '湖北麻城', value: 'macheng', locationId: '101200504' },
  { label: '湖北罗田', value: 'luotian', locationId: '101200803' }
]

const WEATHER_ICONS: Record<string, { text: string; icon: string }> = {
  '100': { text: '晴', icon: '☀️' },
  '101': { text: '多云', icon: '⛅' },
  '102': { text: '少云', icon: '🌤️' },
  '103': { text: '晴间多云', icon: '🌤️' },
  '104': { text: '阴', icon: '☁️' },
  '200': { text: '有风', icon: '🌬️' },
  '201': { text: '平静', icon: '🌬️' },
  '202': { text: '微风', icon: '🌬️' },
  '203': { text: '和风', icon: '🌬️' },
  '204': { text: '清风', icon: '🌬️' },
  '205': { text: '强风', icon: '💨' },
  '206': { text: '疾风', icon: '💨' },
  '207': { text: '大风', icon: '💨' },
  '208': { text: '烈风', icon: '💨' },
  '209': { text: '风暴', icon: '🌪️' },
  '210': { text: '狂风暴雨', icon: '⛈️' },
  '211': { text: '飓风', icon: '🌀' },
  '212': { text: '龙卷风', icon: '🌪️' },
  '213': { text: '热带风暴', icon: '🌀' },
  '300': { text: '小毛毛雨', icon: '🌦️' },
  '301': { text: '毛毛雨', icon: '🌧️' },
  '302': { text: '大毛毛雨', icon: '🌧️' },
  '303': { text: '小阵雨', icon: '🌦️' },
  '304': { text: '中阵雨', icon: '🌦️' },
  '305': { text: '大阵雨', icon: '🌧️' },
  '306': { text: '暴阵雨', icon: '⛈️' },
  '307': { text: '小雷阵雨', icon: '⛈️' },
  '308': { text: '中雷阵雨', icon: '⛈️' },
  '309': { text: '大雷阵雨', icon: '⛈️' },
  '310': { text: '强雷阵雨', icon: '⛈️' },
  '311': { text: '雷阵雨', icon: '⛈️' },
  '312': { text: '强雷阵雨', icon: '⛈️' },
  '313': { text: '雷阵雨伴有冰雹', icon: '⛈️' },
  '400': { text: '小雪', icon: '🌨️' },
  '401': { text: '中雪', icon: '🌨️' },
  '402': { text: '大雪', icon: '❄️' },
  '403': { text: '暴雪', icon: '❄️' },
  '404': { text: '雨夹雪', icon: '🌨️' },
  '405': { text: '雨夹雪', icon: '🌨️' },
  '406': { text: '雨夹雪', icon: '🌨️' },
  '407': { text: '阵雪', icon: '🌨️' },
  '408': { text: '阵雪', icon: '🌨️' },
  '409': { text: '小阵雪', icon: '🌨️' },
  '410': { text: '大阵雪', icon: '❄️' },
  '500': { text: '薄雾', icon: '🌫️' },
  '501': { text: '雾', icon: '🌫️' },
  '502': { text: '大雾', icon: '🌫️' },
  '503': { text: '浓雾', icon: '🌫️' },
  '504': { text: '强浓雾', icon: '🌫️' },
  '507': { text: '沙尘', icon: '🌪️' },
  '508': { text: '沙暴', icon: '🌪️' },
  '509': { text: '雾', icon: '🌫️' },
  '510': { text: '大雾', icon: '🌫️' },
  '511': { text: '冻雾', icon: '🌫️' },
  '512': { text: '冻雾', icon: '🌫️' },
  '513': { text: '冻雾', icon: '🌫️' },
  '514': { text: '冻雾', icon: '🌫️' },
  '515': { text: '冻雾', icon: '🌫️' }
}

const WIND_DIR: Record<number, string> = {
  0: '北风', 1: '东北风', 2: '东风', 3: '东南风',
  4: '南风', 5: '西南风', 6: '西风', 7: '西北风', 8: '静风'
}

const selectedCity = ref('wuhan')
const loading = ref(false)
const errorMsg = ref('')
const apiKey = ref(localStorage.getItem('qweather_key') || '')
const showKeyInput = ref(false)
const tempKey = ref('')

const cityOptions = CITIES.map(c => ({ label: c.label, value: c.value }))

interface DayWeather {
  date: string
  week: string
  tempMax: number
  tempMin: number
  weatherCode: string
  weatherText: string
  weatherIcon: string
  windDir: string
  windSpeed: string
  humidity: string
  isToday?: boolean
}

const weatherDays = ref<DayWeather[]>([])

async function fetchWeather() {
  if (!apiKey.value.trim()) {
    errorMsg.value = '请先配置和风天气 API Key（免费）'
    return
  }
  loading.value = true
  errorMsg.value = ''
  const city = CITIES.find(c => c.value === selectedCity.value)!
  try {
    // 和风天气 API - 每日天气
    const url = `https://devapi.qweather.com/v7/weather/7d?location=${city.locationId}&key=${apiKey.value}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.code !== '200') {
      errorMsg.value = '获取失败：' + (data.code || '未知错误')
      return
    }

    const weekDays = ['周日','周一','周二','周三','周四','周五','周六']
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    weatherDays.value = data.daily.map((d: any, i: number) => {
      const date = new Date(d.fxDate)
      const isToday = date.getTime() === today.getTime()
      const info = WEATHER_ICONS[d.iconDay] || { text: d.textDay, icon: '❓' }
      return {
        date: d.fxDate,
        week: isToday ? '今天' : (i === 1 ? '明天' : weekDays[date.getDay()]),
        tempMax: d.tempMax,
        tempMin: d.tempMin,
        weatherCode: d.iconDay,
        weatherText: info.text,
        weatherIcon: info.icon,
        windDir: WIND_DIR[Number(d.windDirDay)] || d.windDirDay,
        windSpeed: d.windSpeedDay + 'km/h',
        humidity: d.humidity + '%',
        isToday
      }
    })
  } catch (e: any) {
    errorMsg.value = '获取天气失败：' + (e.message || '网络错误')
  } finally {
    loading.value = false
  }
}

function saveKey() {
  const key = tempKey.value.trim()
  if (!key) return
  apiKey.value = key
  localStorage.setItem('qweather_key', key)
  showKeyInput.value = false
  tempKey.value = ''
  fetchWeather()
}

onMounted(() => {
  if (apiKey.value) {
    fetchWeather()
  } else {
    showKeyInput.value = true
  }
})
</script>

<template>
  <div class="weather">
    <h2 class="page-title">天气预报</h2>

    <!-- Key 配置提示 -->
    <NCard v-if="showKeyInput" style="margin-bottom: 16px; background: #fff7e6; border-color: #ffd591">
      <NSpace vertical :size="12">
        <NText>
          <strong>首次使用需要配置和风天气 API Key（免费，无需翻墙）</strong>
        </NText>
        <NText depth="3" style="font-size: 13px">
          1. 访问 <NText code>https://dev.qweather.com</NText> 注册账号<br>
          2. 登录后进入控制台 → 创建应用 → 获取 Key<br>
          3. 免费版每天 1000 次调用，支持所有中国城市
        </NText>
        <NSpace>
          <NInput
            v-model:value="tempKey"
            placeholder="粘贴 API Key"
            style="width: 300px"
            @keyup.enter="saveKey"
          />
          <NButton type="primary" @click="saveKey">保存并获取天气</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <!-- 城市选择 -->
    <NCard v-else style="margin-bottom: 16px">
      <NSpace align="center" justify="space-between">
        <NSpace align="center">
          <NText>城市：</NText>
          <NSelect
            v-model:value="selectedCity"
            :options="cityOptions"
            style="width: 160px"
            @update:value="fetchWeather"
          />
        </NSpace>
        <NSpace align="center">
          <NButton size="small" @click="showKeyInput = true">更换 Key</NButton>
          <NButton size="small" @click="fetchWeather">刷新</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <NSpin :show="loading">
      <NGrid v-if="!errorMsg && weatherDays.length > 0" :cols="7" :x-gap="8" responsive="screen">
        <NGi v-for="day in weatherDays" :key="day.date">
          <NCard class="day-card" :class="{ 'is-today': day.isToday }">
            <div class="day-week">{{ day.week }}</div>
            <div class="day-date">{{ day.date.slice(5).replace('-','/') }}</div>
            <div class="day-icon">{{ day.weatherIcon }}</div>
            <div class="day-weather">{{ day.weatherText }}</div>
            <div class="day-temp">
              <span class="temp-high">{{ day.tempMax }}°</span>
              <span class="temp-low">{{ day.tempMin }}°</span>
            </div>
            <div class="day-detail">
              <NText depth="3" style="font-size: 11px">{{ day.windDir }}</NText>
              <NText depth="3" style="font-size: 11px">{{ day.windSpeed }}</NText>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpin>

    <NCard v-if="errorMsg" style="margin-top: 16px">
      <NText type="error">{{ errorMsg }}</NText>
    </NCard>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
.day-card {
  text-align: center;
  min-height: 200px;
}
.day-card.is-today {
  border: 2px solid #18a058;
}
.day-week {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}
.day-date {
  font-size: 11px;
  color: var(--n-text-color-3, #999);
  margin-bottom: 6px;
}
.is-today .day-week { color: #18a058; }
.day-icon {
  font-size: 32px;
  margin-bottom: 4px;
}
.day-weather {
  font-size: 13px;
  color: var(--n-text-color-2, #666);
  margin-bottom: 6px;
}
.day-temp {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 4px;
}
.temp-high {
  font-size: 16px;
  font-weight: 700;
  color: #d03050;
}
.temp-low {
  font-size: 16px;
  font-weight: 600;
  color: #2080f0;
}
.day-detail {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
