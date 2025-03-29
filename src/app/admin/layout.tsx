"use client";

import {
  Breadcrumbs,
  BreadcrumbItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { adminRoutes } from "@/lib/navigation/constants";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mapPathName = {
    "/admin": "Dashboard",
    "/admin/log": "API Log",
    "/admin/add-toilet": "Add Toilet",
    "/admin/analytics": "Analytics",
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="p-2">
        <Breadcrumbs
          itemClasses={{
            item: "px-2",
            separator: "px-0",
          }}
        >
          <BreadcrumbItem href="/">Home</BreadcrumbItem>

          {/* Dropdown for more options */}
          <BreadcrumbItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  aria-label="More Options"
                  className="h-6 pr-2 text-small"
                  endContent={<ChevronDownIcon className="text-default-500" />}
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  {mapPathName[pathname as keyof typeof mapPathName]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="More Options">
                {adminRoutes.map((route) => (
                  <DropdownItem key={route.key} href={route.href}>
                    {route.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
}
