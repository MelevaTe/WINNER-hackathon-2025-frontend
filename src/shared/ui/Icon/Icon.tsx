import type { FC, SVGProps } from "react";
import React from "react";
import cls from "./Icon.module.scss";
import { classNames } from "../../lib/classNames/classNames";

interface IconProps extends SVGProps<SVGSVGElement> {
	className?: string;
	Svg: FC<SVGProps<SVGSVGElement>>;
}

export const Icon = (props: IconProps) => {
	const { className, Svg, ...otherProps } = props;

	return (
		<Svg
			className={classNames(cls.Icon, {}, [className])}
			{...otherProps}
		/>
	);
};
