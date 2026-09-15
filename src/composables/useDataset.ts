import { computed, ref } from 'vue'
import raw from '../datametrics.json'
import type {
  ContentPiece,
  Dataset,
  FilterRange,
  MonthData
} from '../types'

const dataset = raw as Dataset

// Reference "now" for filtering. The dataset covers all of 2025, so anchor
// today to the last day with data so ranges are meaningful.
const REFERENCE_DATE = new Date('2025-12-31T23:59:59Z')

const selectedRange = ref<FilterRange>(30)

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

function windowStart(days: number): Date {
  const d = new Date(REFERENCE_DATE)
  d.setUTCDate(d.getUTCDate() - days + 1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function collectContent(start: Date, end: Date): ContentPiece[] {
  const items: ContentPiece[] = []
  for (const month of dataset.months) {
    for (const piece of month.content) {
      const publish = new Date(piece.publishDate + 'T00:00:00Z')
      if (publish >= start && publish <= end) {
        items.push(piece)
      }
    }
  }
  return items
}

function sumDemographics(
  content: ContentPiece[],
  key: 'gender' | 'age' | 'location'
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const c of content) {
    for (const [k, v] of Object.entries(c.demographics[key])) {
      out[k] = (out[k] ?? 0) + v
    }
  }
  return out
}

export interface PeriodAggregate {
  content: ContentPiece[]
  totalViews: number
  uniqueViews: number
  subscriberViews: number
  adRevenue: number
  likes: number
  comments: number
  shares: number
  netSubscribers: number
}

function aggregate(content: ContentPiece[], months: MonthData[]): PeriodAggregate {
  const totalViews = content.reduce((s, c) => s + c.views.total, 0)
  const uniqueViews = content.reduce((s, c) => s + c.views.unique, 0)
  const subscriberViews = content.reduce((s, c) => s + c.views.subscriber, 0)
  const adRevenue = content.reduce((s, c) => s + c.adRevenue, 0)
  const likes = content.reduce((s, c) => s + c.engagement.likes, 0)
  const comments = content.reduce((s, c) => s + c.engagement.comments, 0)
  const shares = content.reduce((s, c) => s + c.engagement.shares, 0)
  // Approximate net subscribers proportionally to unique views in the window.
  // Use monthly netSubscribers scaled by window's share of that month's uniqueViews.
  let netSubscribers = 0
  for (const month of months) {
    const monthUnique = month.totals.uniqueViews
    if (monthUnique === 0) continue
    const monthContentInWindow = content.filter((c) => {
      const pd = new Date(c.publishDate + 'T00:00:00Z')
      return pd.getUTCMonth() + 1 === month.monthNumber && pd.getUTCFullYear() === month.year
    })
    const windowUnique = monthContentInWindow.reduce((s, c) => s + c.views.unique, 0)
    netSubscribers += (windowUnique / monthUnique) * month.totals.netSubscribers
  }
  return {
    content,
    totalViews,
    uniqueViews,
    subscriberViews,
    adRevenue: Math.round(adRevenue * 100) / 100,
    likes,
    comments,
    shares,
    netSubscribers: Math.round(netSubscribers)
  }
}

export function useDataset() {
  const currentStart = computed(() => windowStart(selectedRange.value))
  const currentEnd = computed(() => REFERENCE_DATE)

  const previousEnd = computed(() => {
    const d = new Date(currentStart.value)
    d.setUTCDate(d.getUTCDate() - 1)
    d.setUTCHours(23, 59, 59, 999)
    return d
  })
  const previousStart = computed(() => {
    const d = new Date(previousEnd.value)
    d.setUTCDate(d.getUTCDate() - selectedRange.value + 1)
    d.setUTCHours(0, 0, 0, 0)
    return d
  })

  const currentContent = computed(() =>
    collectContent(currentStart.value, currentEnd.value)
  )
  const previousContent = computed(() =>
    collectContent(previousStart.value, previousEnd.value)
  )

  const current = computed<PeriodAggregate>(() =>
    aggregate(currentContent.value, dataset.months)
  )
  const previous = computed<PeriodAggregate>(() =>
    aggregate(previousContent.value, dataset.months)
  )

  const engagementSeries = computed(() => {
    // Bucket the current window into ~10-20 buckets by day
    const days = selectedRange.value
    const bucketCount = days <= 7 ? days : days <= 30 ? days : days <= 90 ? 12 : 12
    const bucketSize = Math.max(1, Math.ceil(days / bucketCount))
    const buckets: {
      label: string
      likes: number
      comments: number
      shares: number
    }[] = []
    for (let i = 0; i < bucketCount; i++) {
      const bStart = new Date(currentStart.value)
      bStart.setUTCDate(bStart.getUTCDate() + i * bucketSize)
      const bEnd = new Date(bStart)
      bEnd.setUTCDate(bEnd.getUTCDate() + bucketSize - 1)
      bEnd.setUTCHours(23, 59, 59, 999)
      if (bStart > currentEnd.value) break
      const items = currentContent.value.filter((c) => {
        const pd = new Date(c.publishDate + 'T00:00:00Z')
        return pd >= bStart && pd <= bEnd
      })
      const label =
        days <= 30
          ? `${bStart.getUTCMonth() + 1}/${bStart.getUTCDate()}`
          : `${bStart.getUTCMonth() + 1}/${bStart.getUTCDate()}`
      buckets.push({
        label,
        likes: items.reduce((s, c) => s + c.engagement.likes, 0),
        comments: items.reduce((s, c) => s + c.engagement.comments, 0),
        shares: items.reduce((s, c) => s + c.engagement.shares, 0)
      })
    }
    return buckets
  })

  const viewerBreakdown = computed(() => ({
    gender: sumDemographics(currentContent.value, 'gender'),
    age: sumDemographics(currentContent.value, 'age'),
    location: sumDemographics(currentContent.value, 'location')
  }))

  const topByEngagement = computed(() =>
    [...currentContent.value]
      .map((c) => ({
        ...c,
        engagementScore:
          c.engagement.likes + c.engagement.comments * 3 + c.engagement.shares * 5
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 5)
  )

  const topByRevenue = computed(() =>
    [...currentContent.value]
      .filter((c) => c.adRevenue > 0)
      .sort((a, b) => b.adRevenue - a.adRevenue)
      .slice(0, 5)
  )

  return {
    dataset,
    selectedRange,
    current,
    previous,
    engagementSeries,
    viewerBreakdown,
    topByEngagement,
    topByRevenue,
    referenceDate: REFERENCE_DATE,
    daysBetween
  }
}
