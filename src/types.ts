export interface ContentViews {
  unique: number
  subscriber: number
  total: number
  avgWatchTimeSeconds: number
}

export interface ContentEngagement {
  likes: number
  comments: number
  shares: number
}

export interface ContentDemographics {
  gender: Record<string, number>
  age: Record<string, number>
  location: Record<string, number>
}

export interface ContentPiece {
  id: string
  title: string
  publishDate: string
  durationSeconds: number
  views: ContentViews
  adRevenue: number
  engagement: ContentEngagement
  demographics: ContentDemographics
}

export interface MonthTotals {
  views: number
  uniqueViews: number
  subscriberViews: number
  adRevenue: number
  newSubscribers: number
  unsubscribes: number
  netSubscribers: number
  totalSubscribers: number
  likes: number
  comments: number
  shares: number
}

export interface MonthData {
  month: string
  monthNumber: number
  year: number
  totals: MonthTotals
  content: ContentPiece[]
}

export interface Dataset {
  channel: {
    name: string
    startingSubscribers: number
    endingSubscribers: number
  }
  year: number
  months: MonthData[]
}

export type FilterRange = 7 | 30 | 90 | 365
export type EngagementFilter = 'all' | 'likes' | 'comments' | 'shares'
export type ViewerFilter = 'gender' | 'age' | 'location'
