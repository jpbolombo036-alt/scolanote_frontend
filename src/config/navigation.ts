import {
   LayoutDashboard,
   School,
   Calendar,
   Clock,
   Layers,
   BookOpen,
   UserCheck,
   Users,
   FileSpreadsheet,
   CheckSquare,
   Star,
   CheckCircle2,
   ShieldAlert,
   FileText,
   UserCog,
   KeyRound,
   GraduationCap,
   ClipboardList,
   ListChecks,
   Building2,
   Network,
   FileJson,
   Tags
 } from 'lucide-vue-next'

export const navItems = [
  // primary actions (shown in bottom nav on mobile)
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, bottom: true },
  { name: 'Élèves', path: '/eleves', icon: Users, bottom: true },
  { name: 'Niveaux', path: '/niveaux', icon: GraduationCap, bottom: true },
  { name: 'Sections', path: '/sections', icon: Building2, bottom: true },
  { name: 'Notes', path: '/notes', icon: Star, bottom: true },
  { name: 'Bulletins', path: '/bulletins', icon: FileText, bottom: true },

  // secondary / full sidebar
  // profile intentionally left out of primary/secondary lists to place at the end
  { name: 'Classes', path: '/salles', icon: Layers },
  { name: 'Options', path: '/options', icon: Network },
  { name: 'Programmes', path: '/programmes', icon: FileJson },
  { name: 'Matières de programme', path: '/matieres-programme', icon: Tags },
  { name: 'Matières', path: '/matieres', icon: BookOpen },
  { name: 'Évaluations', path: '/evaluations', icon: CheckSquare },
  { name: "Types d'évaluations", path: '/types-evaluations', icon: ListChecks },
  { name: 'Affectations', path: '/attributions', icon: ClipboardList },
  { name: 'Enseignants', path: '/enseignants', icon: UserCheck },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet },
  { name: 'Présences', path: '/presences', icon: CheckCircle2 },
  { name: 'Disciplines', path: '/disciplines', icon: ShieldAlert },
  { name: 'Écoles', path: '/ecoles', icon: School },
  { name: 'Années scolaires', path: '/annees-academiques', icon: Calendar },
  { name: 'Trimestres', path: '/trimestres', icon: Clock },
  { name: 'Périodes', path: '/periodes', icon: Layers },
  { name: 'Utilisateurs', path: '/users', icon: UserCog },
  { name: 'Rôles', path: '/roles', icon: KeyRound },

  // keep profile last
  { name: 'Mon profil', path: '/profil', icon: UserCog }
]

export function getBottomNavItems() {
  return navItems.filter(i => i.bottom)
}

export function isNavActive(path: string, currentPath: string) {
  return currentPath === path || currentPath.startsWith(path + '/')
}

export function getPageTitle(currentPath: string) {
  const current = navItems.find(item => isNavActive(item.path, currentPath))
  return current ? current.name : 'GestBulletin'
}