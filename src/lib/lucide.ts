type SVGAttrs = Record<string, string | number | undefined>
export type IconNode = [tag: string, attrs: SVGAttrs][]

export function icon(node: IconNode, size = 24, strokeWidth = 2): string {
  const attrs = [
    'xmlns="http://www.w3.org/2000/svg"',
    `width="${size}"`,
    `height="${size}"`,
    'viewBox="0 0 24 24"',
    'fill="none"',
    'stroke="currentColor"',
    `stroke-width="${strokeWidth}"`,
    'stroke-linecap="round"',
    'stroke-linejoin="round"',
  ].join(' ')
  const inner = node
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
      return `<${tag} ${attrStr}/>`
    })
    .join('')
  return `<svg ${attrs}>${inner}</svg>`
}
