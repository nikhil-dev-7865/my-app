"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";


const Hero = () => {

    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            if (imageElement) {
                const scrollPosition = window.scrollY;
                const scrollThreshold = 100; // Adjust this value to control when the animation starts
                if (scrollPosition > scrollThreshold) {
                    imageElement.classList.add("scrolled");
                } else {
                    imageElement.classList.remove("scrolled");
                }
            }
        };
        
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <section className="px-4 pb-10 pt-6 text-center sm:px-6 md:px-8">
        <div className="page-hero hero-gradient-bg mx-auto max-w-6xl px-5 py-10 text-center md:px-10">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-lg bg-emerald-100 ring-8 ring-white transition-all duration-300 hover:scale-105 hover:bg-blue-100 sm:h-36 sm:w-36">
                <Image 
                src='/Business Team.gif'
                alt='Business Team'
                width={192}
                height={192}
                className='h-auto w-24 rounded-lg object-contain sm:w-32'/>
            </div>

            <h2 className="gradient-title pb-4 text-3xl font-bold leading-tight sm:pb-6 sm:text-4xl md:text-5xl lg:text-6xl">One solution for all your financial needs</h2>
            
            
            <p className="mx-auto mb-8 max-w-3xl px-2 text-base text-slate-600 sm:px-4 sm:text-lg md:text-xl">Budgeting isn&apos;t about limiting yourself, it&apos;s about making room for what matters most.</p>
        </div>
        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
            
            <Link href="/dashboard" 
            className="inline-block rounded-md bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 sm:px-8 sm:text-base">
              Get Started
            </Link>
            <Link href="/about" className="inline-block rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 sm:px-8 sm:text-base">
              Learn More
            </Link>
        </div>
        <div className="hero-image-wrapper mt-8 sm:mt-10 md:mt-12">
            <div ref={imageRef} className="hero-image">
                <Image src='/banner.jpeg' alt="Banner Image" 
                width={1280} 
                height={720} 
                className="w-full rounded-lg border border-slate-200 shadow-2xl transition-all duration-500"/>
            </div>
        </div>
        </div>
    </section>
  );
    
}

export default Hero
