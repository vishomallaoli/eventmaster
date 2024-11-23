// src/app/(auth)/(routes)/signup/layout.tsx

'use client';  // This marks the component as a client-side component

import React, { useEffect, useState } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { auth } from '@/lib/firebaseConfig'; 
import { onAuthStateChanged, User } from 'firebase/auth';

// No need for metadata here since it’s a client component
const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser ?? null);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <NextTopLoader color="#000" showSpinner={false} />
            {/* Safely access user properties */}
            {user ? <p>Welcome, {user?.email}!</p> : <p>Please sign up.</p>}
            {children}
        </>
    );
};

export default SignUpLayout;
