import Spline from "@splinetool/react-spline";
import React from "react";
import { useTranslation } from "react-i18next";
import cls from "./CatModel.module.scss";

interface BearProps {
	className?: string;
}

export const CatModel = ({ className }: BearProps) => {
	const { t } = useTranslation();

	return (
		<div className={cls.WrapperModel}>
			<Spline scene="https://prod.spline.design/xGP90Imy5VmC5dN9/scene.splinecode" />
		</div>
	);
};
