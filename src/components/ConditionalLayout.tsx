"use client";

import { usePathname } from "next/navigation";
import VisualHero from "@/components/VisualHero";
import AnimationToggle from "@/components/AnimationToggle";
import SettingsToggle from "@/components/SettingsToggle";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideVisualHeroPaths = ['/chat'];
  const shouldShowVisualHero = !hideVisualHeroPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {shouldShowVisualHero && <VisualHero />}
      <AnimationToggle />
      <SettingsToggle />
      <div style={{ position: 'relative', zIndex: 20 }}>
        {children}
      </div>
    </>
  );
}