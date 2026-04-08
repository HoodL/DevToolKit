<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  NCard, NButton, NSpace, NSelect, NText, NSwitch, NGrid, NGi
} from 'naive-ui'
import * as monaco from 'monaco-editor'

const leftText = ref(`// 左侧文件 - 原始版本
function hello() {
  console.log("Hello World");
  return true;
}

const data = {
  name: "test",
  version: 1
};

export default data;`)

const rightText = ref(`// 左侧文件 - 修改版本
function hello(name: string) {
  console.log(\`Hello \${name}\`);
  return true;
}

const data = {
  name: "test",
  version: 2,
  author: "dev"
};

export default data;`)

const language = ref('javascript')
const diffMode = ref<'side-by-side' | 'inline'>('side-by-side')

const langOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C/C++', value: 'cpp' },
  { label: 'Go', value: 'go' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
  { label: '纯文本', value: 'plaintext' }
]

const modeOptions = [
  { label: '并排对比', value: 'side-by-side' },
  { label: '内联对比', value: 'inline' }
]

let editor: monaco.editor.IStandaloneDiffEditor | null = null
const editorContainer = ref<HTMLElement | null>(null)

function createEditor() {
  if (!editorContainer.value) return

  if (editor) {
    editor.dispose()
  }

  editor = monaco.editor.createDiffEditor(editorContainer.value, {
    theme: 'vs',
    renderSideBySide: diffMode.value === 'side-by-side',
    automaticLayout: true,
    readOnly: false,
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false
  })

  const originalModel = monaco.editor.createModel(leftText.value, language.value)
  const modifiedModel = monaco.editor.createModel(rightText.value, language.value)

  editor.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  // Listen for content changes
  editor.getOriginalEditor().onDidChangeModelContent(() => {
    leftText.value = editor!.getOriginalEditor().getValue()
  })
  editor.getModifiedEditor().onDidChangeModelContent(() => {
    rightText.value = editor!.getModifiedEditor().getValue()
  })
}

function swapContent() {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
  createEditor()
}

function clearAll() {
  leftText.value = ''
  rightText.value = ''
  createEditor()
}

watch([diffMode, language], () => {
  createEditor()
})

onMounted(() => {
  createEditor()
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<template>
  <div class="diff-tool">
    <h2 class="page-title">Diff 文件对比</h2>

    <NCard>
      <NSpace align="center" justify="space-between">
        <NSpace align="center" :size="16">
          <NSelect
            v-model:value="language"
            :options="langOptions"
            style="width: 140px"
          />
          <NSelect
            v-model:value="diffMode"
            :options="modeOptions"
            style="width: 140px"
          />
        </NSpace>
        <NSpace>
          <NButton @click="swapContent">交换左右</NButton>
          <NButton @click="clearAll">清空</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <div ref="editorContainer" class="diff-editor-container"></div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}
.diff-editor-container {
  margin-top: 16px;
  height: calc(100vh - 180px);
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
