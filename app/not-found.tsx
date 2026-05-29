"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import angryAdo from "@/public/images/ado-angry.webp";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-6">
      <div className="w-full max-w-2xl md:max-w-3xl">
        <Card className="border-0 bg-linear-to-br from-background/95 to-background/80">
          <CardHeader className="px-6 pt-8 pb-0 md:px-8 md:pt-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src={angryAdo}
                  alt="404-chan - scared Ado, anime girl character"
                  width={250}
                  height={250}
                  className="h-50 w-50 rounded-sm md:h-80 md:w-80"
                  sizes="(max-width: 768px) 200px, 320px"
                />
              </div>

              <CardTitle className="text-center text-3xl font-bold text-ado-primary uppercase md:text-6xl">
                You interrupted 404-chan!!!
              </CardTitle>
              <CardDescription className="max-w-xl text-center text-base text-muted-foreground md:text-2xl">
                <strong>Mou~!</strong> 404-chan was peacefully enjoying Ado's music
                when you suddenly appeared!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 px-6 pb-8 md:space-y-4 md:px-8 md:pb-10">
            <div className="rounded-lg border border-ado-primary/50 bg-ado-primary/5 p-4 transition-transform hover:scale-105 md:p-6">
              <p className="text-center text-base leading-relaxed text-foreground italic md:text-lg">
                <strong>404-chan:</strong> I was having such a great time listening to
                Ado-sama's songs and you just... UGGGHHHHH!!! Go find your own page!!
                Shoo shoo! 🔪
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row md:pt-2">
              <Button
                className="h-12 flex-1 bg-ado-primary text-base font-semibold text-foreground hover:bg-ado-primary/80"
                onClick={() => {
                  router.back();
                }}
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
