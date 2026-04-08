<script setup lang="ts">
import { ref, onMounted, computed, toRaw } from 'vue'
import {
  NCard, NButton, NInput, NSpace, NDataTable, NModal, NForm, NFormItem,
  NSelect, NTag, NEmpty, NGrid, NGi, NText, NPopconfirm, NInputGroup,
  NDivider
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

interface Bookmark {
  id: number
  title: string
  url: string
  description: string
  category: string
  created_at: string
}

interface Category {
  id: number
  name: string
}

const bookmarks = ref<Bookmark[]>([])
const categories = ref<Category[]>([])
const search = ref('')
const selectedCategory = ref<string | null>(null)
const showModal = ref(false)
const showCategoryModal = ref(false)
const editingBookmark = ref<Bookmark | null>(null)
const newCategoryName = ref('')
const formError = ref('')

const form = ref({
  title: '',
  url: '',
  description: '',
  category: ''
})

const categoryOptions = computed(() => [
  { label: '全部分类', value: '__all__' },
  ...categories.value.map((c) => ({ label: c.name, value: c.name }))
])

const filteredBookmarks = computed(() => {
  let list = bookmarks.value
  if (search.value) {
    const s = search.value.toLowerCase()
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.url.toLowerCase().includes(s) ||
        b.description.toLowerCase().includes(s)
    )
  }
  if (selectedCategory.value && selectedCategory.value !== '__all__') {
    list = list.filter((b) => b.category === selectedCategory.value)
  }
  return list
})

async function loadBookmarks() {
  bookmarks.value = await window.api.getBookmarks()
}

async function loadCategories() {
  categories.value = await window.api.getCategories()
}

function openAddModal() {
  editingBookmark.value = null
  form.value = { title: '', url: '', description: '', category: '' }
  showModal.value = true
}

function openEditModal(bookmark: Bookmark) {
  editingBookmark.value = bookmark
  form.value = {
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    category: bookmark.category
  }
  showModal.value = true
}

async function saveBookmark() {
  formError.value = ''
  if (!form.value.title) {
    formError.value = '请填写标题'
    return
  }
  if (!form.value.url) {
    formError.value = '请填写 URL'
    return
  }

  try {
    if (editingBookmark.value) {
      await window.api.updateBookmark({
        id: editingBookmark.value.id,
        ...toRaw(form.value)
      })
    } else {
      await window.api.addBookmark({ ...toRaw(form.value) })
    }
    showModal.value = false
    await loadBookmarks()
  } catch (e: any) {
    formError.value = '保存失败: ' + (e.message || e)
    console.error('saveBookmark error:', e)
  }
}

async function deleteBookmark(id: number) {
  await window.api.deleteBookmark(id)
  await loadBookmarks()
}

function openUrl(url: string) {
  window.api.openExternal(url)
}

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  await window.api.addCategory(newCategoryName.value.trim())
  newCategoryName.value = ''
  showCategoryModal.value = false
  await loadCategories()
}

async function exportData() {
  await window.api.exportBookmarks()
}

async function importData() {
  const result = await window.api.importBookmarks()
  if ((result as any).success) {
    await loadBookmarks()
  }
}

onMounted(() => {
  loadBookmarks()
  loadCategories()
})
</script>

<template>
  <div class="bookmarks">
    <h2 class="page-title">收藏夹</h2>

    <NCard>
      <NSpace align="center" justify="space-between" wrap>
        <NSpace align="center" :size="12">
          <NInputGroup style="width: 300px">
            <NInput v-model:value="search" placeholder="搜索书签..." clearable />
          </NInputGroup>
          <NSelect
            v-model:value="selectedCategory"
            :options="categoryOptions"
            style="width: 140px"
            placeholder="分类筛选"
            clearable
          />
        </NSpace>
        <NSpace>
          <NButton type="primary" @click="openAddModal">添加书签</NButton>
          <NButton @click="showCategoryModal = true">管理分类</NButton>
          <NButton @click="exportData">导出</NButton>
          <NButton @click="importData">导入</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <div class="bookmark-list" v-if="filteredBookmarks.length > 0">
      <NCard v-for="item in filteredBookmarks" :key="item.id" class="bookmark-card" hoverable>
        <NSpace align="center" justify="space-between">
          <div class="bookmark-info" @click="openUrl(item.url)">
            <NText strong style="font-size: 15px; cursor: pointer">{{ item.title }}</NText>
            <NText depth="3" style="font-size: 12px">{{ item.url }}</NText>
            <NText depth="3" style="font-size: 13px" v-if="item.description">
              {{ item.description }}
            </NText>
          </div>
          <NSpace align="center" :size="8">
            <NTag v-if="item.category" size="small" type="info">{{ item.category }}</NTag>
            <NButton size="small" quaternary @click="openEditModal(item)">编辑</NButton>
            <NPopconfirm @positive-click="deleteBookmark(item.id)">
              <template #trigger>
                <NButton size="small" quaternary type="error">删除</NButton>
              </template>
              确定删除此书签？
            </NPopconfirm>
          </NSpace>
        </NSpace>
      </NCard>
    </div>

    <NCard v-else style="margin-top: 16px">
      <NEmpty description="暂无书签，点击「添加书签」开始" />
    </NCard>

    <!-- 添加/编辑书签 Modal -->
    <NModal v-model:show="showModal" preset="dialog" :title="editingBookmark ? '编辑书签' : '添加书签'" style="width: 500px">
      <NText v-if="formError" type="error" style="margin-bottom: 8px; display: block">{{ formError }}</NText>
      <NForm label-placement="left" label-width="60">
        <NFormItem label="标题">
          <NInput v-model:value="form.title" placeholder="书签标题" />
        </NFormItem>
        <NFormItem label="URL">
          <NInput v-model:value="form.url" placeholder="https://" />
        </NFormItem>
        <NFormItem label="描述">
          <NInput v-model:value="form.description" type="textarea" placeholder="描述（可选）" :rows="2" />
        </NFormItem>
        <NFormItem label="分类">
          <NSelect
            v-model:value="form.category"
            :options="categories.map((c) => ({ label: c.name, value: c.name }))"
            placeholder="可选择或直接输入分类名"
            clearable
            tag
          />
        </NFormItem>
      </NForm>
      <template #action>
        <NSpace>
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" @click="saveBookmark">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 管理分类 Modal -->
    <NModal v-model:show="showCategoryModal" preset="dialog" title="管理分类" style="width: 400px">
      <NSpace vertical>
        <NInputGroup>
          <NInput v-model:value="newCategoryName" placeholder="分类名称" @keyup.enter="addCategory" />
          <NButton type="primary" @click="addCategory">添加</NButton>
        </NInputGroup>
        <NDivider style="margin: 8px 0" />
        <div v-for="cat in categories" :key="cat.id" class="category-item">
          <NText>{{ cat.name }}</NText>
          <NPopconfirm @positive-click="window.api.deleteCategory(cat.id).then(() => loadCategories())">
            <template #trigger>
              <NButton size="tiny" quaternary type="error">删除</NButton>
            </template>
            确定删除此分类？
          </NPopconfirm>
        </div>
        <NEmpty v-if="categories.length === 0" description="暂无分类" />
      </NSpace>
    </NModal>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
.bookmark-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bookmark-card {
  cursor: default;
}
.bookmark-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  flex: 1;
  min-width: 0;
}
.bookmark-info .n-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
</style>
