import type { HTMLAttributes } from "react";
import type { Mods } from "@/shared/lib/classNames/classNames";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./Badge.module.scss";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	variant?: "primary" | "outline" | "secondary";
	hover?: boolean;
	disabled?: boolean;
}

export const Badge = ({ className, variant = "primary", hover, disabled, children, onClick, ...props }: BadgeProps) => {
	const mods: Mods = {
		[cls.badgeHover]: hover && !disabled,
		[cls.badgeDisabled]: disabled,
	};

	const variantClass = cls[`badge${variant.charAt(0).toUpperCase()}${variant.slice(1)}`];

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;
		onClick?.(e);
	};

	return (
		<div
			className={classNames(cls.badge, mods, [className, variantClass])}
			onClick={handleClick}
			{...props}
		>
			{children}
		</div>
	);
};
