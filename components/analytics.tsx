// components/Analytics.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";
import * as gtag from "../lib/gtag";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    gtag.pageview(pathname);
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
