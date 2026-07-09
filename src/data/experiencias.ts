export interface Experiencia {
  slug: string
  title: string
  category: string
  excerpt: string
  image: string
  imageAlt: string
  location: string
  readingTime: number
  heroImage: string
  heroImageAlt: string
  subtitle: string
  quote: string
  paragraphs: string[]
  details: { label: string; value: string }[]
  sidebarImage: string
  sidebarImageAlt: string
  sidebarCaption: string
  galleryTitle: string
  gallery: { src: string; alt: string }[]
}
