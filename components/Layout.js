import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Layout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title ? title + ' - videoOCR' : 'videoOCR'}</title>
                <meta name="description" content="Online-videoOCR Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex min-h-screen flex-col justify-between">
                <header>
                    <nav
                        className="flex h-16 items-center px-4 justify-between shadow-md"
                    >
                        <Link href="/" legacyBehavior>
                            <a className="text-lg font-bold">videoOCR</a>
                        </Link>
                        <div>
                            <Link href="/cart" legacyBehavior>
                                <a className="p-2">Documenation</a>
                            </Link>
                            <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-1 px-4 rounded">
                                Blog
                            </button>
                        </div>
                    </nav>
                </header>
                <main className="container m-auto mt-4 px-4 h-80">{children}</main>
                <footer className="flex h-10 justify-center items-center shadow-inner ">
                    <p>Copyright © 2023 by Apeli Brian</p>
                </footer>
            </div>
        </>
    );
}