import Small_Logo from '@/assets/ECO COST (1).png';

interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className = '' }: AppLogoIconProps) {
    return (
        <img
            src={Small_Logo}
            alt="Logo"
            className={`w-auto ${className}`}
        />
    );
}
