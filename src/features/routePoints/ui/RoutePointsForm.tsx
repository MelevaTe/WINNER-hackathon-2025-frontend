import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { geocodeFromAddress } from "@/features/routePoints/model/services/geocodeAdress/geocodeAddress.ts";
import { geocodeFromAddressTo } from "@/features/routePoints/model/services/geocodeAdressTo/geocodeAdressTo.ts";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useDebounce } from "@/shared/lib/hooks/useDebounce/useDebounce.ts";
import { Input } from "@/shared/ui/Input/Input.tsx";
import { Text } from "@/shared/ui/Text/Text";
import cls from "./RoutePointsForm.module.scss";
import { getRoutePointsFromAddress } from "../model/selectors/getRoutePointsFromAddress/getRoutePointsFromAddress.ts";
import { getRoutePointsToAddress } from "../model/selectors/getRoutePointsToAddress/getRoutePointsToAddress.ts";
import { routePointsActions } from "../model/slices/routePointsSlice.ts";

export interface RoutePointsFormProps {
	className?: string;
}

const RoutePointsForm = ({}: RoutePointsFormProps) => {
	const dispatch = useAppDispatch();
	const fromAddress = useSelector(getRoutePointsFromAddress);
	const toAddress = useSelector(getRoutePointsToAddress);

	const [isFromUserInput, setIsFromUserInput] = useState(false);
	const [isToUserInput, setIsToUserInput] = useState(false);

	const triggerGeocodeFrom = useCallback(() => {
		if (fromAddress.trim()) {
			dispatch(geocodeFromAddress(fromAddress));
		} else {
			dispatch(routePointsActions.setFromCoords(null));
		}
	}, [fromAddress, dispatch]);

	const debouncedGeocodeFrom = useDebounce(triggerGeocodeFrom, 500);

	useEffect(() => {
		if (isFromUserInput) {
			debouncedGeocodeFrom();
		}
	}, [fromAddress, isFromUserInput, debouncedGeocodeFrom]);

	const onChangeFromAddress = useCallback(
		(value?: string) => {
			setIsFromUserInput(true);
			dispatch(routePointsActions.setFromAddress(value || ""));
		},
		[dispatch]
	);

	const handleFromBlur = () => {
		setIsFromUserInput(false);
	};

	const triggerGeocodeTo = useCallback(() => {
		if (toAddress.trim()) {
			dispatch(geocodeFromAddressTo(toAddress));
		} else {
			dispatch(routePointsActions.setToCoords(null));
		}
	}, [toAddress, dispatch]);

	const debouncedGeocodeTo = useDebounce(triggerGeocodeTo, 500);

	useEffect(() => {
		if (isToUserInput) {
			debouncedGeocodeTo();
		}
	}, [toAddress, isToUserInput, debouncedGeocodeTo]);

	const onChangeToAddress = useCallback(
		(value?: string) => {
			setIsToUserInput(true);
			dispatch(routePointsActions.setToAddress(value || ""));
		},
		[dispatch]
	);

	const handleToBlur = () => {
		setIsToUserInput(false);
	};

	return (
		<>
			<div className={cls.FieldGroup1}>
				<Text
					text={"Точки маршрута"}
					className={cls.FieldGroupText}
					align={"left"}
					as={"h3"}
				/>
				<div>
					<Text
						text={"Начальная точка"}
						className={cls.LabelInput}
						align={"left"}
						as={"p"}
					/>
					<Input
						label={"Введите адрес или место"}
						type="text"
						className={cls.InputAuthForm}
						value={fromAddress}
						onChange={onChangeFromAddress}
						onBlur={handleFromBlur}
					/>
				</div>
				<div>
					<Text
						text={"Конечная точка"}
						className={cls.LabelInput}
						align={"left"}
						as={"p"}
					/>
					<Input
						label={"Введите адрес или место"}
						type="text"
						className={cls.InputAuthForm}
						value={toAddress}
						onChange={onChangeToAddress}
						onBlur={handleToBlur}
					/>
				</div>
			</div>
		</>
	);
};

export default memo(RoutePointsForm);
