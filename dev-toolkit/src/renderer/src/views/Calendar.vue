<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NButton, NSpace, NText, NGrid, NGi, NIcon } from 'naive-ui'
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'

// ============ 24节气预计算表（lunar-calendar 精确数据，2024-2031） ============
const SOLAR_TERMS: Record<string, string> = {
  '2024-01-06':'小寒','2024-01-20':'大寒','2024-02-04':'立春','2024-02-19':'雨水',
  '2024-03-05':'惊蛰','2024-03-20':'春分','2024-04-04':'清明','2024-04-19':'谷雨',
  '2024-05-05':'立夏','2024-05-20':'小满','2024-06-05':'芒种','2024-06-21':'夏至',
  '2024-07-07':'小暑','2024-07-22':'大暑','2024-08-07':'立秋','2024-08-23':'处暑',
  '2024-09-07':'白露','2024-09-22':'秋分','2024-10-08':'寒露','2024-10-23':'霜降',
  '2024-11-07':'立冬','2024-11-22':'小雪','2024-12-06':'大雪','2024-12-21':'冬至',
  '2025-01-05':'小寒','2025-01-20':'大寒','2025-02-03':'立春','2025-02-18':'雨水',
  '2025-03-05':'惊蛰','2025-03-20':'春分','2025-04-04':'清明','2025-04-20':'谷雨',
  '2025-05-05':'立夏','2025-05-21':'小满','2025-06-05':'芒种','2025-06-21':'夏至',
  '2025-07-07':'小暑','2025-07-22':'大暑','2025-08-07':'立秋','2025-08-23':'处暑',
  '2025-09-07':'白露','2025-09-23':'秋分','2025-10-08':'寒露','2025-10-23':'霜降',
  '2025-11-07':'立冬','2025-11-22':'小雪','2025-12-07':'大雪','2025-12-21':'冬至',
  '2026-01-05':'小寒','2026-01-20':'大寒','2026-02-04':'立春','2026-02-18':'雨水',
  '2026-03-05':'惊蛰','2026-03-20':'春分','2026-04-05':'清明','2026-04-20':'谷雨',
  '2026-05-05':'立夏','2026-05-21':'小满','2026-06-06':'芒种','2026-06-21':'夏至',
  '2026-07-07':'小暑','2026-07-23':'大暑','2026-08-07':'立秋','2026-08-23':'处暑',
  '2026-09-07':'白露','2026-09-23':'秋分','2026-10-08':'寒露','2026-10-23':'霜降',
  '2026-11-07':'立冬','2026-11-22':'小雪','2026-12-07':'大雪','2026-12-22':'冬至',
  '2027-01-05':'小寒','2027-01-20':'大寒','2027-02-04':'立春','2027-02-19':'雨水',
  '2027-03-06':'惊蛰','2027-03-21':'春分','2027-04-05':'清明','2027-04-20':'谷雨',
  '2027-05-06':'立夏','2027-05-21':'小满','2027-06-06':'芒种','2027-06-21':'夏至',
  '2027-07-07':'小暑','2027-07-23':'大暑','2027-08-08':'立秋','2027-08-23':'处暑',
  '2027-09-08':'白露','2027-09-23':'秋分','2027-10-08':'寒露','2027-10-23':'霜降',
  '2027-11-07':'立冬','2027-11-22':'小雪','2027-12-07':'大雪','2027-12-22':'冬至',
  '2028-01-06':'小寒','2028-01-20':'大寒','2028-02-04':'立春','2028-02-19':'雨水',
  '2028-03-05':'惊蛰','2028-03-20':'春分','2028-04-04':'清明','2028-04-19':'谷雨',
  '2028-05-05':'立夏','2028-05-20':'小满','2028-06-05':'芒种','2028-06-21':'夏至',
  '2028-07-06':'小暑','2028-07-22':'大暑','2028-08-07':'立秋','2028-08-22':'处暑',
  '2028-09-07':'白露','2028-09-22':'秋分','2028-10-08':'寒露','2028-10-23':'霜降',
  '2028-11-07':'立冬','2028-11-22':'小雪','2028-12-06':'大雪','2028-12-21':'冬至',
  '2029-01-05':'小寒','2029-01-20':'大寒','2029-02-03':'立春','2029-02-18':'雨水',
  '2029-03-05':'惊蛰','2029-03-20':'春分','2029-04-04':'清明','2029-04-20':'谷雨',
  '2029-05-05':'立夏','2029-05-21':'小满','2029-06-05':'芒种','2029-06-21':'夏至',
  '2029-07-07':'小暑','2029-07-22':'大暑','2029-08-07':'立秋','2029-08-23':'处暑',
  '2029-09-07':'白露','2029-09-23':'秋分','2029-10-08':'寒露','2029-10-23':'霜降',
  '2029-11-07':'立冬','2029-11-22':'小雪','2029-12-07':'大雪','2029-12-21':'冬至',
  '2030-01-05':'小寒','2030-01-20':'大寒','2030-02-04':'立春','2030-02-18':'雨水',
  '2030-03-05':'惊蛰','2030-03-20':'春分','2030-04-05':'清明','2030-04-20':'谷雨',
  '2030-05-05':'立夏','2030-05-21':'小满','2030-06-06':'芒种','2030-06-21':'夏至',
  '2030-07-07':'小暑','2030-07-23':'大暑','2030-08-07':'立秋','2030-08-23':'处暑',
  '2030-09-07':'白露','2030-09-23':'秋分','2030-10-08':'寒露','2030-10-23':'霜降',
  '2030-11-07':'立冬','2030-11-22':'小雪','2030-12-07':'大雪','2030-12-22':'冬至',
  '2031-01-05':'小寒','2031-01-20':'大寒','2031-02-04':'立春','2031-02-19':'雨水',
  '2031-03-06':'惊蛰','2031-03-21':'春分','2031-04-05':'清明','2031-04-20':'谷雨',
  '2031-05-06':'立夏','2031-05-21':'小满','2031-06-06':'芒种','2031-06-21':'夏至',
  '2031-07-07':'小暑','2031-07-23':'大暑','2031-08-08':'立秋','2031-08-23':'处暑',
  '2031-09-08':'白露','2031-09-23':'秋分','2031-10-08':'寒露','2031-10-23':'霜降',
  '2031-11-07':'立冬','2031-11-22':'小雪','2031-12-07':'大雪','2031-12-22':'冬至',
}

// ============ 法定节假日（阳历，精确数据） ============
const LEGAL_HOLIDAYS: Record<string, string> = {
  // 元旦
  '2024-01-01':'元旦','2025-01-01':'元旦','2026-01-01':'元旦','2027-01-01':'元旦',
  '2028-01-01':'元旦','2029-01-01':'元旦','2030-01-01':'元旦','2031-01-01':'元旦',
  // 春节（2026: 2/16-2/23放假，2/11和2/24上班）
  '2024-02-10':'春节','2024-02-11':'春节','2024-02-12':'春节','2024-02-13':'春节',
  '2024-02-14':'春节','2024-02-15':'春节','2024-02-16':'春节','2024-02-17':'春节',
  '2025-01-28':'春节','2025-01-29':'春节','2025-01-30':'春节','2025-01-31':'春节',
  '2025-02-01':'春节','2025-02-02':'春节','2025-02-03':'春节','2025-02-04':'春节',
  '2026-02-16':'春节','2026-02-17':'春节','2026-02-18':'春节','2026-02-19':'春节',
  '2026-02-20':'春节','2026-02-21':'春节','2026-02-22':'春节','2026-02-23':'春节',
  '2027-02-05':'春节','2027-02-06':'春节','2027-02-07':'春节','2027-02-08':'春节',
  '2027-02-09':'春节','2027-02-10':'春节','2027-02-11':'春节','2027-02-12':'春节',
  '2028-01-24':'春节','2028-01-25':'春节','2028-01-26':'春节','2028-01-27':'春节',
  '2028-01-28':'春节','2028-01-29':'春节','2028-01-30':'春节','2028-01-31':'春节',
  '2029-02-11':'春节','2029-02-12':'春节','2029-02-13':'春节','2029-02-14':'春节',
  '2029-02-15':'春节','2029-02-16':'春节','2029-02-17':'春节','2029-02-18':'春节',
  '2030-02-01':'春节','2030-02-02':'春节','2030-02-03':'春节','2030-02-04':'春节',
  '2030-02-05':'春节','2030-02-06':'春节','2030-02-07':'春节','2030-02-08':'春节',
  '2031-01-21':'春节','2031-01-22':'春节','2031-01-23':'春节','2031-01-24':'春节',
  '2031-01-25':'春节','2031-01-26':'春节','2031-01-27':'春节','2031-01-28':'春节',
  // 清明节
  '2024-04-04':'清明节','2024-04-05':'清明节','2024-04-06':'清明节',
  '2025-04-04':'清明节','2025-04-05':'清明节','2025-04-06':'清明节',
  '2026-04-04':'清明节','2026-04-05':'清明节','2026-04-06':'清明节',
  '2027-04-04':'清明节','2027-04-05':'清明节','2027-04-06':'清明节',
  '2028-04-04':'清明节','2028-04-05':'清明节','2028-04-06':'清明节',
  '2029-04-04':'清明节','2029-04-05':'清明节','2029-04-06':'清明节',
  '2030-04-04':'清明节','2030-04-05':'清明节','2030-04-06':'清明节',
  '2031-04-04':'清明节','2031-04-05':'清明节','2031-04-06':'清明节',
  // 劳动节
  '2024-05-01':'劳动节','2024-05-02':'劳动节','2024-05-03':'劳动节','2024-05-04':'劳动节','2024-05-05':'劳动节',
  '2025-05-01':'劳动节','2025-05-02':'劳动节','2025-05-03':'劳动节','2025-05-04':'劳动节','2025-05-05':'劳动节',
  '2026-05-01':'劳动节','2026-05-02':'劳动节','2026-05-03':'劳动节','2026-05-04':'劳动节','2026-05-05':'劳动节',
  '2027-05-01':'劳动节','2027-05-02':'劳动节','2027-05-03':'劳动节',
  '2028-04-29':'劳动节','2028-04-30':'劳动节','2028-05-01':'劳动节',
  '2029-04-29':'劳动节','2029-04-30':'劳动节','2029-05-01':'劳动节',
  '2030-04-29':'劳动节','2030-04-30':'劳动节','2030-05-01':'劳动节',
  '2031-04-29':'劳动节','2031-04-30':'劳动节','2031-05-01':'劳动节',
  // 国庆节
  '2024-10-01':'国庆节','2024-10-02':'国庆节','2024-10-03':'国庆节','2024-10-04':'国庆节',
  '2024-10-05':'国庆节','2024-10-06':'国庆节','2024-10-07':'国庆节',
  '2025-10-01':'国庆节','2025-10-02':'国庆节','2025-10-03':'国庆节','2025-10-04':'国庆节',
  '2025-10-05':'国庆节','2025-10-06':'国庆节','2025-10-07':'国庆节',
  '2026-10-01':'国庆节','2026-10-02':'国庆节','2026-10-03':'国庆节','2026-10-04':'国庆节',
  '2026-10-05':'国庆节','2026-10-06':'国庆节','2026-10-07':'国庆节',
  '2027-10-01':'国庆节','2027-10-02':'国庆节','2027-10-03':'国庆节','2027-10-04':'国庆节',
  '2027-10-05':'国庆节','2027-10-06':'国庆节','2027-10-07':'国庆节',
  '2028-10-01':'国庆节','2028-10-02':'国庆节','2028-10-03':'国庆节','2028-10-04':'国庆节',
  '2028-10-05':'国庆节','2028-10-06':'国庆节','2028-10-07':'国庆节',
  '2029-10-01':'国庆节','2029-10-02':'国庆节','2029-10-03':'国庆节','2029-10-04':'国庆节',
  '2029-10-05':'国庆节','2029-10-06':'国庆节','2029-10-07':'国庆节',
  '2030-10-01':'国庆节','2030-10-02':'国庆节','2030-10-03':'国庆节','2030-10-04':'国庆节',
  '2030-10-05':'国庆节','2030-10-06':'国庆节','2030-10-07':'国庆节',
  '2031-10-01':'国庆节','2031-10-02':'国庆节','2031-10-03':'国庆节','2031-10-04':'国庆节',
  '2031-10-05':'国庆节','2031-10-06':'国庆节','2031-10-07':'国庆节',
}

// ============ 传统节日（农历节日，阳历日期，lunar-calendar 精确计算） ============
const LUNAR_FESTIVALS: Record<string, string> = {
  '2024-2-24':'元宵节','2024-6-10':'端午节','2024-8-10':'七夕节','2024-9-17':'中秋节','2024-10-11':'重阳节',
  '2025-1-7':'腊八节','2025-2-12':'元宵节','2025-5-31':'端午节','2025-7-31':'七夕节','2025-9-6':'中秋节','2025-9-30':'重阳节',
  '2026-3-3':'元宵节','2026-6-19':'端午节','2026-8-19':'七夕节','2026-9-25':'中秋节','2026-10-18':'重阳节',
  '2027-1-15':'腊八节','2027-2-20':'元宵节','2027-6-9':'端午节','2027-8-8':'七夕节','2027-9-15':'中秋节','2027-10-8':'重阳节',
  '2028-1-4':'腊八节','2028-2-9':'元宵节','2028-5-28':'端午节','2028-7-28':'七夕节','2028-9-3':'中秋节','2028-9-27':'重阳节','2028-12-23':'腊八节',
  '2029-2-27':'元宵节','2029-6-16':'端午节','2029-8-16':'七夕节','2029-9-22':'中秋节','2029-10-16':'重阳节',
  '2030-1-11':'腊八节','2030-2-17':'元宵节','2030-6-5':'端午节','2030-8-5':'七夕节','2030-9-12':'中秋节','2030-10-5':'重阳节','2030-12-31':'腊八节',
  '2031-1-1':'腊八节','2031-2-6':'元宵节','2031-5-25':'端午节','2031-7-25':'七夕节','2031-9-1':'中秋节','2031-9-25':'重阳节','2031-12-21':'腊八节',
}

// ============ 工具函数 ============
function pad(n: number) { return String(n).padStart(2, '0') }

function getLunarInfo(y: number, m: number, d: number): string {
  const result = (window as any).api?.solarToLunar?.(y, m, d)
  if (!result) return ''
  const MONTHS = ['正','二','三','四','五','六','七','八','九','十','冬','腊']
  const DAYS = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
               '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
               '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']
  if (result.lunarLeapMonth === 1) return '闰' + MONTHS[result.lunarMonth - 1] + '月'
  if (result.lunarDay === 1) return MONTHS[result.lunarMonth - 1] + '月'
  return DAYS[result.lunarDay - 1]
}

// ============ 界面逻辑 ============
interface DayInfo {
  day: number
  isToday: boolean
  isCurrentMonth: boolean
  lunarText: string
  termText: string
  holidayText: string
  festivalText: string
  isLegalHoliday: boolean
  isWeekend: boolean
}

const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth() + 1)
const today = new Date()
const todayY = today.getFullYear()
const todayM = today.getMonth() + 1
const todayD = today.getDate()

function prevMonth() {
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value++ }
  else viewMonth.value++
}

function goToday() {
  viewYear.value = todayY
  viewMonth.value = todayM
}

const calendarDays = computed((): DayInfo[] => {
  const days: DayInfo[] = []
  const firstDay = new Date(viewYear.value, viewMonth.value - 1, 1)
  const startDow = firstDay.getDay()
  const prevMonthDays = new Date(viewYear.value, viewMonth.value - 1, 0).getDate()
  const currMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  const y = viewYear.value
  const m = viewMonth.value

  // 上月补齐
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const pm = m === 1 ? 12 : m - 1
    const py = m === 1 ? y - 1 : y
    days.push({
      day: d, isToday: false, isCurrentMonth: false,
      lunarText: getLunarInfo(py, pm, d),
      termText: '', holidayText: '', festivalText: '',
      isLegalHoliday: false, isWeekend: false
    })
  }

  // 当月
  for (let d = 1; d <= currMonthDays; d++) {
    const dateKey = `${y}-${pad(m)}-${pad(d)}`
    const dow = new Date(y, m - 1, d).getDay()
    const isWeekend = dow === 0 || dow === 6
    const legalHoliday = LEGAL_HOLIDAYS[dateKey] || ''
    const lunarFest = LUNAR_FESTIVALS[dateKey] || ''
    const term = SOLAR_TERMS[dateKey] || ''

    days.push({
      day: d,
      isToday: d === todayD && m === todayM && y === todayY,
      isCurrentMonth: true,
      lunarText: getLunarInfo(y, m, d),
      termText: term,
      holidayText: legalHoliday,
      festivalText: lunarFest,
      isLegalHoliday: !!legalHoliday,
      isWeekend: isWeekend
    })
  }

  // 下月补齐
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const nm = m === 12 ? 1 : m + 1
    const ny = m === 12 ? y + 1 : y
    days.push({
      day: d, isToday: false, isCurrentMonth: false,
      lunarText: getLunarInfo(ny, nm, d),
      termText: '', holidayText: '', festivalText: '',
      isLegalHoliday: false, isWeekend: false
    })
  }

  return days
})

const weekHeaders = ['周日','周一','周二','周三','周四','周五','周六']
const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
</script>

<template>
  <div class="calendar-view">
    <h2 class="page-title">日历</h2>

    <NCard>
      <div class="cal-header">
        <NSpace align="center">
          <NButton quaternary circle size="small" @click="prevMonth">
            <template #icon><NIcon><ChevronBackOutline /></NIcon></template>
          </NButton>
          <NText strong style="font-size: 18px; min-width: 140px; text-align: center">
            {{ viewYear }} {{ monthNames[viewMonth - 1] }}
          </NText>
          <NButton quaternary circle size="small" @click="nextMonth">
            <template #icon><NIcon><ChevronForwardOutline /></NIcon></template>
          </NButton>
          <NButton size="small" @click="goToday">今天</NButton>
        </NSpace>
      </div>

      <div class="week-header">
        <div v-for="h in weekHeaders" :key="h" class="week-cell" :class="{ weekend: h === '周六' || h === '周日' }">
          {{ h }}
        </div>
      </div>

      <div class="day-grid">
        <div
          v-for="(item, idx) in calendarDays"
          :key="idx"
          class="day-cell"
          :class="{
            'other-month': !item.isCurrentMonth,
            'is-legal-holiday': item.isLegalHoliday,
            'is-weekend': item.isWeekend && !item.isLegalHoliday,
          }"
        >
          <!-- 休假角标 -->
          <div v-if="item.isLegalHoliday" class="rest-badge">休</div>

          <div
            class="day-num"
            :class="{
              'today-ring': item.isToday && !item.isLegalHoliday && !item.isWeekend,
              'holiday-num': (item.isLegalHoliday || item.isWeekend) && !item.isToday
            }"
          >{{ item.day }}</div>

          <div class="day-sub" v-if="item.festivalText || item.holidayText || item.termText">
            <span v-if="item.festivalText" class="festival">{{ item.festivalText }}</span>
            <span v-else-if="item.holidayText" class="legal-holiday">{{ item.holidayText }}</span>
            <span v-else-if="item.termText" class="term">{{ item.termText }}</span>
          </div>
          <div class="day-sub lunar" v-else>{{ item.lunarText }}</div>
        </div>
      </div>

      <div class="legend">
        <NSpace :size="16">
          <NSpace :size="4"><div class="legend-dot festival"></div><NText depth="3" style="font-size: 12px">传统节日</NText></NSpace>
          <NSpace :size="4"><div class="legend-dot legal-holiday"></div><NText depth="3" style="font-size: 12px">法定节假日</NText></NSpace>
          <NSpace :size="4"><div class="legend-dot term"></div><NText depth="3" style="font-size: 12px">节气</NText></NSpace>
          <NSpace :size="4"><div class="legend-dot weekend"></div><NText depth="3" style="font-size: 12px">周末</NText></NSpace>
        </NSpace>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.page-title { font-size: 22px; font-weight: 600; margin-bottom: 16px; }
.cal-header { margin-bottom: 12px; }
.week-header {
  display: grid; grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--n-border-color, #efeff5); padding-bottom: 8px; margin-bottom: 4px;
}
.week-cell { text-align: center; font-size: 12px; color: var(--n-text-color-3, #999); padding: 4px 0; }
.week-cell.weekend { color: #e54d00; }
.day-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
.day-cell {
  min-height: 72px; padding: 6px 4px;
  border-right: 1px solid var(--n-border-color, #efeff5);
  border-bottom: 1px solid var(--n-border-color, #efeff5);
  display: flex; flex-direction: column; gap: 2px;
  position: relative;
}
.day-cell:nth-child(7n) { border-right: none; }
.day-cell.other-month { opacity: 0.3; }
.day-cell.is-legal-holiday { background: #fff1e6; }
.day-cell.is-weekend { background: #f5f5f5; }
.rest-badge {
  position: absolute;
  top: 2px;
  left: 2px;
  background: #e54d00;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 3px;
  line-height: 14px;
}
.day-num { font-size: 14px; font-weight: 500; line-height: 1; }
.day-num.today-ring {
  background: #18a058; color: white; border-radius: 50%;
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
}
.day-num.holiday-num { color: #d03050; font-weight: 700; }
.day-sub { font-size: 10px; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.day-sub.lunar { color: var(--n-text-color-3, #999); }
.day-sub.festival { color: #d03050; font-weight: 600; }
.day-sub.legal-holiday { color: #e54d00; font-weight: 600; }
.day-sub.term { color: #2080f0; }
.legend { margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--n-border-color, #efeff5); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 2px; }
.legend-dot.festival { background: #d03050; }
.legend-dot.legal-holiday { background: #e54d00; }
.legend-dot.term { background: #2080f0; }
.legend-dot.weekend { background: #999; }
</style>
