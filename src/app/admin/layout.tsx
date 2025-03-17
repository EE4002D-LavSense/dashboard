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
  };

  return (
    <div className="flex flex-col p-4">
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          itemClasses={{
            item: "px-2",
            separator: "px-0",
          }}
        >
          <BreadcrumbItem href="/admin" className="text-blue-600">
            Admin
          </BreadcrumbItem>

          {/* Dropdown for more options */}
          <BreadcrumbItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
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
                <DropdownItem key="dashboard" href="/admin">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="log" href="/admin/log">
                  API Log
                </DropdownItem>
                <DropdownItem key="add-toilet" href="/admin/add-toilet">
                  Add Toilet
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
}
