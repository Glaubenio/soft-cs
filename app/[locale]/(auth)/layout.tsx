import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import "@/app/[locale]/globals.css";

type Props = {
  params: Promise<{ locale: string }>;
};

async function getLocales(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const messages = await getLocales(locale);
  const t = createTranslator({ locale, messages });
  return {
    title: t("RootLayout.title"),
    description: t("RootLayout.description"),
  };
}

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-[url(/images/bg.png)] bg-repeat-round" >
      <img src="/images/wave1.svg" className="absolute top-0 left-0 opacity-50 mix-blend-overlay w-[600px]" />
      <img src="/images/wave2.svg" className="absolute top-0 left-0 opacity-60 mix-blend-overlay w-[600px]" />
      <div className="flex items-center grow h-full overflow-hidden">
        {children}
      </div>
      <img src="/images/logo.svg" className="absolute bottom-0 right-0 mix-blend-overlay h-[25vh]" />
    </div>
  );
};

export default AuthLayout;
