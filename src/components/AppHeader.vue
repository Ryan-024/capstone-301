<script setup lang="ts">
import { useTheme } from 'vuetify'

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
      <v-btn
        :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        :aria-label="theme.global.current.value.dark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
      />
    </template>
  </v-app-bar>
</template>
