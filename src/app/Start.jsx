import Image from "next/image";
import { Button } from "@mui/material";

export default function Start() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="row-start-2 flex flex-col items-center justify-center gap-8">
        <Image 
          className="dark:invert" // You may not need dark:invert if the logo has a transparent background
          src="/Logo.png"
          alt="Logo"
          width={280} 
          height={38}
          priority
        />
        <div className="flex gap-4">
          <Button variant="contained">Login</Button>
          <Button variant="contained">Register</Button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
