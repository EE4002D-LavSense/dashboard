"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  NavbarMenuToggle,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import ThemeSwitch from "../common/theme-switch";

import { navBarItems } from "@/lib/navigation/constants";

export function AppNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to close the mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isSamePath = (path: string) => {
    return pathname.split("/")[1] === path.replace("/", "");
  };

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href="/"
            className="text-3xl font-bold"
            color="foreground"
            onPress={closeMenu}
          >
            LavSense
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navBarItems.map((navItem) => (
          <NavbarItem key={navItem.href} isActive={isSamePath(navItem.href)}>
            <Link
              href={navItem.href}
              color={isSamePath(navItem.href) ? "primary" : "foreground"}
            >
              {navItem.name}
            </Link>
          </NavbarItem>
        ))}
        <ThemeSwitch />
      </NavbarContent>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <NavbarMenu>
        {navBarItems.map((navItem) => (
          <NavbarMenuItem key={navItem.href}>
            <Link
              href={navItem.href}
              color={isSamePath(navItem.href) ? "primary" : "foreground"}
              className="w-full"
              onPress={closeMenu}
            >
              {navItem.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <ThemeSwitch />
      </NavbarMenu>
    </Navbar>
  );
}
