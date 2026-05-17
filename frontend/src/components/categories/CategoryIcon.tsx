import {
	Car,
	Film,
	GraduationCap,
	HeartPulse,
	Receipt,
	Shapes,
	ShoppingBag,
	TrendingUp,
	Utensils,
	Wallet,
} from "lucide-react";

const iconMap = {
	utensils: Utensils,
	car: Car,
	receipt: Receipt,
	film: Film,
	"shopping-bag": ShoppingBag,
	wallet: Wallet,
	"trending-up": TrendingUp,
	"heart-pulse": HeartPulse,
	"graduation-cap": GraduationCap,
	shapes: Shapes,
};

export const iconOptions = [
	{ value: "utensils", label: "Food", Icon: Utensils },
	{ value: "car", label: "Transport", Icon: Car },
	{ value: "receipt", label: "Bills", Icon: Receipt },
	{ value: "film", label: "Entertainment", Icon: Film },
	{ value: "shopping-bag", label: "Shopping", Icon: ShoppingBag },
	{ value: "wallet", label: "Salary", Icon: Wallet },
	{ value: "trending-up", label: "Investments", Icon: TrendingUp },
	{ value: "heart-pulse", label: "Health", Icon: HeartPulse },
	{ value: "graduation-cap", label: "Education", Icon: GraduationCap },
	{ value: "shapes", label: "Other", Icon: Shapes },
];

export function resolveCategoryIcon(icon?: string) {
	return iconMap[icon as keyof typeof iconMap] ?? Shapes;
}
