import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getUserAuthData } from "@/entities/User";
import { RoutePath } from "@/shared/const/router";
import { classNames } from "@/shared/lib/classNames/classNames";
import AppLink, { AppLinkTheme } from "@/shared/ui/AppLink/AppLink";
import { Text } from "@/shared/ui/Text/Text";
import LangSwitcher from "@/widgets/LangSwitcher/LangSwitcher.tsx";
import { ThemeSwitcher } from "@/widgets/ThemeSwitcher";
import cls from "./Navbar.module.scss";

interface NavbarProps {
	className?: string;
}

const HIDDEN_PATHS = ["/onboarding", "/auth"];

export const Navbar = memo(({ className }: NavbarProps) => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const shouldHideElements = HIDDEN_PATHS.some((path) => pathname.startsWith(path));

	const authData = useSelector(getUserAuthData);

	return (
		<header className={classNames(cls.navbar, {}, [className])}>
			<Text
				text={"Ant App"}
				className={cls["title"]}
				align={"center"}
				size={"s"}
				as={"h1"}
			/>
			<div className={cls.menu}>
				{!shouldHideElements && (
					<nav className={cls.nav}>
						<AppLink
							to={RoutePath.travel}
							theme={AppLinkTheme.PRIMARY}
							className={cls.navItems}
						>
							{t("Карта")}
						</AppLink>
						<AppLink
							to={authData ? `${RoutePath.profile}${authData.id}` : RoutePath.profile}
							theme={AppLinkTheme.PRIMARY}
							className={cls.navItems}
						>
							{t("Профиль")}
						</AppLink>
					</nav>
				)}
			</div>
			<div className={cls.auth}>
				<ThemeSwitcher />
				<LangSwitcher />
			</div>
		</header>
	);
});
