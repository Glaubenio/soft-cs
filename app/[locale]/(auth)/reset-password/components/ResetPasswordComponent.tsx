"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { GenerateCode } from "./GenerateCode";
import { VerifyCode } from "./VerifyCode";
import { UpdatePassword } from "./UpdatePassword";

enum ResetPasswordStage {
  GenerateCode,
  VerifyCode,
  UpdatePassword
}
export function ResetPasswordComponent() {
  const [stage, setStage] = useState<ResetPasswordStage>(ResetPasswordStage.GenerateCode);
  const [email, setEmail] = useState<string | undefined>()
  const [otp, setOtp] = useState<string | undefined>()

  switch (stage) {
    case ResetPasswordStage.GenerateCode:
      return <GenerateCode onCodeGenerated={(email) => {
        setEmail(email)
        setStage(ResetPasswordStage.VerifyCode)
      }
      } />;
    case ResetPasswordStage.VerifyCode:
      return <VerifyCode
        email={email!}
        onCodeVerified={(code) => {
          setOtp(code)
          setStage(ResetPasswordStage.UpdatePassword)
        }}
        onEmailChangeRequest={() => {
          setEmail(undefined)
          setStage(ResetPasswordStage.GenerateCode)
        }
        } />;
    case ResetPasswordStage.UpdatePassword:
      return <UpdatePassword
        email={email!}
        otp={otp!} />;
  }
}
