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

export interface NavItem {
  name: string
  path: string
  icon: any
  bottom?: boolean
  group?: string
  skipInGroups?: boolean
  requiredRoles?: string[]
  requiredPermissions?: string[]
}

export const navItems: NavItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, bottom: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT', 'AGENT'] },
  { name: 'Élèves', path: '/eleves', icon: Users, bottom: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['ELEVE_GERER'] },
  { name: 'Affectations', path: '/attributions', icon: ClipboardList, bottom: true, group: 'Personnes', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['AFFECTATION_GERER'] },
  { name: 'Bulletins', path: '/bulletins', icon: FileText, bottom: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['BULLETIN_GENERER'] },
  { name: 'Bulletins annuels', path: '/bulletins-annuels', icon: FileText, group: 'Évaluations', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['BULLETIN_ANNUEL_GENERER'] },
  { name: 'Notes', path: '/notes', icon: Star, bottom: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['NOTE_GERER'] },
  { name: 'Inscriptions', path: '/inscriptions', icon: FileSpreadsheet, bottom: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['INSCRIPTION_GERER'] },

  { name: 'Classes', path: '/salles', icon: Layers, group: 'Configuration', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['CLASSE_GERER'] },
  { name: 'Sections', path: '/sections', icon: Building2, group: 'Configuration', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Options', path: '/options', icon: Network, group: 'Configuration', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Programmes', path: '/programmes', icon: FileJson, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Matières de programme', path: '/matieres-programme', icon: Tags, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Matières', path: '/matieres', icon: BookOpen, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['MATIERE_GERER'] },
  { name: 'Évaluations', path: '/evaluations', icon: CheckSquare, group: 'Évaluations', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: "Types d'évaluations", path: '/types-evaluations', icon: ListChecks, group: 'Évaluations', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Enseignants', path: '/enseignants', icon: UserCheck, group: 'Personnes', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET'], requiredPermissions: ['ENSEIGNANT_GERER'] },
  { name: 'Présences', path: '/presences', icon: CheckCircle2, group: 'Suivi', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Disciplines', path: '/disciplines', icon: ShieldAlert, group: 'Suivi', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Écoles', path: '/ecoles', icon: School, group: 'Administration', requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Années scolaires', path: '/annees-academiques', icon: Calendar, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['ANNEE_GERER'] },
  { name: 'Trimestres', path: '/trimestres', icon: Clock, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['TRIMESTRE_GERER'] },
  { name: 'Périodes', path: '/periodes', icon: Layers, group: 'Structure', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'], requiredPermissions: ['PERIODE_GERER'] },
  { name: 'Rapports', path: '/rapports', icon: FileText, group: 'Rapports & Données', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Exports', path: '/exports', icon: FileJson, group: 'Rapports & Données', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Import / Export', path: '/imports', icon: FileSpreadsheet, group: 'Rapports & Données', requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT'] },
  { name: 'Sauvegardes', path: '/sauvegardes', icon: Network, group: 'Rapports & Données', requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { name: 'Utilisateurs', path: '/users', icon: UserCog, group: 'Personnes', requiredRoles: ['SUPER_ADMIN', 'ADMIN'], requiredPermissions: ['UTILISATEUR_GERER'] },
  { name: 'Rôles', path: '/roles', icon: KeyRound, group: 'Administration', requiredRoles: ['SUPER_ADMIN', 'ADMIN'], requiredPermissions: ['UTILISATEUR_GERER'] },

  { name: 'Mon profil', path: '/profil', icon: UserCog, skipInGroups: true, requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET', 'ENSEIGNANT', 'AGENT'] },
]

const DIRECTION_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'PREFET']

function hasAccess(item: NavItem, roles: string[] = [], permissions: string[] = []): boolean {
  const requiredRoles = item.requiredRoles ?? []
  const requiredPermissions = item.requiredPermissions ?? []

  if (requiredRoles.length === 0) {
    if (requiredPermissions.length === 0) {
      return true
    }
    if (permissions.some(p => requiredPermissions.includes(p))) {
      return true
    }
    if (roles.some(r => DIRECTION_ROLES.includes(r))) {
      return true
    }
    return false
  }
  if (roles.some(r => DIRECTION_ROLES.includes(r))) {
    return true
  }
  if (!roles.some(r => requiredRoles.includes(r))) {
    return false
  }
  if (requiredPermissions.length > 0) {
    if (permissions.some(p => requiredPermissions.includes(p))) {
      return true
    }
    if (roles.some(r => DIRECTION_ROLES.includes(r))) {
      return true
    }
    return false
  }
  return true
}

export function getBottomNavItems(roles: string[] = [], permissions: string[] = []) {
  return navItems.filter(i => i.bottom && hasAccess(i, roles, permissions))
}

export function isNavActive(path: string, currentPath: string) {
  return currentPath === path || currentPath.startsWith(path + '/')
}

export function getPageTitle(currentPath: string, roles: string[] = [], permissions: string[] = []) {
  const current = navItems.find(item => isNavActive(item.path, currentPath) && hasAccess(item, roles, permissions))
  return current ? current.name : 'GestBulletin'
}

export function filterNavItems(items: NavItem[], roles: string[] = [], permissions: string[] = []): NavItem[] {
  return items.filter(item => hasAccess(item, roles, permissions))
}

export function getFilteredNavItems(roles: string[] = [], permissions: string[] = []): NavItem[] {
  return filterNavItems(navItems, roles, permissions)
}

export function canAccessPath(path: string, roles: string[] = [], permissions: string[] = []): boolean {
  const normalizedPath = path.split('/')[1] ? '/' + path.split('/')[1] : path
  const item = navItems.find(nav => nav.path === normalizedPath || path.startsWith(nav.path + '/'))
  if (!item) return true
  return hasAccess(item, roles, permissions)
}

