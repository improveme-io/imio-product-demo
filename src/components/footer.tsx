import { Button } from "./ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex justify-between bg-stone-600 px-8 py-8">
      <div className="w-1/3">
        <p className="text-xs text-stone-800">
          improveme.io is private passion project of Reuven I. Kristof Gatter
          and Mihaly Furedi. Scientific support provided by Dr. Brooke Gazdag.
        </p>
        <p className="text-xs text-stone-800">
          We proudly run on Vercel and Planetscale.
        </p>
      </div>
      <div className="w-2/3 text-right">
        <Button asChild className="text-stone-50" variant={"link"}>
          <Link href="/legal">Contact & Legal</Link>
        </Button>
        <Button className="text-stone-50" variant={"link"}>
          <Link href="/legal/terms-and-conditions">Terms & Conditions</Link>
        </Button>
        <Button className="text-stone-50" variant={"link"}>
          <Link href="/legal/privacy-policy">Privacy Policy</Link>
        </Button>
        <Button className="text-stone-50" variant={"link"}>
          <Link href="/legal/anti-discrimination-policy">
            Anti-Discrimination Policy
          </Link>
        </Button>
      </div>
    </footer>
  );
};
