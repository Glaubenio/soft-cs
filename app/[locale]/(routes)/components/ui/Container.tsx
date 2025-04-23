import { Separator } from "@/components/ui/separator";
import React from "react";

interface ContainerProps {
  title: string;
  description: string;
  visibility?: string;
  children: React.ReactNode;
}

const Container = ({
  children,
}: ContainerProps) => {
  return (
    <div className="flex-1 space-y-4 h-full overflow-hidden">
      {children}
    </div>
  );
};

export default Container;
