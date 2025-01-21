import { Button } from "@/components/ui/button";
import PopoverWrap from "./popover";
import Image from "next/image";
import LogoSrc from "/public/images/HX.svg";
import LogoDarkSrc from "/public/images/HX-dark.svg";
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

      <div className="my-8 flex gap-6">
        <Image src={LogoSrc} width={256} alt="logo"></Image>
        <Image src={LogoDarkSrc} width={256} alt="logo"></Image>
      </div>
      <div className="my-8 flex gap-6">
        <div className="h-8 w-8 bg-violet-500"></div>
        <div className="h-8 w-8 bg-violet-950/50"></div>
      </div>
    </>
  );
}
