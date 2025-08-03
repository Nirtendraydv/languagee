"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type NavItemProps = {
  href: string;
  children: ReactNode;
};

export default function NavItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "text-lg md:text-base font-medium transition-colors hover:text-primary relative",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full hidden md:block"></span>
      )}
    </Link>
  );
}
