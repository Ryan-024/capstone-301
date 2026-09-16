<script setup lang="ts">
import { useDataset } from './composables/useDataset'
import { formatCurrency, formatNumber } from './composables/theme'
import AppHeader from './components/AppHeader.vue'
import StatCard from './components/StatCard.vue'
import EngagementChart from './components/EngagementChart.vue'
import ViewerChart from './components/ViewerChart.vue'
import TopContent from './components/TopContent.vue'

const {
  selectedRange,
  current,
  previous,
  engagementSeries,
  viewerBreakdown,
  topByEngagement,
  topByRevenue
} = useDataset()
</script>

<template>
  <v-app>
    <AppHeader v-model="selectedRange" />

    <v-main>
      <v-container class="py-6" fluid>
        <!-- KPI cards -->
        <v-row>
          <v-col cols="12" md="4">
            <StatCard
              title="Overall Views"
              icon="mdi-eye-outline"
              :value="formatNumber(current.totalViews)"
              :current="current.totalViews"
              :previous="previous.totalViews"
            />
          </v-col>
          <v-col cols="12" md="4">
            <StatCard
              title="Ad Revenue"
              icon="mdi-currency-usd"
              color="secondary"
              :value="formatCurrency(current.adRevenue)"
              :current="current.adRevenue"
              :previous="previous.adRevenue"
            />
          </v-col>
          <v-col cols="12" md="4">
            <StatCard
              title="Net Subscribers"
              icon="mdi-account-plus-outline"
              color="tertiary"
              :value="formatNumber(current.netSubscribers)"
              :current="current.netSubscribers"
              :previous="previous.netSubscribers"
            />
          </v-col>
        </v-row>

        <!-- Charts -->
        <v-row class="mt-2">
          <v-col cols="12" md="7">
            <EngagementChart :series="engagementSeries" />
          </v-col>
          <v-col cols="12" md="5">
            <ViewerChart :breakdown="viewerBreakdown" />
          </v-col>
        </v-row>

        <!-- Top content lists -->
        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <TopContent
              title="Top 5 by Engagement"
              icon="mdi-fire"
              mode="engagement"
              :items="topByEngagement"
            />
          </v-col>
          <v-col cols="12" md="6">
            <TopContent
              title="Top 5 by Ad Revenue"
              icon="mdi-cash-multiple"
              mode="revenue"
              :items="topByRevenue"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
html,
body,
#app {
  min-height: 100vh;
}
</style>
