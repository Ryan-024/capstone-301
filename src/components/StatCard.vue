<script setup lang="ts">
import { computed } from 'vue'
import { pctChange } from '../composables/theme'

const props = defineProps<{
  title: string
  value: string
  current: number
  previous: number
  icon: string
  color?: string
}>()

const change = computed(() => pctChange(props.current, props.previous))
const isUp = computed(() => change.value >= 0)
const changeText = computed(() => {
  const sign = isUp.value ? '+' : ''
  return `${sign}${change.value.toFixed(1)}%`
})
</script>

<template>
  <v-card class="pa-2" elevation="2" rounded="lg">
    <v-card-item>
      <template #prepend>
        <v-avatar :color="color ?? 'primary'" variant="tonal" size="44">
          <v-icon :icon="icon" />
        </v-avatar>
      </template>
      <v-card-subtitle class="text-uppercase text-caption">
        {{ title }}
      </v-card-subtitle>
      <v-card-title class="text-h4 font-weight-bold pa-0 pt-1">
        {{ value }}
      </v-card-title>
      <div class="d-flex align-center mt-2">
        <v-icon
          :icon="isUp ? 'mdi-arrow-up-thick' : 'mdi-arrow-down-thick'"
          :color="isUp ? 'success' : 'error'"
          size="small"
        />
        <span
          :class="isUp ? 'text-success' : 'text-error'"
          class="text-body-2 font-weight-medium ms-1"
        >
          {{ changeText }}
        </span>
        <span class="text-caption text-medium-emphasis ms-2">
          vs previous period
        </span>
      </div>
    </v-card-item>
  </v-card>
</template>
