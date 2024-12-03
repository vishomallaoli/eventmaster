// src/app/(auth)/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign up | Eventmaster',
    description: 'InCoder Web',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
