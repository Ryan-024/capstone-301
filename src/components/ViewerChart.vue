<script setup lang="ts">
import { computed, ref } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { useTheme } from 'vuetify'
import type { ViewerFilter } from '../types'
import { palette, seriesColors, formatNumber } from '../composables/theme'

const props = defineProps<{
  breakdown: {
    gender: Record<string, number>
    age: Record<string, number>
    location: Record<string, number>
  }
}>()

const theme = useTheme()
const filter = ref<ViewerFilter>('gender')

const options: { label: string; value: ViewerFilter }[] = [
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Location', value: 'location' }
]

const gridColor = computed(() =>
  theme.global.current.value.dark ? palette.gridDark : palette.gridLight
)
const textColor = computed(() =>
  theme.global.current.value.dark ? palette.textDark : palette.textLight
)

const activeData = computed(() => props.breakdown[filter.value])

const labelMap: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  non_binary: 'Non-binary'
}

const sortedEntries = computed(() => {
  const entries = Object.entries(activeData.value)
  if (filter.value === 'age') {
    // Preserve numeric age bucket order
    const order = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
    return entries.sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0])
    )
  }
  return entries.sort((a, b) => b[1] - a[1])
})

const doughnutData = computed<ChartData<'doughnut'>>(() => ({
  labels: sortedEntries.value.map(([k]) => labelMap[k] ?? k),
  datasets: [
    {
      data: sortedEntries.value.map(([, v]) => v),
      backgroundColor: seriesColors,
      borderColor: theme.global.current.value.dark ? '#1e293b' : '#ffffff',
      borderWidth: 2
    }
  ]
}))

const barData = computed<ChartData<'bar'>>(() => ({
  labels: sortedEntries.value.map(([k]) => labelMap[k] ?? k),
  datasets: [
    {
      label: 'Unique Viewers',
      data: sortedEntries.value.map(([, v]) => v),
      backgroundColor: sortedEntries.value.map(
        (_, i) => seriesColors[i % seriesColors.length]
      ),
      borderRadius: 6
    }
  ]
}))

const doughnutOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: textColor.value, usePointStyle: true }
    },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.label}: ${formatNumber(Number(ctx.parsed))}`
      }
    }
  }
}))

const barOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => formatNumber(Number(ctx.parsed.x))
      }
    }
  },
  scales: {
    x: {
      grid: { color: gridColor.value },
      ticks: {
        color: textColor.value,
        callback: (v) => formatNumber(Number(v))
      },
      beginAtZero: true
    },
    y: {
      grid: { color: gridColor.value },
      ticks: { color: textColor.value }
    }
  }
}))

const useBar = computed(() => filter.value === 'location')
</script>

<template>
  <v-card elevation="2" rounded="lg" class="h-100">
    <v-card-item>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-account-group" class="me-2" color="primary" />
        Viewer Breakdown
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
        <Bar v-if="useBar" :data="barData" :options="barOptions" />
        <Doughnut v-else :data="doughnutData" :options="doughnutOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>
