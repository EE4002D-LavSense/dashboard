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
} from "@nextui-org/react";
import React, { useState } from "react";

import { navBarItems } from "@/lib/navigation/constants";
import { usePathname } from "next/navigation";

export function AppNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="text-3xl font-bold" color="foreground">
            LavSense
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navBarItems.map((navItem) => (
          <NavbarItem key={navItem.href} isActive={navItem.href === pathname}>
            <Link
              href={navItem.href}
              color={navItem.href === pathname ? "primary" : "foreground"}
            >
              {navItem.name}
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem>
          <Button> Sign In </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {navBarItems.map((navItem) => (
          <NavbarMenuItem key={navItem.href}>
            <Link
              href={navItem.href}
              color={navItem.href === pathname ? "primary" : "foreground"}
              className="w-full"
            >
              {navItem.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarItem>
          <Button> Sign In </Button>
        </NavbarItem>
      </NavbarMenu>
    </Navbar>
  );
}
