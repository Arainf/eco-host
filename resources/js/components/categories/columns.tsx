"use client"

import { ColumnDef } from "@tanstack/react-table"

// Helper: convert hex → rgb
function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    }
}

// Helper: lighten/darken color
function scaleColor(color: string, factor: number) {
    const { r, g, b } = hexToRgb(color)

    // factor: -1 to 1
    const newR = Math.min(255, Math.max(0, r + r * factor))
    const newG = Math.min(255, Math.max(0, g + g * factor))
    const newB = Math.min(255, Math.max(0, b + b * factor))

    return `rgb(${newR}, ${newG}, ${newB})`
}

// Helper: generate shade based on subcategory index
function getShadeForIndex(index: number, total: number, baseColor: string) {
    if (total === 1) return baseColor

    // Spread factors evenly from -0.4 → 0.4
    const start = -0.4
    const end = 0.4
    const step = (end - start) / (total - 1)

    return scaleColor(baseColor, start + index * step)
}

export type Subcategory = {
    id: number | null
    name: string
}

export type Category = {
    id: number
    name: string
    slug: string
    color: string
    description: string
    subcategories: Subcategory[]
}

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Category",
        cell: ({ row }) => (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {row.original.name}
      </span>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
        {row.original.description}
      </span>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            const color = row.original.color

            return (
                <span
                    className="
          inline-flex items-center px-3 py-1 text-xs font-medium
          rounded-full border
          text-neutral-800 dark:text-neutral-100
        "
                    style={{
                        backgroundColor: color + "20", // light translucent bg
                        borderColor: color,
                    }}
                >
        <span
            className="w-2 h-2 rounded-full mr-2 border"
            style={{ backgroundColor: color, borderColor: color }}
        />
                    {color.toUpperCase()}
      </span>
            )
        },
    },
    {
        accessorKey: "subcategories",
        header: "Subcategories",
        cell: ({ row }) => {
            const subs = row.original.subcategories
            const baseColor = row.original.color
            const total = subs.length

            if (total === 0) {
                return (
                    <span className="text-neutral-400 text-sm dark:text-neutral-500">
            None
          </span>
                )
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {subs.map((s, i) => {
                        const shade = getShadeForIndex(i, total, baseColor)

                        return (
                            <span
                                key={s.id ?? Math.random()}
                                className="
                  px-2 py-1 text-xs rounded-md border
                  text-neutral-900 dark:text-neutral-100
                "
                                style={{
                                    backgroundColor: shade,
                                    borderColor: shade,
                                }}
                            >
                {s.name}
              </span>
                        )
                    })}
                </div>
            )
        },
    },
]
