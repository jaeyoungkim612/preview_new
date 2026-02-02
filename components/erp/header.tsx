"use client";

import { Bell, Search, Calendar, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
}

export function Header({ title, breadcrumb = [] }: HeaderProps) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
              {breadcrumb.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                  {item}
                  {index < breadcrumb.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="통합 검색..."
            className="w-64 pl-9 bg-secondary border-border"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{today}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>한국 서버 (KR)</DropdownMenuItem>
            <DropdownMenuItem>베트남 서버 (VN)</DropdownMenuItem>
            <DropdownMenuItem>중국 서버 (CN)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
