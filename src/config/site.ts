export interface SiteConfig {
  brand: {
    name: string
    slogan: string
    description: string
    url: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    ogDefaultImage: string
    themeColor: string
  }
  social: {
    instagram: string
    facebook: string
    email: string
  }
  nav: {
    label: string
    href: string
  }[]
}

export const site: SiteConfig = {
  brand: {
    name: 'Sabores & Experiencias',
    slogan: 'Crónicas de lugares y momentos',
    description: 'Una guía editorial basada en experiencias reales, visitas anónimas y observación directa.',
    url: 'https://saboresexperiencias.com',
  },
  seo: {
    defaultTitle: 'Sabores & Experiencias | Crónicas de León',
    defaultDescription: 'Descubrí Nicaragua a través de crónicas editoriales auténticas. No otorgamos estrellas. Describimos lo que encontramos.',
    ogDefaultImage: '/og-default.svg',
    themeColor: '#000f21',
  },
  social: {
    instagram: '#',
    facebook: '#',
    email: '#',
  },
  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Experiencias', href: '/experiencias' },
    { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { label: 'Metodología', href: '/metodologia' },
  ],
}
