import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export interface ISidebarItem {
  title?: string;
  name?: string;
  url?: string;
  path?: string;
  icon?: LucideIcon | string | ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface ISidebarGroup {
  title?: string;
  label?: string;
  items: ISidebarItem[];
}

export type SidebarItems = ISidebarGroup[];
