// resources/js/components/sustainability/SustainabilityUtils.ts
export function safeArray<T>(v: any): T[] {
    return Array.isArray(v) ? v : []
}

export function percent(val: number, digits = 1) {
    return `${Number(val || 0).toFixed(digits)}%`
}

/**
 * percentChange(current, previous) => percentage change where positive => increase, negative => decrease
 * returns number (e.g. -12.3 means -12.3% change)
 */
export function percentChange(current: number, previous: number) {
    if (!previous && !current) return 0
    if (!previous) return 100 * (current > 0 ? 1 : 0)
    return ((current - previous) / Math.abs(previous)) * 100
}

/**
 * Compare this month vs last month aggregated value from expense rows
 * expenses: [{ date: '2025-11-22', amount: '123.45', category_name, subcategory_name }]
 * filterFn: (expense) => boolean to include (category)
 */
export function monthTotals(expenses: any[] = [], filterFn: (e: any) => boolean = () => true) {
    const now = new Date()
    const thisMonthSum = expenses.reduce((s, e) => {
        const d = new Date(e.date)
        if (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            filterFn(e)
        ) {
            return s + Number(e.amount || 0)
        }
        return s
    }, 0)

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthSum = expenses.reduce((s, e) => {
        const d = new Date(e.date)
        if (
            d.getFullYear() === lastMonth.getFullYear() &&
            d.getMonth() === lastMonth.getMonth() &&
            filterFn(e)
        ) {
            return s + Number(e.amount || 0)
        }
        return s
    }, 0)

    return { thisMonthSum, lastMonthSum }
}
