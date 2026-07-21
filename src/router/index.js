import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('@/pages/Login.vue'), meta: { guest: true } },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
      { path: 'ecoles', component: () => import('@/pages/schools/SchoolsPage.vue') },
      { path: 'annees-academiques', component: () => import('@/pages/academic-years/AcademicYearsPage.vue') },
      { path: 'trimestres', component: () => import('@/pages/trimesters/TrimestersPage.vue') },
      { path: 'periodes', component: () => import('@/pages/periods/PeriodsPage.vue') },
      { path: 'salles', component: () => import('@/pages/classrooms/ClassroomsPage.vue') },
      { path: 'matieres', component: () => import('@/pages/subjects/SubjectsPage.vue') },
      { path: 'enseignants', component: () => import('@/pages/teachers/TeachersPage.vue') },
      { path: 'eleves', component: () => import('@/pages/students/StudentsPage.vue') },
      { path: 'inscriptions', component: () => import('@/pages/enrollments/EnrollmentsPage.vue') },
      { path: 'attributions', component: () => import('@/pages/teaching-assignments/TeachingAssignmentsPage.vue') },
      { path: 'types-evaluations', component: () => import('@/pages/assessment-types/AssessmentTypesPage.vue') },
      { path: 'evaluations', component: () => import('@/pages/assessments/AssessmentsPage.vue') },
      { path: 'notes', component: () => import('@/pages/grades/GradesPage.vue') },
      { path: 'presences', component: () => import('@/pages/attendances/AttendancesPage.vue') },
      { path: 'disciplines', component: () => import('@/pages/disciplines/DisciplinesPage.vue') },
      { path: 'bulletins', component: () => import('@/pages/report-cards/ReportCardsPage.vue') },
      { path: 'bulletins/:id', component: () => import('@/pages/report-cards/ReportCardDetailPage.vue') },
      { path: 'users', component: () => import('@/pages/users/UsersPage.vue') },
      { path: 'roles', component: () => import('@/pages/roles/RolesPage.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) return next('/login')
  if (to.meta.guest && token) return next('/dashboard')
  next()
})

export default router
