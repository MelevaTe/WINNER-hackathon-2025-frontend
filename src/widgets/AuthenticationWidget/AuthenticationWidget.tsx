import { useCallback } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserAuthData } from "@/entities/User";
import { AuthGoogle } from "@/features/AuthByGoogle";
import { AuthForm } from "@/features/AuthByUsername";
import { RoutePath } from "@/shared/const/router";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./AuthenticationWidget.module.scss";

interface AuthenticationWidgetProps {
	className?: string;
}

export const AuthenticationWidget = ({ className }: AuthenticationWidgetProps) => {
	// const { t } = useTranslation();
	const navigate = useNavigate();

	const onSuccess = useCallback(
		(userId: string | number) => {
			navigate(`${RoutePath.onboarding}${userId}`);
		},
		[navigate]
	);

	return (
		<div className={classNames(cls.AuthenticationWidget, {}, [className])}>
			<div className={cls.AuthenticationWidgetWrapper}>
				<AuthForm onSuccess={onSuccess} />
				<AuthGoogle onSuccess={onSuccess} />
			</div>
		</div>
	);
};
