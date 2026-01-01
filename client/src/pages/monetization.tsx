import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Sparkles, 
  Crown, 
  Check, 
  TrendingUp, 
  Share2, 
  Loader2,
  Image as ImageIcon,
  MousePointer2,
  MonitorOff
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Monetization() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = (plan: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Upgrading to ${plan} plan...`);
    }, 1000);
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Basic goal tracking for everyone",
      features: [
        "Create 1 board",
        "Track goals",
        "Basic customization",
        "Ad-supported experience",
      ],
      cta: "Current Plan",
      icon: Zap,
      disabled: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 4.99,
      period: "/month",
      description: "For serious goal achievers",
      features: [
        "Unlimited boards",
        "Glass tiles effect",
        "Image backgrounds & tiles",
        "Marker customization",
        "Ad-free experience",
        "Export board as image",
      ],
      cta: "Upgrade to Pro",
      icon: Crown,
      popular: true,
    },
  ];

  const adRewards = [
    {
      title: "Unlock Premium Theme",
      description: "Get access to all glass effects and premium colors",
      duration: "1h",
      icon: Sparkles,
      action: "Watch ad → unlock",
    },
    {
      title: "Remove Ads",
      description: "Browse and edit without any interruptions",
      duration: "1h",
      icon: MonitorOff,
      action: "Watch ad → remove",
    },
    {
      title: "One-time Export",
      description: "Export your current board as a high-quality image",
      duration: "Once",
      icon: Share2,
      action: "Watch ad → export",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Goal Bingo Shop
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>Back to Board</Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Upgrade Your Experience</h2>
          <p className="text-muted-foreground">Unlock the full potential of your goal tracking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`p-8 relative flex flex-col transition-all hover:shadow-lg ${
                  plan.popular ? "ring-2 ring-primary border-primary/50" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    MOST POPULAR
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>

                <div className="space-y-4 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="bg-primary/20 p-0.5 rounded-full">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-12 text-lg font-semibold"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.disabled || isLoading}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : plan.cta}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Ad Rewards Section */}
        <div className="border-t pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Support the App</h2>
            <p className="text-muted-foreground">Watch a short ad to unlock premium perks for a limited time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adRewards.map((reward) => {
              const Icon = reward.icon;
              return (
                <Card key={reward.title} className="p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{reward.title}</h4>
                      <Badge variant="secondary" className="mt-1">{reward.duration}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {reward.description}
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full justify-between group"
                    onClick={() => alert("Showing ad... Reward will be active for " + reward.duration)}
                  >
                    <span>{reward.action}</span>
                    <Sparkles className="w-4 h-4 text-primary group-hover:animate-pulse" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground border-t mt-16">
        <p className="text-sm">Thank you for supporting Goal Bingo!</p>
      </footer>
    </div>
  );
}
