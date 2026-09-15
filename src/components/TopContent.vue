<script setup lang="ts">
import type { ContentPiece } from '../types'
import { formatCurrency, formatNumber } from '../composables/theme'

const props = defineProps<{
  title: string
  icon: string
  items: (ContentPiece & { engagementScore?: number })[]
  mode: 'engagement' | 'revenue'
}>()

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function metricLabel(item: ContentPiece & { engagementScore?: number }): string {
  if (props.mode === 'revenue') return formatCurrency(item.adRevenue)
  return formatNumber(item.engagementScore ?? 0) + ' pts'
}

function metricSub(item: ContentPiece): string {
  if (props.mode === 'revenue') {
    return `${formatNumber(item.views.total)} views`
  }
  return `${formatNumber(item.engagement.likes)} likes · ${formatNumber(item.engagement.comments)} comments · ${formatNumber(item.engagement.shares)} shares`
}
</script>

<template>
  <v-card elevation="2" rounded="lg" class="h-100">
    <v-card-item>
      <v-card-title class="d-flex align-center">
        <v-icon :icon="icon" class="me-2" color="primary" />
        {{ title }}
      </v-card-title>
    </v-card-item>
    <v-list lines="two" density="comfortable">
      <template v-if="items.length === 0">
        <v-list-item>
          <v-list-item-title class="text-medium-emphasis">
            No content in this period.
          </v-list-item-title>
        </v-list-item>
      </template>
      <v-list-item
        v-for="(item, idx) in items"
        :key="item.id"
        :prepend-avatar="undefined"
      >
        <template #prepend>
          <v-avatar color="primary" variant="tonal" size="36" class="me-2">
            <span class="text-body-2 font-weight-bold">{{ idx + 1 }}</span>
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-medium">
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ metricSub(item) }} · {{ formatDuration(item.durationSeconds) }}
        </v-list-item-subtitle>
        <template #append>
          <div class="text-right">
            <div class="text-body-1 font-weight-bold">
              {{ metricLabel(item) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.publishDate }}
            </div>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>
