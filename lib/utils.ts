import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToRgbA(hex: string, alpha: number) {
  var c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
  }
  throw new Error('Bad Hex');
}

export function generateRandomPassword() {
  const length = 10;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-={}[];',./<>?~`|:\"\\";

  let password = "";

  // Add one uppercase letter
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );

  // Add one numeric digit
  password += numericChars.charAt(
    Math.floor(Math.random() * numericChars.length)
  );

  // Add at least one special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Add remaining characters randomly
  const remainingChars =
    uppercaseChars + uppercaseChars.toLowerCase() + numericChars + specialChars;
  for (let i = 3; i < length; i++) {
    password += remainingChars.charAt(
      Math.floor(Math.random() * remainingChars.length)
    );
  }

  // Shuffle the password to make it more random
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return password;
}
