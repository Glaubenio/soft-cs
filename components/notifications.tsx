import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Bell, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

const NotificationsComponent = () => {
  return (
    <Popover>
      <PopoverTrigger className="rounded-md p-3">
        <Bell className="cursor-pointer w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col space-y-2 mt-3 min-w-[400px]"
        align={"end"}
      >
        Em breve!
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsComponent;
