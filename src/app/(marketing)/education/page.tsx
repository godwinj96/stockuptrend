import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: 'Education | StockUptrend',
  description: 'Learn trading fundamentals, technical analysis, and risk management with our free educational resources.',
}

type Category = 'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Strategy'

interface Article {
  slug: string
  title: string
  excerpt: string
  category: Exclude<Category, 'All'>
  readTime: number
}

const ARTICLES: Article[] = [
  {
    slug: 'what-is-forex-trading',
    title: 'What Is Forex Trading?',
    excerpt: 'An introduction to the foreign exchange market — how it works, who participates, and why it is the world\'s most liquid market with over $7.5 trillion traded daily.',
    category: 'Beginner',
    readTime: 5,
  },
  {
    slug: 'understanding-leverage',
    title: 'Understanding Leverage in Trading',
    excerpt: 'Leverage amplifies both profits and losses. Learn how margin works, how to calculate position sizes, and how to use leverage responsibly to protect your capital.',
    category: 'Beginner',
    readTime: 7,
  },
  {
    slug: 'risk-management-101',
    title: 'Risk Management 101',
    excerpt: 'Professional traders survive long-term because of discipline, not luck. Discover the core rules — the 1% rule, stop-loss placement, and portfolio diversification.',
    category: 'Beginner',
    readTime: 8,
  },
  {
    slug: 'reading-candlestick-charts',
    title: 'Reading Candlestick Charts',
    excerpt: 'Candlestick patterns are the language of price action. Learn to identify doji, engulfing, pin bar, and hammer patterns and what they signal about market sentiment.',
    category: 'Intermediate',
    readTime: 10,
  },
  {
    slug: 'moving-averages-explained',
    title: 'Moving Averages Explained',
    excerpt: 'From simple to exponential moving averages, understand how these trend-following indicators smooth price data and generate actionable buy and sell signals.',
    category: 'Intermediate',
    readTime: 9,
  },
  {
    slug: 'psychology-of-trading',
    title: 'The Psychology of Trading',
    excerpt: 'Fear, greed, and overconfidence are the biggest enemies of a trader. Explore how cognitive biases affect decision-making and how to build a disciplined mindset.',
    category: 'Advanced',
    readTime: 12,
  },
  {
    slug: 'introduction-to-technical-analysis',
    title: 'Introduction to Technical Analysis',
    excerpt: 'Support, resistance, trend lines, and chart patterns form the foundation of technical analysis. Learn to read market structure and anticipate price movements.',
    category: 'Intermediate',
    readTime: 11,
  },
  {
    slug: 'fundamental-analysis-for-forex',
    title: 'Fundamental Analysis for Forex',
    excerpt: 'Interest rates, inflation data, and geopolitical events drive long-term currency moves. Understand the economic indicators that matter most to forex traders.',
    category: 'Advanced',
    readTime: 13,
  },
  {
    slug: 'building-a-trading-plan',
    title: 'Building a Trading Plan',
    excerpt: 'A documented trading plan separates professionals from gamblers. Learn how to define your edge, set rules for entry and exit, and track your performance.',
    category: 'Strategy',
    readTime: 10,
  },
  {
    slug: 'scalping-vs-swing-trading',
    title: 'Scalping vs Swing Trading',
    excerpt: 'Different time horizons require different skills and temperaments. Compare day trading, scalping, and swing trading to find the style that fits your lifestyle.',
    category: 'Strategy',
    readTime: 8,
  },
]

const CATEGORY_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Beginner:     'bg-accent-secondary-muted text-accent-secondary',
  Intermediate: 'bg-accent-primary-muted text-accent-primary',
  Advanced:     'bg-accent-gold-muted text-accent-gold',
  Strategy:     'bg-danger-muted text-danger',
}

const CATEGORIES: Category[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Strategy']

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero */}
      <section className="border-b border-border-subtle bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="anim-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary-muted px-4 py-1.5 text-xs font-medium text-accent-primary">
            <BookOpen className="h-3.5 w-3.5" />
            AI Investor Education
          </div>
          <h1 className="anim-fade-up font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl" style={{ animationDelay: '60ms' }}>
            Understand Your
            <br />
            <span className="text-accent-primary">AI Investor</span>
          </h1>
          <p className="anim-fade-up mx-auto mt-4 max-w-xl text-base text-text-secondary" style={{ animationDelay: '120ms' }}>
            The more you understand how markets work, the more confident you&apos;ll feel watching your
            AI execute. These guides cover the fundamentals — no prior experience required.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Category pills */}
        <div className="anim-fade-up mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={cn(
                'cursor-default rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                cat === 'All'
                  ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-default',
              )}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Article grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <Link
              key={article.slug}
              href={`/education/${article.slug}`}
              className={cn(
                'anim-fade-up group flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card transition-all duration-200 hover:border-accent-primary/40 hover:shadow-elevated',
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', CATEGORY_COLORS[article.category])}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <Clock className="h-3 w-3" />
                  {article.readTime} min
                </span>
              </div>

              <h3 className="mb-2 font-display text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent-primary">
                {article.title}
              </h3>

              <p className="flex-1 text-xs leading-relaxed text-text-secondary line-clamp-3">
                {article.excerpt}
              </p>

              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-accent-primary">
                Read article
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="anim-fade-up mt-16 rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Ready to activate your AI portfolio?
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Deposit, choose a strategy, and your AI starts working immediately.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent"
            >
              Get Started
            </Link>
            <Link
              href="/trading-instruments"
              className="rounded-lg border border-border-default px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated"
            >
              Explore Markets
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
