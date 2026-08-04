export interface DashboardResponse {
  stats: {
    students: number
    classrooms: number
    reportCards: number
    average: number
  }
  recentBulletins: BulletinItem[]
  mentions: MentionDistribution
  activities: ActivityItem[]
}

export interface MentionDistribution {
  tresBien: number
  bien: number
  assezBien: number
  passable: number
  insuffisant: number
  total: number
}

export interface ActivityItem {
  text: string
  time: string
  type: string
}

export interface BulletinItem {
  id: number
  student: string
  classe: string
  trimestre: string
  moyenne: number
  mention: string
  date: string
}