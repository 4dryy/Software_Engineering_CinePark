
import { getCurrentUser } from "@/lib/auth-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecks, Film, Clapperboard, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome back, {user?.name || "User"}!</CardTitle>
          <CardDescription className="text-lg">
            Ready to dive into the world of cinema? Let&apos;s find your next favorite film.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src="/images/dashCine2.jpg"
            alt="CINEPARK dashboard cinematic collage"
            width={1200}
            height={200}
            className="rounded-md object-cover w-full"
            data-ai-hint="cinema movie"
            priority
          />
          <p className="mt-4 mb-4 text-muted-foreground"> {/* Adjusted margins around paragraph */}
            Explore personalized recommendations, discover movies playing near you, or retake the personality quiz to refine your matches.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardActionCard
          href="/quiz"
          icon={<ListChecks className="h-8 w-8 text-primary" />}
          title="Personality Quiz"
          description="Take or retake the quiz to get fresh film recommendations tailored to your mood and preferences."
          buttonText="Go to Quiz"
        />
        <DashboardActionCard
          href="/recommendations"
          icon={<Film className="h-8 w-8 text-primary" />}
          title="Film Recommendations"
          description="View AI-powered film suggestions based on your latest quiz results."
          buttonText="View Recommendations"
        />
        <DashboardActionCard
          href="/local-cinemas"
          icon={<Clapperboard className="h-8 w-8 text-primary" />}
          title="Local Cinema Finder"
          description="Discover what's playing in cinemas near Barcelona and get AI suggestions based on your taste."
          buttonText="Find Local Films"
        />
         <DashboardActionCard
          href="/profile"
          icon={<UserIcon className="h-8 w-8 text-primary" />}
          title="Your Profile"
          description="Manage your account details, view past quiz results, and update your preferences."
          buttonText="Go to Profile"
        />
      </div>
    </div>
  );
}

interface DashboardActionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
}

function DashboardActionCard({ href, icon, title, description, buttonText }: DashboardActionCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className="bg-primary/10 p-3 rounded-full">
            {icon}
        </div>
        <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardHeader className="pt-0"> {/* ShadCN CardFooter has items-center which is not ideal here */}
        <Button asChild className="w-full">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
