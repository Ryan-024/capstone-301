<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { FilterRange } from '../types'
import RangeFilter from './RangeFilter.vue'

defineProps<{ modelValue: FilterRange }>()
defineEmits<{ (e: 'update:modelValue', value: FilterRange): void }>()

const theme = useTheme()

function toggle() {
  theme.global.name.value =
    theme.global.name.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <v-app-bar color="surface" flat border>
    <template #prepend>
      <v-icon icon="mdi-chart-line-variant" class="ms-2" />
    </template>
    <v-app-bar-title>Content Analytics</v-app-bar-title>
    <template #append>
      <RangeFilter
        :model-value="modelValue"
        class="me-2"
        @update:model-value="(v: FilterRange) => $emit('update:modelValue', v)"
      />
      <v-btn
        :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        :aria-label="theme.global.current.value.dark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
      />
    </template>
  </v-app-bar>
</template>
