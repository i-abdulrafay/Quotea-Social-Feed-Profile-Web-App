import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Quotea",
  description: "Share and discover great quotes",
  icons: {
    icon: "/quotes.png", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
