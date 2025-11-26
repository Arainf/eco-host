export type Goal = {
    id: number
    category_name: string
    target_pct: number
    current_pct: number
    deadline?: string | null
    notes?: string | null
}

export type Category = {
    id: number
    name: string
    color: string
    subcategories: any[]
}
