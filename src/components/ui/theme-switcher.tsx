"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import * as React from "react";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="noShadow"
      >
        <Sun className="m500:h-4 m500:w-4 hidden h-6 w-6 dark:inline" />
        <Moon className="m500:h-4 m500:w-4 inline h-6 w-6 dark:hidden" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
