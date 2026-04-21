"use client";

import Link from "next/link";

interface CtaBandProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CtaBand({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <div className="cta-band">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="cta-row">
        <Link href={primaryHref} className="btn-lg btn-primary-lg">
          {primaryLabel}
        </Link>

        {secondaryHref && (
          <Link href="/pricing" className="btn-lg btn-outline-lg">
            See Pricing
          </Link>
        )}
      </div>
    </div>
  );
}
