<script setup lang="ts">
import type { FilterRange } from '../types'

defineProps<{ modelValue: FilterRange }>()
defineEmits<{ (e: 'update:modelValue', value: FilterRange): void }>()

const options: { label: string; value: FilterRange }[] = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '365 days', value: 365 }
]
</script>

<template>
  <v-btn-toggle
    :model-value="modelValue"
    mandatory
    density="comfortable"
    color="primary"
    variant="outlined"
    divided
    @update:model-value="(v: FilterRange) => $emit('update:modelValue', v)"
  >
    <v-btn
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      size="small"
    >
      {{ opt.label }}
    </v-btn>
  </v-btn-toggle>
</template>
