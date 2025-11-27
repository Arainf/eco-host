
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
import { categories, dashboard, entrance, sustainability, activity, management, reports, help } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {LayoutGrid, Database,LibraryBig , ChartColumnDecreasing , Goal , History , BookUser   } from 'lucide-react';
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
        href: reports(),
        icon: ChartColumnDecreasing,
    },
    {
        title: 'Sustainability Goals',
        href: sustainability(),
        icon: Goal,
    },
    {
        title: 'Activity Log',
        href: activity(),
        icon: History,
    },
    {
        title: 'User Management',
        href: management(),
        icon: BookUser,
    },
    {
        title: 'Help / Resources',
        href: help(),
        icon: CircleQuestionIcon,

    },
];


export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    const allowedItems = mainNavItems.filter((item) => {
        // Items restricted to admins
        const adminOnly = ['Categories', 'User Management'];

        // If user is NOT admin, hide admin-only items
        return !(!auth?.user?.is_admin && adminOnly.includes(item.title));

    });


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
                <NavMain items={allowedItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
