import type { FC } from "react";
import React, { memo } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import cls from "./AppLink.module.scss";
import { classNames } from "../../lib/classNames/classNames";

export enum AppLinkTheme {
	PRIMARY = "primary",
}

interface AppLinkProps extends LinkProps {
	className?: string;
	theme?: AppLinkTheme;
	children?: React.ReactNode;
}

export const AppLink: FC<AppLinkProps> = memo((props) => {
	const { to, className, children, theme = AppLinkTheme.PRIMARY, ...otherProps } = props;
	return (
		<Link
			to={to}
			className={classNames(cls.AppLink, {}, [className, cls[theme]])}
			{...otherProps}
		>
			{children}
		</Link>
	);
});

export default AppLink;
