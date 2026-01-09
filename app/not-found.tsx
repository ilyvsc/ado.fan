"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-6">
      <div className="w-full max-w-2xl md:max-w-3xl">
        <Card className="border-0 bg-linear-to-br from-card/95 to-card/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="px-6 pt-8 pb-0 md:px-8 md:pt-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src="https://pbs.twimg.com/media/GIKDKIMaMAABSPq?format=webp"
                  alt="404-chan - scared Ado, anime girl character"
                  width={250}
                  height={250}
                  className="h-50 w-50 rounded-sm md:h-80 md:w-80"
                  loading="lazy"
                  sizes="(max-width: 768px) 200px, 320px"
                  quality={85}
                />
              </div>

              <CardTitle className="text-center text-3xl font-bold text-ado-red-600 uppercase md:text-6xl">
                You interrupted 404-chan!!!
              </CardTitle>
              <CardDescription className="max-w-xl text-center text-base text-muted-foreground md:text-2xl">
                <strong>Mou~!</strong> 404-chan was peacefully enjoying Ado's
                music when you suddenly appeared!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 px-6 pb-8 md:space-y-4 md:px-8 md:pb-10">
            <div className="transform rounded-lg border border-ado-red-600/50 bg-ado-red-600/5 p-4 shadow-lg transition-transform hover:scale-[1.02] md:p-6">
              <p className="text-center text-base leading-relaxed text-foreground italic md:text-lg">
                <strong>404-chan:</strong> I was having such a great time
                listening to Ado-sama's songs and you just... UGGGHHHHH!!! Go
                find your own page!! Shoo shoo! 🔪
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row md:pt-2">
              <Button
                asChild
                className="text-md h-12 flex-1 bg-ado-red-600 font-semibold text-foreground hover:bg-ado-red-600/80"
                onClick={() => window.history.back()}
              >
                vanish away from here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
