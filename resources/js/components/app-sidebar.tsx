
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { categories, dashboard, entrance } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {LayoutGrid, Database,LibraryBig , ChartColumnDecreasing , Goal , History , BookUser  , Settings,    } from 'lucide-react';
import { CircleQuestionIcon } from "@/assets/circle-question-mark";
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Data Entry',
        href: entrance(),
        icon: Database,
    },
    {
        title: 'Categories',
        href: categories(),
        icon: LibraryBig,
    },
    {
        title: 'Reports & Analytics',
        href: dashboard(),
        icon: ChartColumnDecreasing,
    },
    {
        title: 'Sustainability Goals',
        href: dashboard(),
        icon: Goal,
    },
    {
        title: 'Activity Log',
        href: dashboard(),
        icon: History,
    },
    {
        title: 'User Management',
        href: dashboard(),
        icon: BookUser,
    },
    {
        title: 'System Settings',
        href: dashboard(),
        icon: Settings ,
    },
    {
        title: 'Help / Resources',
        href: dashboard(),
        icon: CircleQuestionIcon,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
