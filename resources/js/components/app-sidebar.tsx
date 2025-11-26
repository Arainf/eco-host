
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
import { categories, dashboard, entrance, sustainability, activity } from '@/routes';
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
        href: dashboard(),
        icon: ChartColumnDecreasing,
        comingSoon: true
    },
    {
        title: 'Sustainability Goals',
        href: sustainability(),
        icon: Goal,
        comingSoon: true
    },
    {
        title: 'Activity Log',
        href: activity(),
        icon: History,
    },
    {
        title: 'User Management',
        href: dashboard(),
        icon: BookUser,
        comingSoon: true
    },
    {
        title: 'Help / Resources',
        href: dashboard(),
        icon: CircleQuestionIcon,
        comingSoon: true
    },
];


export function AppSidebar() {

    const { auth } = usePage<SharedData>().props;

    const allowedItems = mainNavItems.filter((item) => {
        // Items restricted to admins
        const adminOnly = ['Categories', 'User Management', 'Activity Log'];

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
