"use client";

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Help / Resources", href: "/help" },
];

// Sections with IDs for scroll + navigation
const sections = [
    { id: "about", label: "About Eco-Cost Tracker" },
    { id: "usage", label: "How to Use the System" },
    { id: "guidelines", label: "Sustainability Guidelines" },
    { id: "data-entry", label: "Data Entry Tips" },
    { id: "responsibilities", label: "Your Responsibilities" },
    { id: "importance", label: "Why This Tool Matters" },
    { id: "contact", label: "Contact & Support" },
];

export default function HelpPage() {
    const [active, setActive] = useState("about");

    // Highlight active section while scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Help & Resources" />

            <div className="max-w-7xl mx-auto p-4 flex gap-8">

                {/* LEFT NAVIGATION */}
                <aside className="hidden md:flex flex-col w-64 sticky top-24 h-max border-r pr-4">
                    <h2 className="text-lg font-semibold mb-3">Navigation</h2>

                    <ul className="space-y-1 text-sm">
                        {sections.map((sec) => (
                            <li key={sec.id}>
                                <button
                                    onClick={() => scrollTo(sec.id)}
                                    className={cn(
                                        "text-left w-full px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                        active === sec.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-neutral-700 dark:text-neutral-300"
                                    )}
                                >
                                    {sec.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* MAIN CONTENT */}
                <div className="flex-1 space-y-10">

                    {/* ---- 1 ---- */}
                    <Card id="about" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>1. About the Eco-Cost Tracker</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            The Eco-Cost Tracker is a tool built for Ateneo de Zamboanga University (AdZU) EntreHub.
                            It helps you record electricity, water, waste, and eco-friendly expenses while promoting
                            sustainability awareness and responsible decision-making.
                        </CardContent>
                    </Card>

                    {/* ---- 2 ---- */}
                    <Card id="usage" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>2. How to Use the System</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">

                            <div>
                                <h3 className="font-semibold mb-1">a. Recording Expenses</h3>
                                <ul className="list-disc ml-6 space-y-1">
                                    <li>Electricity bills</li>
                                    <li>Water usage</li>
                                    <li>Waste management</li>
                                    <li>Eco-friendly materials</li>
                                    <li>Other green-related expenses</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1">b. Dashboard Overview</h3>
                                <p>The dashboard shows summaries, charts, graphs, and trends over time.</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-1">c. Reports & Analytics</h3>
                                <p>View breakdowns, category totals, and generate exportable reports.</p>
                            </div>

                        </CardContent>
                    </Card>

                    {/* ---- 3 ---- */}
                    <Card id="guidelines" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>3. Sustainability Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed">
                            Track efforts aligned with:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Energy efficiency</li>
                                <li>Water conservation</li>
                                <li>Waste reduction</li>
                                <li>Eco-friendly materials</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* ---- 4 ---- */}
                    <Card id="data-entry" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>4. Data Entry Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed">
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Record expenses weekly or immediately</li>
                                <li>Use the correct categories</li>
                                <li>Provide clear item descriptions</li>
                                <li>Double-check before saving</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* ---- 5 ---- */}
                    <Card id="responsibilities" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>5. Your Responsibilities</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed">
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Record data honestly</li>
                                <li>Avoid duplicates</li>
                                <li>Follow administrator guidelines</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* ---- 6 ---- */}
                    <Card id="importance" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>6. Why This Tool Matters</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed">
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Track environmental costs</li>
                                <li>Promote sustainable practices</li>
                                <li>Support resource-saving decisions</li>
                                <li>Raise sustainability awareness</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* ---- 7 ---- */}
                    <Card id="contact" className="scroll-mt-24">
                        <CardHeader>
                            <CardTitle>7. Contact & Support</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed">
                            For help with accounts, claims, errors, or suggestions:<br />
                            <strong className="block mt-2">ecocosttracker@gmail.com</strong>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
