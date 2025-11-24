import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isComingSoon = item.comingSoon === true;

                    return (
                        <SidebarMenuItem key={item.title}>

                            <SidebarMenuButton
                                asChild
                                isActive={
                                    !isComingSoon &&
                                    page.url.startsWith(resolveUrl(item.href))
                                }
                                tooltip={{ children: item.title }}
                                disabled={isComingSoon}
                            >
                                <Link
                                    href={isComingSoon ? "#" : item.href}     // ❌ No navigation
                                    prefetch={!isComingSoon}   // ❌ No prefetch
                                    onClick={(e) => {
                                        if (isComingSoon) {
                                            e.preventDefault();              // ❌ Inertia navigation blocked
                                            e.stopPropagation();
                                        }
                                    }}
                                    className="flex items-center justify-between gap-2 opacity-100"
                                >
                                    {/* Icon + Title */}
                                    <span className="flex items-center gap-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </span>

                                    {/* 🚧 Coming Soon Badge */}
                                    {isComingSoon && (
                                        <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-white rounded">
                                            Soon
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>

                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
