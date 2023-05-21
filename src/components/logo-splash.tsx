import Image from "next/image";

export const LogoSplash = () => (
  <div className="grid h-screen animate-pulse place-items-center">
    <Image
      className="m-auto animate-bounce"
      src="/Logo.svg"
      width={78}
      height={60}
      alt="improveme.io logo"
    />
  </div>
);
