import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center">
                <AppLogoIcon className="size-10 text-white " />
            </div>
            <div className="ml-1 grid flex-1 text-left text-lg text-[#2e7d32]">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                   EcoCost
                </span>
            </div>
        </>
    );
}
