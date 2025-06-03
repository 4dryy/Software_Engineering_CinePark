
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Logo } from '@/components/Logo';
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Image */}
      <Image
        src="/images/bcn_city.jpg"
        alt="Barcelona city skyline at dusk"
        layout="fill"
        objectFit="cover"
        className="opacity-30"
        priority
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 text-foreground">
        
        {/* Top Posters Section */}
        <section className="w-full max-w-6xl mx-auto mb-8 md:mb-12 mt-8 md:mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Poster 1 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/moving_castle_poster.jpg"
                width={200}
                height={300}
                alt="Howl's Moving Castle film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            {/* Poster 2 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/pulp_fiction_poster.jpg"
                width={200}
                height={300}
                alt="Pulp Fiction film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            {/* Poster 3 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/seven_poster.jpg"
                width={200}
                height={300}
                alt="Se7en film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </section>

        {/* CINEPARK Card Section */}
        <div className="w-full max-w-2xl mb-8 md:mb-12">
          <Card className="w-full shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mb-6 flex justify-center">
                <Logo size="lg"/>
              </div>
              <CardTitle className="text-4xl font-bold tracking-tight">Welcome to CINEPARK</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Discover films perfectly tailored to your taste.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                <p>
                  Take our unique personality quiz, and let our AI find movie recommendations just for you.
                  Explore films playing in local cinemas and never miss a masterpiece.
                </p>
                <p className="font-semibold text-accent">
                  Ready to find your next favorite movie?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="w-full text-lg py-6" size="lg">
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" /> Login
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full text-lg py-6" size="lg">
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Posters Section */}
        <section className="w-full max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Poster 4 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/sinners_poster.jpg"
                width={200}
                height={300}
                alt="Sinners film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            {/* Poster 5 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/the_lighthouse_poster.jpg"
                width={200}
                height={300}
                alt="The Lighthouse film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            {/* Poster 6 */}
            <div 
              className="bg-card/80 p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 aspect-[2/3] overflow-hidden"
            >
              <Image
                src="/images/truman_poster.jpg"
                width={200}
                height={300}
                alt="Truman Show film poster"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </section>

        {/* Footer at the bottom */}
        <footer className="w-full text-center py-6 text-muted-foreground mt-auto">
          <p>&copy; {new Date().getFullYear()} CINEPARK. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
