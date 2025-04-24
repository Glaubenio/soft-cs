import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
  username?: string;
  avatar?: string | null;
  email: string;
  password: string;
  userLanguage: string;
  recoverPasswordCode: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const PasswordResetEmail = ({
  username,
  avatar,
  email,
  password,
  userLanguage,
  recoverPasswordCode
}: VercelInviteUserEmailProps) => {
  const previewText = `Password reset from ${process.env.NEXT_PUBLIC_APP_NAME}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={avatar || `${baseUrl}/images/nouser.png`}
                width="50"
                height="50"
                alt="User Avatar"
                className="my-0 mx-auto rounded-full"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Recuperação de senha para o usuário: <strong>{username}</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá, {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Use o código abaixo para redefinir sua senha
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Seu código é: ${recoverPasswordCode}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
