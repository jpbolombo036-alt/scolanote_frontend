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
  ListChecks
} from 'lucide-vue-next'

export const navItems = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Élèves', path: '/eleves', icon: Users },
  { name: 'Classes', path: '/salles', icon: Layers },
  { name: 'Niveaux', path: '/niveaux', icon: GraduationCap },
  { name: 'Matières', path: '/matieres', icon: BookOpen },
  { name: 'Bulletins', path: '/bulletins', icon: FileText },
  { name: 'Notes', path: '/notes', icon: Star },
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
  { name: 'Rôles', path: '/roles', icon: KeyRound }
]

export function isNavActive(path, currentPath) {
  return currentPath === path || currentPath.startsWith(path + '/')
}

export function getPageTitle(currentPath) {
  const current = navItems.find(item => isNavActive(item.path, currentPath))
  return current ? current.name : 'GestBulletin'
}
