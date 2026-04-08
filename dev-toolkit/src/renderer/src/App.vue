<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NLayout, NLayoutSider, NMenu, NIcon, NConfigProvider, darkTheme } from 'naive-ui'
import {
  ImageOutline,
  QrCodeOutline,
  GitCompareOutline,
  BookmarkOutline,
  CodeSlashOutline,
  SwapHorizontalOutline,
  GlobeOutline,
  TimerOutline,
  CalendarOutline,
  SunnyOutline
} from '@vicons/ionicons5'
import { routes } from './router'

const router = useRouter()
const route = useRoute()

const theme = ref<'light' | 'dark'>('light')
const isDark = computed(() => theme.value === 'dark')

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = routes
  .filter((r) => r.meta?.title)
  .map((r) => ({
    label: r.meta?.title as string,
    key: r.path,
    icon: r.meta?.icon === 'ImageOutline' ? renderIcon(ImageOutline)
      : r.meta?.icon === 'QrCodeOutline' ? renderIcon(QrCodeOutline)
      : r.meta?.icon === 'GitCompareOutline' ? renderIcon(GitCompareOutline)
      : r.meta?.icon === 'BookmarkOutline' ? renderIcon(BookmarkOutline)
      : r.meta?.icon === 'CodeSlashOutline' ? renderIcon(CodeSlashOutline)
      : r.meta?.icon === 'SwapHorizontalOutline' ? renderIcon(SwapHorizontalOutline)
      : r.meta?.icon === 'GlobeOutline' ? renderIcon(GlobeOutline)
      : r.meta?.icon === 'TimerOutline' ? renderIcon(TimerOutline)
      : r.meta?.icon === 'CalendarOutline' ? renderIcon(CalendarOutline)
      : r.meta?.icon === 'SunnyOutline' ? renderIcon(SunnyOutline)
      : renderIcon(ImageOutline)
  }))

const activeKey = computed(() => route.path)

function handleMenuUpdate(key: string) {
  router.push(key)
}

function toggleTheme() {
  theme.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : undefined">
    <NLayout has-sider style="height: 100vh">
      <NLayoutSider
        bordered
        :width="180"
        :native-scrollbar="false"
        style="display: flex; flex-direction: column"
      >
        <div class="logo">
          <span class="logo-text">DevToolkit</span>
        </div>
        <NMenu
          :value="activeKey"
          :options="menuOptions"
          @update:value="handleMenuUpdate"
        />
        <div class="sider-footer">
          <button class="theme-toggle" @click="toggleTheme">
            {{ isDark ? '☀️ 浅色' : '🌙 深色' }}
          </button>
        </div>
      </NLayoutSider>
      <NLayout>
        <div class="main-content">
          <router-view />
        </div>
      </NLayout>
    </NLayout>
  </NConfigProvider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}

.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--n-border-color, #efeff5);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sider-footer {
  margin-top: auto;
  padding: 12px;
  border-top: 1px solid var(--n-border-color, #efeff5);
}

.theme-toggle {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 6px;
  background: var(--n-color, transparent);
  cursor: pointer;
  font-size: 13px;
  color: var(--n-text-color, #333);
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--n-color-hover, rgba(0, 0, 0, 0.04));
}

.main-content {
  height: 100vh;
  overflow-y: auto;
  padding: 24px;
}
</style>
