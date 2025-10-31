import type { ReactNode } from "react";
import { memo, useCallback, useState } from "react";
import { Theme, useTheme } from "@/app/providers/ThemeProvider";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button";
import cls from "./Tabs.module.scss";
import { classNames } from "../../lib/classNames/classNames";

export interface TabItem {
	value: string;
	content: ReactNode;
}

interface TabsProps {
	className?: string;
	tabs: TabItem[];
	value: string;
	onTabClick: (tab: TabItem) => void;
}

export const Tabs = memo((props: TabsProps) => {
	const { className, tabs, onTabClick } = props;

	const { theme } = useTheme();

	const [currentTab, setCurrentTab] = useState<TabItem>();

	const clickHandle = useCallback(
		(tab: TabItem) => () => {
			setCurrentTab(tab);
			onTabClick(tab);
		},
		[onTabClick]
	);

	const currentTabIndex = currentTab ? tabs.findIndex((tab) => tab.value === currentTab.value) : 0;

	return (
		<div className={classNames(cls.Tabs, {}, [className])}>
			{tabs.map((tab) => (
				<Button
					className={cls.tabItem}
					theme={ButtonTheme.CLEAR}
					key={tab.value}
					onClick={clickHandle(tab)}
				>
					{tab.content}
				</Button>
			))}
			<div
				className={classNames(cls.tabActiveItem, {}, [
					theme === Theme.DARK ? cls.tabItemDark : cls.tabItemLight,
				])}
				style={{
					transform: `translateX(${currentTabIndex * 100}%)`,
					width: `${100 / tabs.length}%`,
				}}
			/>
		</div>
	);
});
