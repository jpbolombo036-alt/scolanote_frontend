import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/Landing.vue'),
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
      { path: 'ecoles', component: () => import('@/pages/schools/SchoolsPage.vue') },
      { path: 'ecoles/form', component: () => import('@/pages/schools/SchoolFormPage.vue') },
      { path: 'ecoles/form/:id', component: () => import('@/pages/schools/SchoolFormPage.vue') },
      { path: 'annees-academiques', component: () => import('@/pages/academic-years/AcademicYearsPage.vue') },
      { path: 'annees-academiques/form', component: () => import('@/pages/academic-years/AcademicYearFormPage.vue') },
      { path: 'annees-academiques/form/:id', component: () => import('@/pages/academic-years/AcademicYearFormPage.vue') },
      { path: 'trimestres', component: () => import('@/pages/trimesters/TrimestersPage.vue') },
      { path: 'trimestres/form', component: () => import('@/pages/trimesters/TrimesterFormPage.vue') },
      { path: 'trimestres/form/:id', component: () => import('@/pages/trimesters/TrimesterFormPage.vue') },
      { path: 'periodes', component: () => import('@/pages/periods/PeriodsPage.vue') },
      { path: 'periodes/form', component: () => import('@/pages/periods/PeriodFormPage.vue') },
      { path: 'periodes/form/:id', component: () => import('@/pages/periods/PeriodFormPage.vue') },
      { path: 'salles', component: () => import('@/pages/classrooms/ClassroomsPage.vue') },
      { path: 'salles/form', component: () => import('@/pages/classrooms/ClassroomFormPage.vue') },
      { path: 'salles/form/:id', component: () => import('@/pages/classrooms/ClassroomFormPage.vue') },
      { path: 'niveaux', component: () => import('@/pages/levels/LevelsPage.vue') },
      { path: 'niveaux/form', component: () => import('@/pages/levels/LevelFormPage.vue') },
      { path: 'niveaux/form/:id', component: () => import('@/pages/levels/LevelFormPage.vue') },
      { path: 'matieres', component: () => import('@/pages/subjects/SubjectsPage.vue') },
      { path: 'matieres/form', component: () => import('@/pages/subjects/SubjectFormPage.vue') },
      { path: 'matieres/form/:id', component: () => import('@/pages/subjects/SubjectFormPage.vue') },
      { path: 'enseignants', component: () => import('@/pages/teachers/TeachersPage.vue') },
      { path: 'enseignants/form', component: () => import('@/pages/teachers/TeacherFormPage.vue') },
      { path: 'enseignants/form/:id', component: () => import('@/pages/teachers/TeacherFormPage.vue') },
      { path: 'eleves', component: () => import('@/pages/students/StudentsPage.vue') },
      { path: 'eleves/form', component: () => import('@/pages/students/StudentFormPage.vue') },
      { path: 'eleves/form/:id', component: () => import('@/pages/students/StudentFormPage.vue') },
      { path: 'inscriptions', component: () => import('@/pages/enrollments/EnrollmentsPage.vue') },
      { path: 'inscriptions/form', component: () => import('@/pages/enrollments/EnrollmentFormPage.vue') },
      { path: 'inscriptions/form/:id', component: () => import('@/pages/enrollments/EnrollmentFormPage.vue') },
      { path: 'attributions', component: () => import('@/pages/teaching-assignments/TeachingAssignmentsPage.vue') },
      { path: 'attributions/form', component: () => import('@/pages/teaching-assignments/TeachingAssignmentFormPage.vue') },
      { path: 'attributions/form/:id', component: () => import('@/pages/teaching-assignments/TeachingAssignmentFormPage.vue') },
      { path: 'types-evaluations', component: () => import('@/pages/assessment-types/AssessmentTypesPage.vue') },
      { path: 'types-evaluations/form', component: () => import('@/pages/assessment-types/AssessmentTypeFormPage.vue') },
      { path: 'types-evaluations/form/:id', component: () => import('@/pages/assessment-types/AssessmentTypeFormPage.vue') },
      { path: 'evaluations', component: () => import('@/pages/assessments/AssessmentsPage.vue') },
      { path: 'evaluations/form', component: () => import('@/pages/assessments/AssessmentFormPage.vue') },
      { path: 'evaluations/form/:id', component: () => import('@/pages/assessments/AssessmentFormPage.vue') },
      { path: 'notes', component: () => import('@/pages/grades/GradesPage.vue') },
      { path: 'notes/form', component: () => import('@/pages/grades/GradeFormPage.vue') },
      { path: 'notes/form/:id', component: () => import('@/pages/grades/GradeFormPage.vue') },
      { path: 'presences', component: () => import('@/pages/attendances/AttendancesPage.vue') },
      { path: 'presences/form', component: () => import('@/pages/attendances/AttendanceFormPage.vue') },
      { path: 'presences/form/:id', component: () => import('@/pages/attendances/AttendanceFormPage.vue') },
      { path: 'disciplines', component: () => import('@/pages/disciplines/DisciplinesPage.vue') },
      { path: 'disciplines/form', component: () => import('@/pages/disciplines/DisciplineFormPage.vue') },
      { path: 'disciplines/form/:id', component: () => import('@/pages/disciplines/DisciplineFormPage.vue') },
      { path: 'bulletins', component: () => import('@/pages/report-cards/ReportCardsPage.vue') },
      { path: 'bulletins/nouveau', component: () => import('@/pages/report-cards/ReportCardGenerateFormPage.vue') },
      { path: 'bulletins/:id', component: () => import('@/pages/report-cards/ReportCardDetailPage.vue') },
      { path: 'users', component: () => import('@/pages/users/UsersPage.vue') },
      { path: 'users/nouveau', component: () => import('@/pages/users/UserCreatePage.vue') },
      { path: 'roles', component: () => import('@/pages/roles/RolesPage.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.name === 'landing' && token) {
    return next('/dashboard')
  }

  if (to.meta.guest && token) {
    return next('/dashboard')
  }

  next()
})

export default router
