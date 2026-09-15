<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { useTheme } from 'vuetify'
import type { EngagementFilter } from '../types'
import { palette } from '../composables/theme'

const props = defineProps<{
  series: { label: string; likes: number; comments: number; shares: number }[]
}>()

const theme = useTheme()
const filter = ref<EngagementFilter>('all')

const options: { label: string; value: EngagementFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Likes', value: 'likes' },
  { label: 'Comments', value: 'comments' },
  { label: 'Shares', value: 'shares' }
]

const gridColor = computed(() =>
  theme.global.current.value.dark ? palette.gridDark : palette.gridLight
)
const textColor = computed(() =>
  theme.global.current.value.dark ? palette.textDark : palette.textLight
)

function makeDataset(
  label: string,
  data: number[],
  color: string
) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + '33',
    tension: 0.35,
    fill: true,
    pointRadius: 2,
    pointHoverRadius: 5,
    borderWidth: 2
  }
}

const chartData = computed<ChartData<'line'>>(() => {
  const labels = props.series.map((s) => s.label)
  const datasets = []
  if (filter.value === 'all' || filter.value === 'likes') {
    datasets.push(
      makeDataset('Likes', props.series.map((s) => s.likes), palette.primary)
    )
  }
  if (filter.value === 'all' || filter.value === 'comments') {
    datasets.push(
      makeDataset('Comments', props.series.map((s) => s.comments), palette.tertiary)
    )
  }
  if (filter.value === 'all' || filter.value === 'shares') {
    datasets.push(
      makeDataset('Shares', props.series.map((s) => s.shares), palette.quaternary)
    )
  }
  return { labels, datasets }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: textColor.value, usePointStyle: true }
    },
    tooltip: {
      backgroundColor: theme.global.current.value.dark ? '#1e293b' : '#ffffff',
      titleColor: textColor.value,
      bodyColor: textColor.value,
      borderColor: gridColor.value,
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { color: gridColor.value },
      ticks: { color: textColor.value }
    },
    y: {
      grid: { color: gridColor.value },
      ticks: { color: textColor.value },
      beginAtZero: true
    }
  }
}))
</script>

<template>
  <v-card elevation="2" rounded="lg" class="h-100">
    <v-card-item>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-heart-pulse" class="me-2" color="primary" />
        Engagement Over Time
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-btn-toggle
        v-model="filter"
        mandatory
        density="comfortable"
        variant="outlined"
        color="primary"
        divided
        class="mb-4"
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
      <div style="height: 320px;">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>
