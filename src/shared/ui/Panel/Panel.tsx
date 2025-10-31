import type { HTMLAttributes } from "react";
import React from "react";
import cls from "./Panel.module.scss";
import { classNames } from "../../lib/classNames/classNames";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

export const Panel = ({ className, children, ...otherprops }: PanelProps) => {
	return (
		<div
			className={classNames(cls.Panel, {}, [className])}
			{...otherprops}
		>
			{children}
		</div>
	);
};
