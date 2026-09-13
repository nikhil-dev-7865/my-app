import { Button } from "@/components/ui/button";
import { featuresData, statsData, testimonialsData } from "@/data/landing";
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import Hero from "@/components/ui/hero";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="mt-auto overflow-hidden">
      <Hero />
      {/* Stats Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {statsData.map((stat, index) => (
              <div key={index} className="finance-surface money-glow group rounded-lg p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:bg-emerald-50/80 hover:shadow-xl">
                <div className="text-3xl font-extrabold text-emerald-700 transition-transform duration-300 group-hover:scale-110">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <h2 className="gradient-title text-4xl font-bold">Track money without the mental clutter</h2>
            <p className="mt-2 text-sm text-slate-600">Fast entry, sharp summaries, and useful automation for everyday decisions.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature, index) => (
              <Card key={index} className="finance-card-hover group overflow-hidden rounded-lg border-white/75 bg-white/85 p-6 backdrop-blur-xl hover:border-blue-200 hover:bg-blue-50/60">
                <CardContent className="flex flex-col items-start space-y-4 p-0">
                  <div className="rounded-lg bg-blue-100 p-3 transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-emerald-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
              
            ))}
          </div>
        </div>
      </section>
        {/* Testimonials Section */}
        <section className="py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-center text-4xl font-bold tracking-tight">Trusted by focused money managers</h2>
          <p className="mb-8 mt-2 text-sm text-slate-500">Demo stories that show the product rhythm.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div key={index} className="finance-surface group rounded-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:bg-indigo-50/60 hover:shadow-xl">
                <CardContent className="space-y-4 flex flex-col items-center p-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mx-auto ring-4 ring-emerald-100 transition-all duration-300 group-hover:scale-105 group-hover:ring-indigo-200"
                  />
                  <h3 className="text-xl font-semibold transition-colors group-hover:text-indigo-700">{testimonial.name}</h3></CardContent>
                  <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                  <p className="mt-3 text-slate-600 italic text-sm">&ldquo;{testimonial.quote}&rdquo;</p> 
              </div>
            ))}
          </div>
        </div>
      </section>
      

      <section className="py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="page-hero group px-6 py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-slate-600">Join thousands of users who trust us to manage their expenses. </p>
          <Link href="/sign-up">
          <Button size="lg"  className="bg-white text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-100 group-hover:shadow-lg">
            Sign Up Now
          </Button>
          </Link>
          </div>
          
          
        </div>
      </section>
    </div>
  );
}
