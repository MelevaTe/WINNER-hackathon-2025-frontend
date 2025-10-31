import React from "react";
import cls from "./PageLoader.module.scss";
import { classNames } from "../../lib/classNames/classNames";
import { Loader } from "../Loader/Loader";

interface PageLoaderProps {
	className?: string;
}

export const PageLoader = ({ className }: PageLoaderProps) => {
	return (
		<div className={classNames(cls.pageLoader, {}, [className])}>
			<Loader />
		</div>
	);
};
