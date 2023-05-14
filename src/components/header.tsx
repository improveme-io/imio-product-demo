"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/utils/style";

type HeaderProps = {
  title: string;
  small: boolean;
  children: React.ReactNode;
};

export const Header = (props: HeaderProps) => {
  const isSmall = props.small;
  return (
    <header
      className={cn(
        isSmall ? "bg-opacity-70 py-2" : "py-8",
        "sticky top-0 z-40 flex flex-col bg-stone-100 px-8 transition-all duration-500"
      )}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              className="mr-4 transition-all duration-300"
              src="/Logo.svg"
              width={isSmall ? 78 / 3 : 78 / 2}
              height={isSmall ? 60 / 3 : 60 / 2}
              alt="improveme.io logo"
            />
          </Link>{" "}
          <h1
            className={cn(
              isSmall ? "-translate-y-16" : "-translate-y-0",
              "group mr-auto flex font-serif text-3xl tracking-tight transition-transform delay-500 duration-300"
            )}
          >
            {props.title}
          </h1>
        </div>
        <div
          className={cn(
            isSmall ? "mr-3" : "mr-6",
            "ml-auto flex items-center text-right"
          )}
        >
          {props.children}
        </div>
        <div className="mt-1 flex flex-col items-end">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
