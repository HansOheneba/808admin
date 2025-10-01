"use client";
import { SignedIn, SignedOut, RedirectToSignIn, } from "@clerk/nextjs";


export default function Home() {

  return (
    <>
      <SignedIn>
        {/* Redirect authenticated users to /events */}
        <meta httpEquiv="refresh" content="0; url=/events" />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
