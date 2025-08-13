"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/login");
    }
  };

  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarBrand className="gap-2">
        <Image src={logo} alt="Logo" width={36} height={36} priority />
      </NavbarBrand>

      {/* Show links on all screen sizes (removed 'hidden sm:flex') */}
      <NavbarContent className="flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#graph">
            Graph
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#data">
            Data
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="danger" variant="flat" onPress={handleLogout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
