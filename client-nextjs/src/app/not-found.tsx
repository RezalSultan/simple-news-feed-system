import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import React from "react";

const NotFound404 = () => {
  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden">
      <div className="flex items-center justify-center gap-8">
        <div className="w-[650px]">
          <AspectRatio ratio={16 / 15}>
            <Image
              alt="Not Found"
              src={"/not-found-image.jpg"}
              className="object-cover transition-transform duration-500 ease-in hover:scale-110"
              fill
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-3 text-3xl font-bold">
          <h2 className="text-5xl">aaaaaAAAAAAAAAA!</h2>
          <p>Nyasar kann??</p>
          <p className="text-muted-foreground text-base">
            Ini meme biar rehat sejenak!
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound404;
