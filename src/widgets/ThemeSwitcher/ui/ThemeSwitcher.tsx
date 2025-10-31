import { Moon, Sun } from "lucide-react";
import { memo } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { classNames } from "@/shared/lib/classNames/classNames";
import * as cls from "./ThemeSwitcher.module.scss";

interface ThemeSwitcherProps {
	className?: string;
}
const ThemeSwitcher = memo(({}: ThemeSwitcherProps) => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className={classNames(cls.ThemeSwitcher, {}, [cls.btnIcon, cls.btnGhost])}
			onClick={toggleTheme}
		>
			{theme === "app_light_theme" ? <Moon /> : <Sun />}
		</button>
	);
});

export default ThemeSwitcher;
