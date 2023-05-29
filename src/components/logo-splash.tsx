import Image from "next/image";

export const LogoSplash = () => (
  <div className="grid h-screen animate-pulse place-items-center">
    <Image
      className="m-auto hidden animate-bounce dark:inline"
      src={"/Logo-dark.svg"}
      width={78}
      height={60}
      alt="improveme.io logo"
    />
    <Image
      className="m-auto inline animate-bounce dark:hidden"
      src={"/Logo.svg"}
      width={78}
      height={60}
      alt="improveme.io logo"
    />
  </div>
);
