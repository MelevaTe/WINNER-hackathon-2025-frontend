import { X } from "lucide-react";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { TripForm } from "@/features/tripForm";
import { getTripResultData, TripResult } from "@/features/tripResult";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useMobile } from "@/shared/lib/hooks/useMobile/useMobile.ts";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button.tsx";
import { Panel } from "@/shared/ui/Panel/Panel.tsx";
import { Text } from "@/shared/ui/Text/Text.tsx";
import cls from "./Sidebar.module.scss";

interface SidebarProps {
	className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
	const tripResult = useSelector(getTripResultData);
	const isMobile = useMobile();
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

	if (isMobile) {
		return (
			<>
				{!mobileSheetOpen && (
					<Button
						theme={ButtonTheme.ACCENT}
						onClick={() => setMobileSheetOpen(true)}
						className={cls.OpenButton}
					>
						Спланировать маршрут
					</Button>
				)}

				{mobileSheetOpen && (
					<div className={cls.MobileSheet}>
						<Panel className={cls.Wrapper}>
							<button
								className={cls.CloseButton}
								onClick={() => setMobileSheetOpen(false)}
							>
								<X />
							</button>
							{tripResult ? (
								<>
									<div className={cls.TextWrapper}>
										<Text
											text={"Ваш персональный маршрут"}
											className={cls["title"]}
											align={"left"}
											as={"h2"}
											size={"s"}
										/>
									</div>
									<TripResult />
								</>
							) : (
								<>
									<div className={cls.TextWrapper}>
										<Text
											text={"Спланировать маршрут"}
											align={"left"}
											as={"h2"}
											size={"s"}
										/>
										<Text
											text={"Выберите точки на карте и настройте параметры"}
											align={"left"}
											size={"s"}
											as={"h3"}
										/>
									</div>
									<TripForm />
								</>
							)}
						</Panel>
					</div>
				)}
			</>
		);
	}

	return (
		<aside className={classNames(cls.Sidebar, {}, [className])}>
			<Panel className={cls.Wrapper}>
				{tripResult ? (
					<>
						<div className={cls.TextWrapper}>
							<Text
								text={"Ваш персональный маршрут"}
								align={"left"}
								as={"h2"}
								size={"s"}
							/>
						</div>
						<TripResult />
					</>
				) : (
					<>
						<div className={cls.TextWrapper}>
							<Text
								text={"Спланировать маршрут"}
								className={cls["title"]}
								align={"left"}
								as={"h2"}
								size={"s"}
							/>
							<Text
								text={"Выберите точки на карте и настройте параметры"}
								className={cls["title"]}
								align={"left"}
								size={"s"}
								as={"h3"}
							/>
						</div>
						<TripForm />
					</>
				)}
			</Panel>
		</aside>
	);
});
