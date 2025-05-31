"use client";
import { useEffect, useState } from "react";
import { removeCookie } from "@/lib/cookies";
import Cookies from 'js-cookie';

export default function HomePage() {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {

        const sessionRaw = Cookies.get('session');

        if (!sessionRaw) {
            setError(true);
            return;
        }
        try {
            const sessionObj = JSON.parse(sessionRaw);
            setSession(sessionObj);
            setError(false);
        } catch {
            setError(true);
        }
    }, []);

    if (error) {
        return (
            <main>
                <h1 style={{ color: "red" }}>Błąd logowania lub brak sesji.</h1>
            </main>
        );
    }

    if (!session) {
        return (
            <main>
                <h1>Ładowanie...</h1>
            </main>
        );
    }

    return (
        <main>
            <h1>Zalogowano poprawnie!</h1>
            <h2>Dane sesji:</h2>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            {session.user && (
                <div>
                    <p>Email: {session.user.email}</p>
                    <p>ID: {session.user.id}</p>
                </div>
            )}

            <div>
                <button onClick={removeCookie('session')}> logout</button>
            </div>

        </main>
    );
}
