import '../src/style.css';
import ClientLayout from '../src/Components/ClientLayout';

export const metadata = {
    title: 'Smart Weather App',
    description: 'AI-powered weather predictions',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true} data-scroll-behavior="smooth">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </head>
            <body suppressHydrationWarning={true}>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
