import { Globe } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./LangSwitcher.module.scss";

interface LangSwitcherProps {
	className?: string;
	short?: boolean;
}

const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
	const { t, i18n } = useTranslation();

	const toggle = async () => {
		i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
	};

	const currentLang = i18n.language.startsWith("ru") ? "RU" : "EN";

	return (
		<button
			className={classNames(cls.LangSwitcher, {}, [cls.btnIcon, cls.btnGhost])}
			onClick={toggle}
		>
			<Globe />
		</button>
	);
});

export default LangSwitcher;
