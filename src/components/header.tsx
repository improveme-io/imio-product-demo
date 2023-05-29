"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/utils/style";

type HeaderProps = {
  title: string;
  isSmall: boolean;
  children?: React.ReactNode;
};

export const Header = (props: HeaderProps) => {
  return (
    <header
      className={cn(
        props.isSmall
          ? "min-h-[4em] bg-opacity-70 py-2 dark:bg-opacity-70"
          : "py-8",
        "sticky top-0 z-40 flex flex-col overflow-hidden bg-stone-100 px-8 transition-all duration-500 dark:bg-stone-950 "
      )}
    >
      <div className="flex w-full flex-col justify-between sm:flex-row">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              className={cn([
                props.isSmall && "translate-y-3 sm:translate-y-0",
                "mr-4 hidden transition-all duration-300 dark:inline",
              ])}
              src={"/Logo-dark.svg"}
              width={props.isSmall ? 78 / 3 : 78 / 2}
              height={props.isSmall ? 60 / 3 : 60 / 2}
              alt="improveme.io logo"
            />
            <Image
              className={cn([
                props.isSmall && "translate-y-3 sm:translate-y-0",
                "mr-4 inline transition-all duration-300 dark:hidden",
              ])}
              src={"/Logo.svg"}
              width={props.isSmall ? 78 / 3 : 78 / 2}
              height={props.isSmall ? 60 / 3 : 60 / 2}
              alt="improveme.io logo"
            />
          </Link>{" "}
          <h1
            className={cn(
              "group ml-2 mr-auto flex font-serif text-3xl tracking-tight transition-transform duration-300 delay-500 sm:ml-0",
              props.isSmall && "hidden sm:flex sm:-translate-y-16",
              !props.isSmall && "-translate-y-0"
            )}
          >
            {props.title}
          </h1>
        </div>
        <div
          className={cn(
            props.isSmall
              ? "-mt-3 translate-x-12 sm:mt-3 sm:translate-x-0"
              : "mt-3 ",
            "transition-translate flex items-center text-right duration-300 sm:mx-0 sm:ml-auto sm:mr-6 sm:mt-0"
          )}
        >
          {props.children}
        </div>
        <div className="absolute right-3 top-3 mt-1 flex flex-col items-end sm:relative sm:right-auto sm:top-auto">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
