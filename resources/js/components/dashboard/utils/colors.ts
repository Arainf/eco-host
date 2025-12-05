// components/dashboard/utils/color.ts
export function hexToRgba(hex: string, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`
    const h = hex.replace("#", "")
    const bigint = parseInt(h.length === 3 ? h.split("").map(c=>c+c).join("") : h, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}


// Convert HEX → RGB
export function hexToRgb(hex: string) {
    const clean = hex.replace("#", "")
    const bigint = parseInt(clean, 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    }
}

// Lighten / darken a color
export function scaleColor(color: string, factor: number) {
    const { r, g, b } = hexToRgb(color)

    const newR = Math.min(255, Math.max(0, r + r * factor))
    const newG = Math.min(255, Math.max(0, g + g * factor))
    const newB = Math.min(255, Math.max(0, b + b * factor))

    return `rgb(${newR}, ${newG}, ${newB})`
}

// Generate evenly spaced shades based on index
export function getShadeForIndex(index: number, total: number, baseColor: string) {
    if (total === 1) return baseColor

    const start = -0.4
    const end = 0.4
    const step = (end - start) / (total - 1)

    return scaleColor(baseColor, start + index * step)
}
