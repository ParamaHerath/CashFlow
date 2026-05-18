"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

const highlights = [
  {
    title: "Clarity first",
    copy: "Track spending and savings with calm, precise visuals.",
  },
  {
    title: "Smart budgets",
    copy: "Set limits, see progress, and get gentle nudges.",
  },
  {
    title: "Live insights",
    copy: "Know your trends before the month closes.",
  },
];

export default function Home() {
  const { user, hasBootstrapped } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasBootstrapped && user) {
      router.replace("/dashboard");
    }
  }, [hasBootstrapped, user, router]);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-16 top-40 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles size={14} />
              Crafted for modern money teams
            </div>
            <h1 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
              CashFlow helps you orchestrate every dollar with
              <span className="text-primary"> calm precision</span>.
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              A premium personal finance studio with live insights, budgets, and
              smart automation for everyday decisions.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Get started
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="space-y-6 border border-border/40 bg-card/70 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Monthly overview
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-semibold">
                    $18,420.32
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Net balance across all accounts
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/15 px-3 py-2 text-xs font-semibold text-primary">
                  +12.4%
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Savings
                    </p>
                    <p className="font-display text-lg font-semibold">$3,260</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Goal 68%</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Spending
                    </p>
                    <p className="font-display text-lg font-semibold">$4,812</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Down 6.2%</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-[0_20px_50px_-30px_hsl(var(--shadow-color)_/_0.4)] backdrop-blur"
            >
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.copy}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
