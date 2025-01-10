import { Button } from "@/components/ui/button";
import PopoverWrap from "./popover";

import ThemeSwitcher from "./theme-switcher";
export default function ThemeChange() {
  return (
    <>
      <div className="mx-10 my-12 flex flex-auto flex-wrap gap-8">
        <Button variant="default">default</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="outline">outline</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="link">link</Button>
        <PopoverWrap />
      </div>
      <ThemeSwitcher />
    </>
  );
}
