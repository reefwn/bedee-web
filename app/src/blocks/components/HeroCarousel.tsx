'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type FloatingCard = {
  icon: { url?: string | null; alt?: string | null }
  label: string
  sublabel?: string | null
}

type Slide = {
  headline: string
  body?: string | null
  image: { url?: string | null; alt?: string | null }
  ctaLabel?: string | null
  ctaUrl?: string | null
  badgeLabel?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaUrl?: string | null
  checklistItems?: { label: string }[] | null
  floatingCards?: FloatingCard[] | null
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4 flex-none text-secondary">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])
  return reduced
}

// Entrance on slide change: key={index} remounts the slide wrapper below, and
// @starting-style + var(--ease-out) (globals.css) animate it in — 400ms fade
// + 6px rise. See animation-plans/001-hero-crossfade-starting-style.md.
//
// variant "light" mirrors service-page heroes (e.g. bedee.com/teleconsultation):
// pale blue gradient, dark text, coral CTA — vs. the homepage's dark navy->blue
// gradient with white text. Defaults to "dark" so every existing homepage slide
// is visually unchanged.
export function HeroCarousel({
  slides,
  variant = 'dark',
  backgroundImage,
  headingLevel = 'h1',
}: {
  slides: Slide[]
  variant?: 'dark' | 'light' | 'coral' | 'teal' | null
  backgroundImage?: { url?: string | null } | null
  headingLevel?: 'h1' | 'h2'
}) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5_000)
    return () => window.clearInterval(timer)
  }, [slides.length, prefersReducedMotion, index])

  if (!slides?.length) return null
  const slide = slides[index]
  // Any non-"dark" variant with a real backgroundImage renders it as a photo
  // background instead of a flat gradient — decoupled from the specific
  // variant name so a new photo-hero (e.g. a different service page's own
  // brand color) never needs a code change, only a new enum label + upload.
  const isLight = variant !== 'dark'
  const bgImageUrl = backgroundImage?.url
  const hasBackgroundImage = Boolean(bgImageUrl)

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  // Homepage-only treatment (dark variant, flat gradient, no real bg photo —
  // every other hero use either has its own background photo already covering
  // the section, or is a different variant): the slide image bleeds full-
  // height to the section's right edge and fades into the gradient on the
  // edge nearest the text, instead of sitting in a separate boxed thumbnail.
  const useBleedImage = variant === 'dark' && !hasBackgroundImage && Boolean(slide.image?.url)
  const fadeToRight = { maskImage: 'linear-gradient(to right, transparent 0%, black 35%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)' }
  const fadeToBottom = { maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' }

  return (
    <section
      className={`relative overflow-hidden ${isLight ? 'text-ink' : 'text-white'} ${
        hasBackgroundImage ? '' : isLight ? 'bg-gradient-to-br from-[#EAF4FF] to-[#CFE7FF]' : 'bg-gradient-to-br from-primary to-secondary'
      }`}
      style={
        hasBackgroundImage
          ? { minHeight: 720, backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { minHeight: 720 }
      }
    >
      {useBleedImage && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block" style={fadeToRight}>
          <Image
            src={slide.image.url as string}
            alt={slide.image.alt || slide.headline}
            fill
            priority
            sizes="58vw"
            className="object-cover object-[68%_30%]"
          />
        </div>
      )}
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-6xl px-12 py-14 md:px-20">
        <div
          key={index}
          className="hero-slide flex flex-1 flex-col items-center gap-4 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] md:flex-row md:gap-12 [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
        >
          <div
            className={`flex-1 text-center md:text-left ${
              useBleedImage ? 'md:max-w-[560px] md:flex-none' : slide.floatingCards?.length ? 'md:flex-[5]' : 'md:flex-[3]'
            }`}
          >
            {slide.badgeLabel && (
              <span
                className={`mb-4 inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold ${
                  isLight ? 'bg-white text-primary shadow-sm' : 'bg-white/15 text-white'
                }`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4 flex-none">
                  <path
                    d="M10 2l6 2.4v5.1c0 4-2.6 6.8-6 8.5-3.4-1.7-6-4.5-6-8.5V4.4L10 2z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
                {slide.badgeLabel}
              </span>
            )}
            {headingLevel === 'h2' ? (
              <h2
                className={`whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px] ${isLight ? 'text-primary' : ''}`}
              >
                {slide.headline}
              </h2>
            ) : (
              <h1
                className={`whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px] ${isLight ? 'text-primary' : ''}`}
              >
                {slide.headline}
              </h1>
            )}
            {slide.body && (
              <p className={`mt-4 text-lg font-medium leading-relaxed ${isLight ? 'text-ink' : ''}`}>
                {slide.body}
              </p>
            )}
            {(slide.ctaLabel || slide.secondaryCtaLabel) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:justify-start">
                {slide.ctaLabel && slide.ctaUrl && (
                  <a
                    href={slide.ctaUrl}
                    className={`inline-block rounded-pill px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                      isLight ? 'bg-accent' : 'bg-primary'
                    }`}
                  >
                    {slide.ctaLabel}
                  </a>
                )}
                {slide.secondaryCtaLabel && slide.secondaryCtaUrl && (
                  <a
                    href={slide.secondaryCtaUrl}
                    className={`border-b-2 pb-0.5 text-[15px] font-semibold focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${
                      isLight ? 'border-primary text-primary' : 'border-white text-white'
                    }`}
                  >
                    {slide.secondaryCtaLabel}
                  </a>
                )}
              </div>
            )}
            {slide.checklistItems && slide.checklistItems.length > 0 && (
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
                {slide.checklistItems.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-sm font-medium ${isLight ? 'text-ink' : 'text-white/90'}`}
                  >
                    <CheckIcon />
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {useBleedImage ? (
            <div className="relative h-64 w-full overflow-hidden rounded-[28px] md:hidden" style={fadeToBottom}>
              <Image
                src={slide.image.url as string}
                alt={slide.image.alt || slide.headline}
                fill
                priority
                sizes="90vw"
                className="object-cover object-[68%_30%]"
              />
            </div>
          ) : (
            <div
              className={`relative w-full flex-none md:w-auto ${
                slide.floatingCards?.length ? 'md:flex-[6] md:self-stretch' : 'md:flex-[2]'
              }`}
            >
              {slide.image?.url && (
                <Image
                  src={slide.image.url}
                  alt={slide.image.alt || slide.headline}
                  width={640}
                  height={slide.floatingCards?.length ? 480 : 654}
                  className={
                    slide.floatingCards?.length
                      ? 'h-[280px] w-full rounded-[28px] object-cover shadow-lg sm:h-[360px] md:h-full'
                      : 'max-h-[580px] w-full object-contain'
                  }
                />
              )}
              {slide.floatingCards?.map((card, i) => (
                <div
                  key={i}
                  className={`absolute flex max-w-[220px] items-center gap-3 rounded-2xl bg-white p-3 shadow-lg ${
                    i === 0 ? '-top-4 right-4 sm:right-6' : '-bottom-4 left-4 sm:left-6'
                  }`}
                >
                  {card.icon?.url && (
                    <Image src={card.icon.url} alt={card.icon.alt || card.label} width={36} height={36} className="h-9 w-9 flex-none" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-primary">{card.label}</p>
                    {card.sublabel && <p className="text-xs text-muted">{card.sublabel}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className={`arrow-hover absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${isLight ? 'text-primary' : ''}`}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className={`arrow-hover absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] ${isLight ? 'text-primary' : ''}`}
          >
            ›
          </button>
        </>
      )}
    </section>
  )
}
