import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";

import { requireUser } from "@/lib/dal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

type Tool = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

const tools: Tool[] = [
  {
    icon: QrCodeIcon,
    title: "QR Code Generator",
    description: "Create and download custom QR codes for links, menus, and more.",
    href: "/dashboard/qr",
  },
  {
    icon: ScanBarcodeIcon,
    title: "Barcode Generator",
    description: "Generate barcodes in every major format and export them.",
    href: "/dashboard/barcodes",
  },
  {
    icon: SparklesIcon,
    title: "More tools",
    description: "PDF, image, developer, and AI tools are on the roadmap.",
  },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your tools live here. Pick one to get started — more are on the way.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const card = (
            <Card
              className={cn(
                "h-full transition-colors",
                tool.href && "hover:border-foreground/20 hover:bg-muted/30",
              )}
            >
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-4.5" />
                  </div>
                  {tool.href ? (
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <Badge variant="secondary">Soon</Badge>
                  )}
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          );

          return tool.href ? (
            <Link key={tool.title} href={tool.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={tool.title}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
