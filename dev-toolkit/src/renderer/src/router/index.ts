import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/image-compress'
  },
  {
    path: '/image-compress',
    name: 'ImageCompress',
    component: () => import('../views/ImageCompress.vue'),
    meta: { title: '图片压缩', icon: 'ImageOutline' }
  },
  {
    path: '/qrcode',
    name: 'QrCode',
    component: () => import('../views/QrCode.vue'),
    meta: { title: '二维码生成', icon: 'QrCodeOutline' }
  },
  {
    path: '/diff',
    name: 'DiffTool',
    component: () => import('../views/DiffTool.vue'),
    meta: { title: 'Diff 对比', icon: 'GitCompareOutline' }
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: () => import('../views/Bookmarks.vue'),
    meta: { title: '收藏夹', icon: 'BookmarkOutline' }
  },
  {
    path: '/json-format',
    name: 'JsonFormat',
    component: () => import('../views/JsonFormat.vue'),
    meta: { title: 'JSON 格式化', icon: 'CodeSlashOutline' }
  },
  {
    path: '/encode-convert',
    name: 'EncodeConvert',
    component: () => import('../views/EncodeConvert.vue'),
    meta: { title: '编码转换', icon: 'SwapHorizontalOutline' }
  },
  {
    path: '/world-time',
    name: 'WorldTime',
    component: () => import('../views/WorldTime.vue'),
    meta: { title: '世界时间', icon: 'GlobeOutline' }
  },
  {
    path: '/timestamp',
    name: 'Timestamp',
    component: () => import('../views/Timestamp.vue'),
    meta: { title: '时间戳', icon: 'TimerOutline' }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
    meta: { title: '日历', icon: 'CalendarOutline' }
  },
  {
    path: '/weather',
    name: 'Weather',
    component: () => import('../views/Weather.vue'),
    meta: { title: '天气预报', icon: 'SunnyOutline' }
  }
]
