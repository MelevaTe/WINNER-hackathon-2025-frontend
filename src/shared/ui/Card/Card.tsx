import type { HTMLAttributes } from "react";
import React from "react";
import cls from "./Card.module.scss";
import { classNames } from "../../lib/classNames/classNames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

export const Card = ({ className, children, ...otherprops }: CardProps) => {
	return (
		<div
			className={classNames(cls.Card, {}, [className])}
			{...otherprops}
		>
			{children}
		</div>
	);
};
