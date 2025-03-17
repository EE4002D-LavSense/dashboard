"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "./icons";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <Switch
        color="default"
        size="lg"
        thumbIcon={() => (
          <div className="h-6 w-12 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
        )}
      ></Switch>
    );

  return (
    <Switch
      defaultSelected
      color="default"
      size="lg"
      isSelected={theme == "light"}
      onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    ></Switch>
  );
}
