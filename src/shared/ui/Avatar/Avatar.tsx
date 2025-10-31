import type { CSSProperties } from "react";
import { useMemo } from "react";
import cls from "./Avatar.module.scss";
import UserIcon from "../../assets/icons/user-32-32.svg?react";
import type { Mods } from "../../lib/classNames/classNames";
import { classNames } from "../../lib/classNames/classNames";
import { AppImage } from "../AppImage";
import { Icon } from "../Icon/Icon";
import { Skeleton } from "../Skeleton/Skeleton";

interface AvatarProps {
	className?: string;
	src?: string;
	size?: number;
	alt?: string;
	onClick?: () => void;
}

export const Avatar = ({ className, src, size = 100, alt, onClick }: AvatarProps) => {
	const mods: Mods = {};

	const styles = useMemo<CSSProperties>(() => {
		return {
			width: size,
			height: size,
		};
	}, [size]);

	const fallback = (
		<Skeleton
			width={size}
			height={size}
			border="50%"
		/>
	);
	const errorFallback = (
		<Icon
			onClick={onClick}
			width={size}
			height={size}
			Svg={UserIcon}
		/>
	);

	return (
		<AppImage
			onClick={onClick}
			fallback={fallback}
			errorFallback={errorFallback}
			src={src}
			style={styles}
			alt={alt}
			className={classNames(cls.Avatar, mods, [className])}
		/>
	);
};
