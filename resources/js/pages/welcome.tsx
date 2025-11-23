import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import logo from "../assets/Sys_logo.png";
import Small_Logo from "../assets/ECO COST (1).png";
import Bg_logo from "../assets/Hero_Background.png"
import Leaf from "../assets/leaf.png"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Contact from "@/assets/contact.png"
import { Facebook, Mail  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen w-screen flex-col items-center bg-[#F7F1DE] text-[#1b1b18] lg:justify-center scroll-smooth ">

                <header className=" w-screen fixed top-0 left-0 text-sm not-has-[nav]:hidden text-white px-10 py-2 bg-[#2B4328]">
                    <nav className="flex items-center flex-row justify-between gap-4">
                        <span className="flex flex-row">
                        <Link
                            href={dashboard()}
                        >
                          <img src={Small_Logo} alt="Logo" className="h-9" />
                        </Link>
                        <Link
                            href="#home"
                            className="inline-block rounded-sm hover:scale-120 transition ease-in-out   px-5 py-1.5 text-sm leading-normal text-white"
                        >
                            Home
                        </Link>
                         <Link
                             href="#features"
                             className="inline-block rounded-sm  hover:scale-120 transition ease-in-out   px-5 py-1.5 text-sm leading-normal text-white"
                         >
                        Features
                        </Link>
                        <Link
                            href="#about"
                            className="inline-block rounded-sm  hover:scale-120 transition ease-in-out  px-5 py-1.5 text-sm leading-normal text-white"
                        >
                        About
                        </Link>

                            <Link
                                 href="#a"
                                 className="inline-block rounded-sm  hover:scale-120 transition ease-in-out   px-5 py-1.5 text-sm leading-normal text-white"
                             >
                        Reports
                        </Link>
                          <Link
                              href="#contact"
                              className="inline-block rounded-sm  hover:scale-120 transition ease-in-out   px-5 py-1.5 text-sm leading-normal text-white"
                          >
                        Contacts
                        </Link>
                        </span>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border nunito-reg border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] "
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <span className="gap-2 flex flex-row">
                                <Link
                                    href={login()}
                                    className="inline-block rounded-md nunito-reg  border border-transparent px-5 py-1.5 text-sm leading-normal text-white hover:border-[#19140035] "
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-md bg-[#6CA966] hover:bg-[#568751] border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-white hover:border-[#1915014a] "
                                    >
                                        Register
                                    </Link>
                                )}
                            </span>
                        )}
                    </nav>
                </header>

                {/* HERO SECTION */}
                <div id="home" className="flex w-full min-h-[100vh] items-center justify-center bg-[#F7F1DE] px-8 lg:px-24"
                     style={{
                         backgroundImage: `url(${Bg_logo})`,
                         backgroundSize: 'cover',
                         backgroundPosition: 'center',
                         backgroundRepeat: 'no-repeat',
                     }}
                >
                    <div  className="flex flex-col-reverse lg:flex-row items-center gap-12 w-full">

                        {/* LEFT: Text Content */}
                        <div className="flex-[2] flex flex-col gap-6">
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-[#1b1b18]">
                                <span className="italic font-semibold text-[#6CA966] font-sans">Empowering AdZU EntrepHub</span><br/>
                                to track, analyze, and sustain <br /> environmental costs
                            </h1>

                            <div className="h-1 w-[60px] bg-[#6CA966] rounded-full my-2" />

                            <p className="text-lg lg:text-xl text-[#1b1b18] font-mono">
                                <strong className="text-[#6CA966]">EcoCost</strong> helps administrators monitor energy, water, and waste expenditures through a smart, web-based tracking system designed for sustainable decision-making.
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4">
                                <Link
                                    href={register()}
                                    className="px-8 py-4 text-lg font-bold text-white bg-[#6CA966] rounded-full shadow-lg hover:bg-[#568751] transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={login()}
                                    className="px-8 py-4 text-lg font-bold text-[#6CA966] border-2 border-[#6CA966] rounded-full hover:bg-[#6CA966] hover:text-white transition-all duration-300"
                                >
                                    Log In
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT: Image */}
                        <div className="flex-[1] flex justify-center lg:justify-end">
                            <img src={logo} alt="EcoCost Logo" className="w-full max-w-md lg:max-w-lg h-auto" />
                        </div>

                    </div>
                </div>

                {/* FEATURES SECTION */}
                <div id="features" className="flex flex-col w-full min-h-[100vh] text-white gap-6 items-center justify-start bg-[#2B4328] p-24">
                    <div>
                        <h6 className="font-bold text-md">Innovate</h6>
                    </div>

                    <div className="w-[60vw] text-center">
                        <h6 className=" text-6xl ">Powerful features for sustainable financial management</h6>
                    </div>

                    <div>
                        <h6 className=" text-lg">Streamline your eco-host tracking with advanced digital tools</h6>
                    </div>

                    <div className="flex flex-row gap-4  w-[90vw] h-[60vh] p-10">

                        <Card className="w-auto flex-[2] h-[100%] border-[#4a5f48] bg-transparent text-white p-0 flex flex-row gap-0">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">
                                <CardTitle className="text-sm font-semibold">Dashboard</CardTitle>
                                <p className="text-2xl ">Real-time expenses visualization</p>
                                <CardDescription className="text-white font-xs">Instant insights into your environment and financial performance</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-[1.5] bg-[#4a5f48] rounded-tr-lg rounded-br-lg ">

                            </CardContent>
                        </Card>


                        <Card className="w-auto flex-[1] h-[100%] p-0 bg-transparent border-[#4a5f48] text-white ">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">
                                <CardTitle className="text-sm font-semibold">Reports</CardTitle>
                                <p className="text-3xl ">Comprehensive analytics</p>
                                <CardDescription className="text-white font-xs">Generate detailed reports with actionable sustainability metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-[1.5] bg-[#4a5f48] rounded-bl-lg rounded-br-lg ">

                            </CardContent>

                        </Card>

                        <Card className="w-auto flex-[1] h-[100%] p-0 bg-transparent border-[#4a5f48] text-white ">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">
                                <CardTitle className="text-sm font-semibold">Integration</CardTitle>
                                <p className="text-3xl ">Seamless data management</p>
                                <CardDescription className="text-white font-xs">Easily import and export data across multiple platforms</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-[1.5] bg-[#4a5f48] rounded-bl-lg rounded-br-lg ">

                            </CardContent>

                        </Card>

                    </div>
                </div>

                {/* ABOUT SECTION */}
                <div id="about" className="flex flex-col w-full min-h-[100vh] text-black gap-6 items-center justify-start bg-[#F7F1DE] p-24">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <img src={Leaf} alt="EcoCost Logo" className="w-14 h-auto" />
                        <h6 className="font-bold text-md">Mission</h6>
                    </div>

                    <div className="w-[60vw] text-center">
                        <h6 className=" text-6xl ">Hidden Costs and Unexplored Opportunities in Traditional Accounting</h6>
                    </div>

                    <div className="text-center">
                        <h6 className=" text-md">Traditional accounting systems at AdZU EntrepHub lack a dedicated feature to monitor and manage environmental expenditures. <br/> Costs related to energy, water, and waste are not isolated, making it difficult for administrators to evaluate the financial impact of sustainability initiatives (Kim et al., 2024).

                        <br/>As a result, potential opportunities for cost reduction, resource optimization, and environmental improvement are left unexplored (Santos et al., 2025).</h6>
                    </div>


                    <div className="w-[80vw] text-center mt-14">
                        <h6 className=" text-6xl "><span className="text-[#6CA966] font-bold">EcoCost:</span> Our Solution and Key Objectives</h6>
                    </div>

                    <div className="text-center">
                        <h6 className=" text-md"> EcoCost aims to develop a functional, web-based system that enables AdZU EntrepHub to track and analyze environmental expenses efficiently. Specifically, it seeks to:</h6>
                    </div>

                    <div className="flex flex-row gap-4  w-[90vw] h-[25vh] p-10">
                        <Card className="w-auto flex-[1] h-auto p-0 bg-transparent border-[#4a5f48] text-black ">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">
                                <p className="text-3xl ">Design a user-friendly interface</p>
                                <CardDescription className=" font-xs text-black">that allows administrators to input and categorize environmental-related costs.</CardDescription>
                            </CardHeader>


                        </Card>

                        <Card className="w-auto flex-[1] h-[100%] p-0 bg-transparent border-[#4a5f48] text-black ">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">

                                <p className="text-3xl ">Develop analytics and visual reports </p>
                                <CardDescription className=" font-xs text-black"> on energy, water, and waste expenditures.</CardDescription>
                            </CardHeader>

                        </Card>
                        <Card className="w-auto flex-[1] h-[100%] p-0 bg-transparent border-[#4a5f48] text-black ">
                            <CardHeader className="flex-[1]  flex flex-col justify-center gap-3">

                                <p className="text-3xl ">Promote environmental awareness and accountability</p>
                                <CardDescription className=" font-xs text-black">through accessible, data-driven tools supporting sustainability initiatives.</CardDescription>
                            </CardHeader>


                        </Card>

                    </div>
                </div>

                {/* CONTACT SECTION */}
                <div id="contact" className="flex flex-col w-full min-h-[100vh] text-black gap-6 items-center justify-start bg-[#2B4328] p-24"
                     style={{
                             backgroundImage: `url(${Contact})`,
                             backgroundSize: 'cover',
                             backgroundPosition: 'center',
                             backgroundRepeat: 'no-repeat',
                     }}
                >
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h6 className="font-bold text-md text-white">Team</h6>

                    </div>

                    <div className="w-[60vw] text-center">
                        <h6 className=" text-5xl text-white">Our Champions</h6>
                    </div>

                    <div className="flex flex-col space-y-12 w-full">

                        <div>
                            <span className="flex flex-col gap-1 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Fatima Shakina Jawari</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Project Head</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>
                        </div>

                        <div className="flex flex-row  w-full ">

                            <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Edlene Marielle Toribio</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>

                            <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Shane April Ortega</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>

                            <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Jhevylene Abad</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>

                        </div>



                        <div className="flex flex-row  w-full ">
                              <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Jasmine Claire Austero</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>

                            <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Nashry Jay Talib</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>

                            <span className="flex flex-col gap-1 flex-1/2 items-center">
                                <Avatar className="h-18 w-18">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-2xl font-bold text-white">Liam Shawn Cole Lee</p>
                                <p className="text-xl italic font-medium text-[#90caf9] mt-[-5px]">Researcher</p>
                                <span className="flex flex-row gap-2 text-[#f5f5dc]">
                                    <Facebook/>
                                    <Mail />
                                </span>
                            </span>
                        </div>

                    </div>

                </div>



                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
