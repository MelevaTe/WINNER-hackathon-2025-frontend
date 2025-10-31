import { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { getRoutePointsFromAddressCord, RoutePointsForm } from "@/features/routePoints";
import { getRoutePointsToAddressCords } from "@/features/routePoints/model/selectors/getRoutePointsToAddressCords/getRoutePointsToAddressCords.ts";
import { fetchEventsData } from "@/features/tripResult/model/services/fetchEventsData.ts";
import {
	DynamicModuleLoader,
	type ReducersList,
} from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch.ts";
import { Badge } from "@/shared/ui/Badge/Badge";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button";
import { Text } from "@/shared/ui/Text/Text";
import cls from "./TripForm.module.scss";
import { getBudget } from "../model/selectors/getBudget.ts";
import { getRouteType } from "../model/selectors/getRouteType.ts";
import { getTravelStyle } from "../model/selectors/getTravelStyle.ts";
import { tripFormActions, tripFormReducer } from "../model/slices/tripFormSlice";
import type { Budget, RouteType } from "../model/types";

const BUDGET_OPTIONS: Array<{ value: Budget; label: string; color: string }> = [
	{ value: "низкий", label: "Эконом", color: "#EAEBEA" },
	{ value: "средний", label: "Комфорт", color: "#42C23D" },
	{ value: "высокий", label: "Премиум", color: "#2E8B57" },
];

const TRAVEL_STYLES = ["Семейный", "Активный", "Культурный", "Романтический", "Гастрономический", "Фотографический"];

const reducers: ReducersList = {
	tripForm: tripFormReducer,
};

export const TripForm = memo(() => {
	const dispatch = useAppDispatch();
	const budget = useSelector(getBudget);
	const travelStyle = useSelector(getTravelStyle);
	const fromCoords = useSelector(getRoutePointsFromAddressCord);
	const toCoords = useSelector(getRoutePointsToAddressCords);
	const routeType = useSelector(getRouteType);
	const budgetIndex = BUDGET_OPTIONS.findIndex((opt) => opt.value === budget);

	const getBudgetColor = (budgetValue: string) => {
		return BUDGET_OPTIONS.find((opt) => opt.value === budgetValue)?.color || "#42C23D";
	};

	const handleBudgetChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const index = Number(e.target.value);
			const selected = BUDGET_OPTIONS[index];
			if (selected) {
				dispatch(tripFormActions.setBudget(selected.value));
			}
		},
		[dispatch]
	);

	const handleStyleSelect = useCallback(
		(style: string) => {
			dispatch(tripFormActions.setTravelStyle(style));
		},
		[dispatch]
	);

	const handleRouteTypeSelect = useCallback(
		(type: RouteType) => {
			dispatch(tripFormActions.setRouteType(type));
		},
		[dispatch]
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();

			if (!fromCoords || !toCoords || !travelStyle) {
				alert("Пожалуйста, заполните все поля");
				return;
			}

			let categories: string[] = [];
			try {
				const profileDataRaw = localStorage.getItem("profile_form");
				if (profileDataRaw) {
					const profileData = JSON.parse(profileDataRaw);
					categories = profileData.interest;
				}
			} catch (error) {
				console.log("нету categories в localStorage", error);
			}

			const requestData = {
				startPoint: [fromCoords.lat, fromCoords.lon] as [number, number],
				endPoint: [toCoords.lat, toCoords.lon] as [number, number],
				budget,
				style: travelStyle,
				categories,
				routeType: routeType,
			};

			dispatch(fetchEventsData(requestData));
		},
		[fromCoords, toCoords, budget, travelStyle, dispatch]
	);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<form
				onSubmit={handleSubmit}
				className={cls.Form}
			>
				<RoutePointsForm />
				<div className={cls.FieldGroup}>
					<Text
						text="Бюджет поездки"
						className={cls.FieldGroupText}
						align="left"
						as="h3"
					/>
					<input
						type="range"
						min="0"
						max={BUDGET_OPTIONS.length - 1}
						step="1"
						value={budgetIndex}
						onChange={handleBudgetChange}
						className={cls.magneticSlider}
						style={{
							background: `linear-gradient(to right, ${getBudgetColor(budget)} 0%, ${getBudgetColor(budget)} ${(budgetIndex / 2) * 100}%, #EAEBEA ${(budgetIndex / 2) * 100}%, #EAEBEA 100%)`,
						}}
					/>
					<div className={cls.SpanWrapper}>
						{BUDGET_OPTIONS.map((opt) => (
							<span
								key={opt.value}
								className={cls.span}
							>
								{opt.label}
							</span>
						))}
					</div>
				</div>
				<div className={cls.FieldGroup}>
					<Text
						text="Стиль путешествия"
						className={cls.FieldGroupText}
						align="left"
						as="h3"
					/>
					<div className={cls.BadgeContainer}>
						{TRAVEL_STYLES.map((style) => {
							const isSelected = travelStyle === style;
							return (
								<Badge
									key={style}
									variant={isSelected ? "primary" : "outline"}
									hover
									onClick={() => handleStyleSelect(style)}
								>
									{style}
								</Badge>
							);
						})}
					</div>
					<Text
						text="Тип маршрута"
						className={cls.FieldGroupText}
						align="left"
						as="h3"
					/>
					<div className={cls.BadgeContainer}>
						{(["Оптимальный", "Расширенный"] as const).map((type) => {
							const isSelected = routeType === type;
							return (
								<Badge
									key={type}
									variant={isSelected ? "primary" : "outline"}
									hover
									onClick={() => handleRouteTypeSelect(type)}
								>
									{type}
								</Badge>
							);
						})}
					</div>
					<div></div>
				</div>

				<Button
					theme={ButtonTheme.ACCENT}
					className={cls.FormButton}
					type="submit"
				>
					Построить маршрут
				</Button>
			</form>
		</DynamicModuleLoader>
	);
});
