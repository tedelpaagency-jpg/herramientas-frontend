import { Courgette, Poppins, Roboto } from "next/font/google";

export const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});
export const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export const courgette = Courgette({
    weight: ["400"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-courgette",
});