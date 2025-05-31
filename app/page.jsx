"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cookies from 'js-cookie';
import { useState } from "react";
export default function Home() {
  const [session, setSession] = useState(null);
  const handleGetSession = () => {
    const sessionRaw = Cookies.get('session');
    if (!sessionRaw) {
      setSession(null);
      alert("Brak sesji!");
      return;
    }
    try {
      const sessionData = JSON.parse(sessionRaw);
      setSession(sessionData);
      console.log("Twoje dane z sesji:", sessionData);
    } catch (e) {
      setSession(null);
      alert("Błędny format sesji!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>

      <div className="space-x-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline">Register</Button>

        </Link>

        <div>
          <button onClick={handleGetSession}>Get session</button>

        </div>
      </div>
    </div>
  );
}
