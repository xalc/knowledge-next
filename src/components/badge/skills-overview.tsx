import { CardTitle } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function SkillsOverView({ skills }) {
  return (
    <Accordion type="single" collapsible className="mx-6 my-6">
      {/* By Issuer */}

      <AccordionItem value={"skills"} className="rounded-xl border px-6">
        <AccordionTrigger className="hover:no-underline">
          <CardTitle>Top 50 技能标签</CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2 rounded-lg">
            {skills.slice(0, 50).map(skill => (
              <Badge key={skill[0]} variant="secondary" className="hover:bg-primary">
                {skill[0]} ({skill[1]})
              </Badge>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
