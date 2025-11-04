import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Boatly Logo"
          width={120}
          height={25}
          priority
          className="dark:invert"
        />
      </Link>
      <div className="flex gap-4">
        <Button component={Link} href="/login" variant="outlined">Login</Button>
        <Button component={Link} href="/register" variant="contained">Register</Button>
      </div>
    </nav>
  );
}