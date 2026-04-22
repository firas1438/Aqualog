import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { nav_links } from "@/constants"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-8">
          {nav_links.map((link, index) => (
            <SheetClose asChild key={index}>
              <Button variant="ghost" asChild className="w-full justify-start" >
                <Link href={link.link}>{link.name}</Link>
              </Button>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link href="/features" className="w-full mt-4">
              <Button size="lg" variant="outline" className="w-full">
                About
              </Button>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu 