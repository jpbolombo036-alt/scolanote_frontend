<template>
  <div class="min-h-screen bg-white font-sans text-ink">
    <!-- HEADER -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4">
        <router-link to="/" class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/25">
            <GraduationCap class="w-5 h-5 text-white" />
          </div>
          <div class="leading-tight">
            <p class="text-base font-bold text-brand-600">GestBulletin</p>
            <p class="text-[11px] text-ink-soft hidden sm:block">Gestion de bulletins scolaires</p>
          </div>
        </router-link>

        <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-soft">
          <a href="#accueil" class="text-brand-500 relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-brand-500 after:rounded-full">Accueil</a>
          <a href="#fonctionnalites" class="hover:text-brand-500 transition">Fonctionnalités</a>
          <a href="#avantages" class="hover:text-brand-500 transition">Avantages</a>
          <a href="#tarifs" class="hover:text-brand-500 transition">Tarifs</a>
          <a href="#apropos" class="hover:text-brand-500 transition">À propos</a>
          <a href="#contact" class="hover:text-brand-500 transition">Contact</a>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <router-link
            to="/login"
            class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-brand-600 border border-brand-500 rounded-lg hover:bg-brand-50 transition"
          >
            Se connecter
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-md shadow-brand-500/25 transition"
          >
            Demander une démo
          </router-link>
          <button
            class="lg:hidden p-2 rounded-lg text-ink-soft hover:bg-slate-100"
            @click="mobileOpen = !mobileOpen"
            aria-label="Menu"
          >
            <Menu v-if="!mobileOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" class="block py-2 text-sm font-medium text-ink-soft" @click="mobileOpen = false">
          {{ link.label }}
        </a>
        <router-link to="/login" class="block py-2 text-sm font-semibold text-brand-600" @click="mobileOpen = false">Se connecter</router-link>
      </div>
    </header>

    <!-- HERO -->
    <section id="accueil" class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight">
              La gestion scolaire simple, efficace et
              <span class="text-brand-500">intelligente</span>
            </h1>
            <p class="mt-5 text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              GestBulletin centralise notes, bulletins, classes et élèves dans une plateforme moderne pensée pour les établissements scolaires.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <router-link
                to="/login"
                class="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition"
              >
                <Rocket class="w-4 h-4" />
                Commencer maintenant
              </router-link>
              <a
                href="#fonctionnalites"
                class="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-brand-500 text-brand-600 font-semibold text-sm hover:bg-brand-50 transition"
              >
                <PlayCircle class="w-4 h-4" />
                Voir la vidéo
              </a>
            </div>

            <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink">
              <span class="inline-flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" /> Facile à utiliser
              </span>
              <span class="inline-flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" /> Sécurisé
              </span>
              <span class="inline-flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500" /> Accessible partout
              </span>
            </div>
          </div>

          <!-- Hero visual -->
          <div class="relative flex justify-center lg:justify-end">
            <div class="absolute right-0 top-8 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-500/90 -z-0"></div>
            <div class="absolute right-8 top-16 w-24 h-24 opacity-30" style="background-image: radial-gradient(circle, #fff 1.5px, transparent 1.5px); background-size: 12px 12px;"></div>

            <div class="relative z-10 w-full max-w-md">
              <!-- Woman + laptop composition -->
              <div class="relative bg-gradient-to-b from-slate-100 to-white rounded-3xl p-6 shadow-soft border border-slate-100">
                <div class="flex items-end gap-4">
                  <div class="flex-1">
                    <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-brand-100 mx-auto mb-3 shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces"
                        alt="Professionnelle GestBulletin"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <!-- Laptop mockup -->
                    <div class="bg-slate-800 rounded-t-lg p-1.5 shadow-xl">
                      <div class="bg-white rounded-md overflow-hidden aspect-[16/10]">
                        <div class="flex h-full">
                          <div class="w-1/4 bg-brand-600 p-1.5 space-y-1">
                            <div class="h-1.5 w-8 bg-white/80 rounded"></div>
                            <div class="h-1 w-full bg-white/30 rounded"></div>
                            <div class="h-1 w-full bg-white/20 rounded"></div>
                            <div class="h-1 w-full bg-white/20 rounded"></div>
                          </div>
                          <div class="flex-1 p-2 space-y-1.5">
                            <div class="grid grid-cols-3 gap-1">
                              <div class="bg-brand-50 rounded p-1">
                                <p class="text-[6px] text-brand-600 font-bold">1 254</p>
                                <p class="text-[5px] text-ink-muted">Élèves</p>
                              </div>
                              <div class="bg-emerald-50 rounded p-1">
                                <p class="text-[6px] text-emerald-600 font-bold">48</p>
                                <p class="text-[5px] text-ink-muted">Classes</p>
                              </div>
                              <div class="bg-amber-50 rounded p-1">
                                <p class="text-[6px] text-amber-600 font-bold">890</p>
                                <p class="text-[5px] text-ink-muted">Bulletins</p>
                              </div>
                            </div>
                            <div class="h-8 bg-gradient-to-r from-brand-100 to-brand-50 rounded flex items-end gap-0.5 px-1 pb-1">
                              <div class="w-1 bg-brand-400 rounded-t" style="height:40%"></div>
                              <div class="w-1 bg-brand-500 rounded-t" style="height:65%"></div>
                              <div class="w-1 bg-brand-400 rounded-t" style="height:50%"></div>
                              <div class="w-1 bg-brand-600 rounded-t" style="height:80%"></div>
                              <div class="w-1 bg-brand-400 rounded-t" style="height:55%"></div>
                              <div class="w-1 bg-brand-500 rounded-t" style="height:70%"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="h-2 bg-slate-700 rounded-b-lg mx-auto" style="width:108%"></div>
                  </div>
                  <!-- Plant + books -->
                  <div class="pb-4 shrink-0">
                    <div class="w-8 h-10 bg-emerald-500 rounded-t-full mx-auto"></div>
                    <div class="w-6 h-5 bg-white border border-slate-200 rounded-sm mx-auto -mt-1"></div>
                    <div class="mt-2 space-y-0.5">
                      <div class="w-10 h-2 bg-brand-600 rounded-sm"></div>
                      <div class="w-10 h-2 bg-brand-400 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURE HIGHLIGHTS BAR -->
    <section id="avantages" class="relative z-10 -mt-4 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-soft border border-slate-100 px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div v-for="item in highlights" :key="item.title" class="flex items-start gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', item.bg]">
            <component :is="item.icon" :class="['w-5 h-5', item.color]" />
          </div>
          <div>
            <p class="text-sm font-bold text-ink">{{ item.title }}</p>
            <p class="text-xs text-ink-soft mt-0.5 leading-snug">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES GRID -->
    <section id="fonctionnalites" class="py-16 lg:py-24 bg-[#F8F9FA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <p class="text-xs font-bold tracking-widest uppercase text-brand-500 mb-2">Fonctionnalités</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-ink">Tout ce dont vous avez besoin</h2>
          <p class="mt-3 text-ink-soft">
            Une suite complète pour piloter notes, classes, bulletins et utilisateurs au quotidien.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="bg-white rounded-2xl border border-slate-100 shadow-card p-6 text-center hover:-translate-y-1 transition duration-200"
          >
            <div class="w-14 h-14 mx-auto rounded-full bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30 mb-4">
              <component :is="feat.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-sm font-bold text-ink mb-2">{{ feat.title }}</h3>
            <p class="text-xs text-ink-soft leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TARIFS -->
    <section id="tarifs" class="py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-xs font-bold tracking-widest uppercase text-brand-500 mb-2">Tarifs</p>
        <h2 class="text-3xl font-extrabold text-ink mb-3">Un plan adapté à votre établissement</h2>
        <p class="text-ink-soft max-w-xl mx-auto mb-10">
          Contactez-nous pour une démonstration personnalisée et une offre sur mesure.
        </p>
        <div class="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          <div class="rounded-2xl border border-slate-100 shadow-card p-6">
            <p class="text-sm font-bold text-brand-500 mb-1">Essentiel</p>
            <p class="text-3xl font-extrabold text-ink mb-2">Gratuit</p>
            <p class="text-xs text-ink-soft mb-4">Pour découvrir la plateforme</p>
            <router-link to="/login" class="block text-center py-2.5 rounded-lg border border-brand-500 text-brand-600 text-sm font-semibold hover:bg-brand-50">Commencer</router-link>
          </div>
          <div class="rounded-2xl border-2 border-brand-500 shadow-soft p-6 relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">POPULAIRE</span>
            <p class="text-sm font-bold text-brand-500 mb-1">Professionnel</p>
            <p class="text-3xl font-extrabold text-ink mb-2">Sur devis</p>
            <p class="text-xs text-ink-soft mb-4">Établissement complet</p>
            <router-link to="/login" class="block text-center py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600">Demander une démo</router-link>
          </div>
          <div class="rounded-2xl border border-slate-100 shadow-card p-6">
            <p class="text-sm font-bold text-brand-500 mb-1">Groupe scolaire</p>
            <p class="text-3xl font-extrabold text-ink mb-2">Custom</p>
            <p class="text-xs text-ink-soft mb-4">Multi-établissements</p>
            <a href="#contact" class="block text-center py-2.5 rounded-lg border border-brand-500 text-brand-600 text-sm font-semibold hover:bg-brand-50">Nous contacter</a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section id="contact" class="bg-brand-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="flex items-start gap-4 text-center lg:text-left">
          <div class="hidden sm:flex w-12 h-12 rounded-xl bg-white/15 items-center justify-center shrink-0">
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-white">Prêt à révolutionner la gestion de votre école ?</h3>
            <p class="text-sm text-blue-100 mt-1">Rejoignez les établissements qui simplifient déjà leurs bulletins avec GestBulletin.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <router-link
            to="/login"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-brand-600 font-semibold text-sm hover:bg-brand-50 transition"
          >
            <Calendar class="w-4 h-4" />
            Demander une démo
          </router-link>
          <a
            href="#fonctionnalites"
            class="inline-flex items-center gap-1 px-5 py-3 rounded-lg border border-white/60 text-white font-semibold text-sm hover:bg-white/10 transition"
          >
            En savoir plus
            <ChevronRight class="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer id="apropos" class="bg-white border-t border-slate-100 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap class="w-4 h-4 text-white" />
          </div>
          <span class="font-semibold text-ink">GestBulletin</span>
        </div>
        <p>© {{ year }} GestBulletin. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  GraduationCap,
  Menu,
  X,
  Rocket,
  PlayCircle,
  CheckCircle2,
  LayoutDashboard,
  Shield,
  Zap,
  Cloud,
  BarChart3,
  Users,
  BookOpen,
  Pencil,
  Printer,
  Bell,
  Calendar,
  ChevronRight
} from 'lucide-vue-next'

const mobileOpen = ref(false)
const year = new Date().getFullYear()

const navLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#avantages', label: 'Avantages' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#apropos', label: 'À propos' },
  { href: '#contact', label: 'Contact' }
]

const highlights = [
  { title: 'Tableau de bord complet', desc: 'Vue claire de vos indicateurs clés', icon: LayoutDashboard, bg: 'bg-blue-100', color: 'text-blue-600' },
  { title: 'Sécurité renforcée', desc: 'Données protégées et accès contrôlés', icon: Shield, bg: 'bg-emerald-100', color: 'text-emerald-600' },
  { title: 'Gain de temps', desc: 'Automatisez notes et bulletins', icon: Zap, bg: 'bg-amber-100', color: 'text-amber-600' },
  { title: 'Accessible partout', desc: 'Depuis le bureau ou en mobilité', icon: Cloud, bg: 'bg-violet-100', color: 'text-violet-600' },
  { title: 'Rapports détaillés', desc: 'Analyses et exports prêts à l’emploi', icon: BarChart3, bg: 'bg-rose-100', color: 'text-rose-600' }
]

const features = [
  { title: 'Gestion des élèves', desc: 'Fiches, inscriptions et suivi individuel centralisés.', icon: Users },
  { title: 'Classes & matières', desc: 'Organisez vos classes, salles et programmes.', icon: BookOpen },
  { title: 'Saisie des notes', desc: 'Évaluations et moyennes calculées automatiquement.', icon: Pencil },
  { title: 'Édition de bulletins', desc: 'Générez et imprimez vos bulletins en quelques clics.', icon: Printer },
  { title: 'Notifications', desc: 'Restez informé des activités importantes.', icon: Bell }
]
</script>
