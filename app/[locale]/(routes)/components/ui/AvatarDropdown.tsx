"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

import { BookUser, LogOut, User2, Users, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAvatarStore from "@/store/useAvatarStore";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

type Props = {
  avatar: string;
  userId: string;
  name: string;
  isAdmin: boolean;
};

const AvatarDropdown = ({ avatar, name, isAdmin }: Props) => {
  const router = useRouter();
  const setAvatar = useAvatarStore((state) => state.setAvatar);
  const getAvatar = useAvatarStore((state) => state.avatar);
  const [newAvatar, setNewAvatar] = useState(getAvatar);

  useEffect(() => {
    setAvatar(avatar);
  }, [avatar, setAvatar]);

  useEffect(() => {
    setNewAvatar(getAvatar);
  }, [getAvatar]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex space-x-2 items-center text-start">
        <Avatar>
          <AvatarImage
            src={
              newAvatar
                ? newAvatar
                : `${process.env.NEXT_PUBLIC_APP_URL}/images/nouser.png`
            }
          />
        </Avatar>
        <div>
          <div className="whitespace-nowrap text-[14px] font-[400]">{name}</div>
          <div className="text-light-gray text-[12px] font-[400]">{isAdmin ? 'Admin' : 'Operador'}</div>
        </div>
        <CaretDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {
          isAdmin && (
            <>
              <DropdownMenuLabel>Administração</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/accounts")}>
                  <BookUser className="w-4 h-4 inline-block mr-2 stroke-current text-gray-500" />
                  <span>Contas</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/users")}>
                  <Users2 className="w-4 h-4 inline-block mr-2 stroke-current text-gray-500" />
                  <span>Usuários</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="w-4 h-4 inline-block mr-2 stroke-current text-gray-500" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
