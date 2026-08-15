import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { canAccessPath } from '@/config/navigation'

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
      { path: 'sections', component: () => import('@/pages/sections/SectionsPage.vue') },
      { path: 'sections/form', component: () => import('@/pages/sections/SectionFormPage.vue') },
      { path: 'sections/form/:id', component: () => import('@/pages/sections/SectionFormPage.vue') },
      { path: 'options', component: () => import('@/pages/options/OptionsPage.vue') },
      { path: 'options/form', component: () => import('@/pages/options/OptionFormPage.vue') },
      { path: 'options/form/:id', component: () => import('@/pages/options/OptionFormPage.vue') },
      { path: 'programmes', component: () => import('@/pages/curriculums/CurriculumsPage.vue') },
      { path: 'programmes/form', component: () => import('@/pages/curriculums/CurriculumFormPage.vue') },
      { path: 'programmes/form/:id', component: () => import('@/pages/curriculums/CurriculumFormPage.vue') },
      { path: 'matieres-programme', component: () => import('@/pages/curriculum-subjects/CurriculumSubjectsPage.vue') },
      { path: 'matieres-programme/form', component: () => import('@/pages/curriculum-subjects/CurriculumSubjectFormPage.vue') },
      { path: 'matieres-programme/form/:id', component: () => import('@/pages/curriculum-subjects/CurriculumSubjectFormPage.vue') },
      { path: 'mot-de-passe-oublie', component: () => import('@/pages/auth/ForgotPasswordPage.vue'), meta: { guest: true } },
      { path: 'reinitialiser-mot-de-passe', component: () => import('@/pages/auth/ResetPasswordPage.vue'), meta: { guest: true } },
      { path: 'matieres', component: () => import('@/pages/subjects/SubjectsPage.vue') },
      { path: 'matieres/form', component: () => import('@/pages/subjects/SubjectFormPage.vue') },
      { path: 'matieres/form/:id', component: () => import('@/pages/subjects/SubjectFormPage.vue') },
      { path: 'enseignants', component: () => import('@/pages/teachers/TeachersPage.vue') },
      { path: 'enseignants/form', component: () => import('@/pages/teachers/TeacherFormPage.vue') },
      { path: 'enseignants/form/:id', component: () => import('@/pages/teachers/TeacherFormPage.vue') },
      { path: 'enseignants/:id', component: () => import('@/pages/teachers/TeacherDetailPage.vue') },
      { path: 'eleves', component: () => import('@/pages/students/StudentsPage.vue') },
      { path: 'eleves/form', component: () => import('@/pages/students/StudentFormPage.vue') },
      { path: 'eleves/form/:id', component: () => import('@/pages/students/StudentFormPage.vue') },
      { path: 'eleves/:id', component: () => import('@/pages/students/StudentDetailPage.vue') },
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
      { path: 'bulletins/mes-bulletins', name: 'mes-bulletins', component: () => import('@/pages/report-cards/MyReportCardsPage.vue') },
      { path: 'bulletins/nouveau', component: () => import('@/pages/report-cards/ReportCardGenerateFormPage.vue') },
      { path: 'bulletins/:id', component: () => import('@/pages/report-cards/ReportCardDetailPage.vue') },
      { path: 'bulletins-annuels', component: () => import('@/pages/report-cards/annual/AnnualReportCardsPage.vue') },
      { path: 'bulletins-annuels/:id', component: () => import('@/pages/report-cards/annual/AnnualReportCardDetailPage.vue') },
      { path: 'bulletins-annuels/nouveau', component: () => import('@/pages/report-cards/annual/AnnualReportCardGenerateFormPage.vue') },
      { path: 'rapports', component: () => import('@/pages/admin/ReportsPage.vue') },
      { path: 'exports', component: () => import('@/pages/admin/ExportsPage.vue') },
      { path: 'imports', component: () => import('@/pages/admin/ImportsPage.vue') },
      { path: 'sauvegardes', component: () => import('@/pages/admin/BackupsPage.vue') },
      { path: 'profil', name: 'profile', component: () => import('@/pages/profile/ProfilePage.vue') },
      { path: 'users', component: () => import('@/pages/users/UsersPage.vue') },
      { path: 'users/nouveau', component: () => import('@/pages/users/UserCreatePage.vue') },
      { path: 'roles', component: () => import('@/pages/roles/RolesPage.vue') }
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
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

  // Après un rafraîchissement du navigateur, le token est conservé dans
  // localStorage mais les rôles/permissions ne sont pas encore chargés.
  // Sans ce rechargement, le sidebar (et la navigation) restent vides.
  if (token && to.meta.requiresAuth && !authStore.sessionLoaded) {
    await authStore.fetchProfile()
    // Session expirée/invalide pendant le rechargement : retour au login
    if (!authStore.isAuthenticated) {
      return next('/login')
    }
  }

  next()
})

export default router
