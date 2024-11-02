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

export function AppNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="2xl" isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <h1 className="text-2xl font-bold">LavSense</h1>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navBarItems.map((navItem) => (
          <NavbarItem key={navItem.href}>
            <Link href={navItem.href} color="foreground">
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
            <Link href={navItem.href} color="foreground" className="w-full">
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
