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
  Loader2 
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Monetization() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "business">("free");
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
      description: "Get started with bingo tracking",
      features: [
        "Create unlimited bingo cards",
        "5x5 grid only",
        "Basic customization",
        "Ad-supported",
        "Share public links",
      ],
      cta: "Start Free",
      icon: Zap,
    },
    {
      id: "pro",
      name: "Pro",
      price: 4.99,
      period: "/month",
      description: "For serious goal trackers",
      features: [
        "Everything in Free",
        "3x3 to 8x8 grid sizes",
        "Advanced customization",
        "Ad-free experience",
        "Custom themes",
        "Deadline timers",
        "Export as image",
        "Analytics dashboard",
      ],
      cta: "Upgrade to Pro",
      icon: Crown,
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: 19.99,
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration (5 users)",
        "Unlimited custom grids",
        "Premium templates",
        "Advanced analytics",
        "API access",
        "Priority support",
        "Custom branding",
      ],
      cta: "Contact Sales",
      icon: Sparkles,
    },
  ];

  const adOptions = [
    {
      title: "Banner Ads (Top)",
      placement: "top",
      size: "728x90",
      revenue: "Low CPM",
    },
    {
      title: "Sidebar Ads",
      placement: "sidebar",
      size: "300x600",
      revenue: "Medium CPM",
    },
    {
      title: "Native Ads",
      placement: "inline",
      size: "Native",
      revenue: "High CPM",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-2 py-2 flex items-center justify-between gap-2">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Goal Bingo - Monetization
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-2 py-8">
        {/* Pricing Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Unlock premium features and remove ads
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`p-6 relative flex flex-col transition-all ${
                    plan.popular
                      ? "ring-2 ring-primary md:scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full mb-6"
                    variant={
                      selectedPlan === plan.id ? "default" : "outline"
                    }
                    onClick={() => {
                      if (plan.id !== "free") {
                        handleUpgrade(plan.name);
                      }
                    }}
                    disabled={isLoading && selectedPlan === plan.id}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {plan.cta}
                  </Button>

                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Ad Network Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Ad Placements
            </h2>
            <p className="text-muted-foreground text-lg">
              Free users see targeted ads - choose your preferred placement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adOptions.map((ad) => (
              <Card key={ad.placement} className="p-6 hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="font-semibold">{ad.size}</p>
                    <p className="text-xs">Ad Preview</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{ad.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Placement: {ad.placement}
                </p>
                <Badge variant="secondary">{ad.revenue}</Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Revenue Sharing Section */}
        <section className="mb-16">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Revenue Sharing</h3>
                <p className="text-muted-foreground mb-4">
                  Help other users discover Goal Bingo and earn rewards
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Referral Commission</p>
                    <p className="text-2xl font-bold">30%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ad Revenue Share</p>
                    <p className="text-2xl font-bold">50%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Bonus</p>
                    <p className="text-2xl font-bold">$100+</p>
                  </div>
                </div>
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Start Earning
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Features Comparison */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Features Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 font-semibold">Pro</th>
                  <th className="text-center py-3 px-4 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Unlimited Cards</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Grid Customization</td>
                  <td className="text-center text-muted-foreground">5x5 Only</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Ad-Free</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Team Collaboration</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">API Access</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Priority Support</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center text-muted-foreground">No</td>
                  <td className="text-center">
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
