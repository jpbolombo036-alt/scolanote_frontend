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
  { name: 'Affectations', path: '/attributions', icon: ClipboardList, bottom: true, group: 'Personnes' },
  { name: 'Bulletins', path: '/bulletins', icon: FileText, bottom: true },
  { name: 'Notes', path: '/notes', icon: Star, bottom: true },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet, bottom: true },

  // secondary / full sidebar
  // profile intentionally left out of primary/secondary lists to place at the end
  { name: 'Classes', path: '/salles', icon: Layers, group: 'Configuration' },
  { name: 'Sections', path: '/sections', icon: Building2, group: 'Configuration' },
  { name: 'Options', path: '/options', icon: Network, group: 'Configuration' },
  { name: 'Programmes', path: '/programmes', icon: FileJson, group: 'Structure' },
  { name: 'Matières de programme', path: '/matieres-programme', icon: Tags, group: 'Structure' },
  { name: 'Matières', path: '/matieres', icon: BookOpen, group: 'Structure' },
  { name: 'Évaluations', path: '/evaluations', icon: CheckSquare, group: 'Évaluations' },
  { name: "Types d'évaluations", path: '/types-evaluations', icon: ListChecks, group: 'Évaluations' },
  { name: 'Affectations', path: '/attributions', icon: ClipboardList, group: 'Personnes' },
  { name: 'Enseignants', path: '/enseignants', icon: UserCheck, group: 'Personnes' },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet },
  { name: 'Présences', path: '/presences', icon: CheckCircle2, group: 'Suivi' },
  { name: 'Disciplines', path: '/disciplines', icon: ShieldAlert, group: 'Suivi' },
  { name: 'Écoles', path: '/ecoles', icon: School, group: 'Administration' },
  { name: 'Années scolaires', path: '/annees-academiques', icon: Calendar, group: 'Structure' },
  { name: 'Trimestres', path: '/trimestres', icon: Clock, group: 'Structure' },
  { name: 'Périodes', path: '/periodes', icon: Layers, group: 'Structure' },
  { name: 'Rapports', path: '/rapports', icon: FileText, group: 'Rapports & Données' },
  { name: 'Exports', path: '/exports', icon: FileJson, group: 'Rapports & Données' },
  { name: 'Import / Export', path: '/imports', icon: FileSpreadsheet, group: 'Rapports & Données' },
  { name: 'Sauvegardes', path: '/sauvegardes', icon: Network, group: 'Rapports & Données' },
  { name: 'Utilisateurs', path: '/users', icon: UserCog, group: 'Personnes' },
  { name: 'Rôles', path: '/roles', icon: KeyRound, group: 'Administration' },

  // keep profile last
  { name: 'Mon profil', path: '/profil', icon: UserCog, skipInGroups: true }
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