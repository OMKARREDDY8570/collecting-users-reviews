"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: any;
  }
}

interface TurnstileProps {
  onToken: (token: string) => void;
}

export default function Turnstile({ onToken }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const script = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile/"]'
    );

    if (!script) {
      const newScript = document.createElement("script");
      newScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      newScript.async = true;
      newScript.defer = true;
      document.head.appendChild(newScript);

      newScript.onload = () => {
        if (containerRef.current && window.turnstile) {
          const widgetId = window.turnstile.render(containerRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: handleCallback,
            "error-callback": handleError,
            theme: "light",
          });
          widgetIdRef.current = widgetId;
        }
      };
    } else if (window.turnstile && containerRef.current) {
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: handleCallback,
        "error-callback": handleError,
        theme: "light",
      });
      widgetIdRef.current = widgetId;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const handleCallback = (token: string) => {
    onToken(token);
  };

  const handleError = () => {
    console.error("Turnstile error");
    onToken("");
  };

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />
    </div>
  );
}
