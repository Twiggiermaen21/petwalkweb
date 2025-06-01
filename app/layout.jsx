'use client';

import '@/app/globals.css'; // <-- To MUSI być na górze!
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import NavBar from "@/components/NavBar";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { authReady, checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    const inAuthScreen = pathname.startsWith('/auth');
    const inTabsScreen = pathname.startsWith('/tabs');
    const isSignedIn = user && token;
    if (!isSignedIn && !inAuthScreen) {
      router.replace('/auth');
    } else if (isSignedIn && inAuthScreen) {
      router.replace('/tabs');
    }
  }, [authReady, user, token, pathname]);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen"> {/* bg-gray-50 na start */}
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
