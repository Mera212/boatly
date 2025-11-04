"use client";

import Image from "next/image";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800">
      <Link href="/">
        <Image
          src="/Logo.png"
          alt="Boatly Logo"
          width={120}
          height={25}
          priority
          className="dark:invert"
        />
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
              {session.user?.email}
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} href="/login" variant="outlined">Login</Button>
            <Button component={Link} href="/register" variant="contained">Register</Button>
          </>
        )}
      </div>
    </nav>
  );
}