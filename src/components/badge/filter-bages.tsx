"use client";
import { BadgeCard } from "@/components/badge/badge-card";

import { CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function BadgeWithActions({ badges }) {
  return (
    <Accordion type="single" defaultValue="skills" collapsible className="mx-6 my-6">
      <AccordionItem value={"skills"} className="rounded-xl border px-6">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">徽章墙</CardTitle>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2 rounded-lg">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {badges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
