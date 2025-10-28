import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-between items-center border-b bg-white dark:bg-black">
    <Button>add new</Button>
    <Button>add new</Button>
    <Button>add new</Button>
    </nav>
  );
}