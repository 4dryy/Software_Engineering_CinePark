
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">
          About CINEPARK
        </h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
          Discovering cinema that truly speaks to you.
        </p>
      </header>

      <Separator />

      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Image
              src="/images/memento2.jpg"
              alt="Scene related to independent or thought-provoking cinema"
              width={800}
              height={600}
              className="object-cover w-full h-64 md:h-full"
            />
          </div>
          <div className="md:w-1/2">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-accent">WHY CINEPARK?</CardTitle>
              <CardDescription className="text-lg">
                A New Way to Explore Cinema That Speaks to You
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                CINEPARK is for film lovers who want to go beyond the blockbuster. While mainstream movies dominate the box office, there&apos;s a world of independent and alternative cinema waiting to be discovered—rich in artistic value, cultural depth, and emotional storytelling.
              </p>
              <p>
                Yet, finding the right entry point into this world isn&apos;t always easy. That&apos;s where we come in. We built CINEPARK to help you uncover the independent films you&apos;ll genuinely enjoy. Whether you&apos;ve had a few misses in the past or just don&apos;t know where to start, we&apos;re here to guide you through an experience that feels personal, insightful, and exciting.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg overflow-hidden">
         <div className="md:flex md:flex-row-reverse">
          <div className="md:w-1/2">
            <Image
              src="/images/user2.jpg"
              alt="Person interacting with a personalized recommendation system"
              width={800}
              height={600}
              className="object-cover w-full h-64 md:h-full"
            />
          </div>
          <div className="md:w-1/2">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-accent">HOW IT WORKS?</CardTitle>
              <CardDescription className="text-lg">
                Recommendations That Know Who You Are
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Unlike generic movie quizzes or random suggestion lists, CINEPARK uses a hybrid algorithm built on two powerful inputs: your movie ratings and your personality profile, based on the scientifically backed Big Five personality test (44 questions).
              </p>
              <p>
                The recommendation engine splits the weight 50/50 between your preferences and your personality traits—meaning you get recommendations that feel right for you, not just what others are watching. We also update our database regularly based on new film releases, user feedback, professional opinions, niche tags, and authorial styles. This results in an exceptionally curated and evolving recommendation system you won&apos;t find anywhere else.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Image
              src="/images/verdi.jpg"
              alt="Exterior or interior of an independent cinema like Cines Verdi"
              width={800}
              height={600}
              className="object-cover w-full h-64 md:h-full"
            />
          </div>
          <div className="md:w-1/2">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-accent">DISCOVER WHAT’S PLAYING NEAR YOU</CardTitle>
              <CardDescription className="text-lg">
                Independent Films in Real Time, Around Barcelona
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                CINEPARK doesn&apos;t just tell you what to watch—it tells you where and when. Through real-time updates and web scraping, we show you exactly which recommended indie films are playing in Barcelona&apos;s best alternative cinemas, including Zumzeig Cinema, Texas Cinemes, Cinemes Maldà, Méliès, la Filmoteca, and Cines Verdi.
              </p>
              <p>
                So whether you&apos;re just beginning your journey into independent cinema or looking to deepen your appreciation, CINEPARK gives you the tools to explore with confidence—and enjoy every step.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>

    </div>
  );
}
