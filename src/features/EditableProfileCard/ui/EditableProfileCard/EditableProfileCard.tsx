import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "@/entities/Profile";
import { ValidateProfileError } from "@/features/EditableProfileCard/model/consts/consts";
import { updateProfileData } from "@/features/EditableProfileCard/model/services/updateProfileData/updateProfileData.ts";
import { RoutePath } from "@/shared/const/router.ts";
import type { ReducersList } from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { DynamicModuleLoader } from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { Panel } from "@/shared/ui/Panel/Panel.tsx";
import { Text } from "@/shared/ui/Text/Text";
import * as cls from "./EditableProfileCard.module.scss";
import { getProfileError } from "../../model/selectors/getProfileError/getProfileError";
import { getProfileForm } from "../../model/selectors/getProfileForm/getProfileForm";
import { getProfileIsLoading } from "../../model/selectors/getProfileIsLoading/getProfileIsLoading";
import { getProfileReadonly } from "../../model/selectors/getProfileReadonly/getProfileReadonly";
import { getProfileValidateErrors } from "../../model/selectors/getProfileValidateErrors/getProfileValidateErrors";
import { fetchProfileData } from "../../model/services/fetchProfileData/fetchProfileData";
import { profileActions, profileReducer } from "../../model/slice/profileSlice";
import { EditableProfileCardHeader } from "../../ui/EditableProfileCardHeader/EditableProfileCardHeader";

interface EditableProfileCardProps {
	className?: string;
	id: string;
	isOnboarding?: boolean;
}

const reducers: ReducersList = {
	profile: profileReducer,
};

export const EditableProfileCard = ({ id, isOnboarding }: EditableProfileCardProps) => {
	const { t } = useTranslation("profile");
	const dispatch = useAppDispatch();
	const formData = useSelector(getProfileForm);
	const error = useSelector(getProfileError);
	const isLoading = useSelector(getProfileIsLoading);
	const readonlyFromStore = useSelector(getProfileReadonly);
	const readonly = isOnboarding ? false : readonlyFromStore;
	const validateErros = useSelector(getProfileValidateErrors);
	const navigate = useNavigate();

	const validateErrorTranslates = {
		[ValidateProfileError.SERVER_ERROR]: t("Серверная ошибка при сохранении"),
		[ValidateProfileError.NO_DATA]: t("Данные не указаны"),
		[ValidateProfileError.INCORRECT_USER_DATA]: t("Имя и фамилия не указаны"),
	};

	const onChangeTravelStyles = useCallback(
		(interest: string[]) => {
			dispatch(profileActions.updateProfile({ interest }));
		},
		[dispatch]
	);

	useEffect(() => {
		if (id && !isOnboarding) {
			dispatch(fetchProfileData(id));
		}
	}, [dispatch, id]);

	const onChangeFirstname = useCallback(
		(value?: string) => {
			dispatch(profileActions.updateProfile({ name: value || "" }));
		},
		[dispatch]
	);

	const onChangeLastname = useCallback(
		(value?: string) => {
			dispatch(profileActions.updateProfile({ secondName: value || "" }));
		},
		[dispatch]
	);

	const handleSubmit = useCallback(async () => {
		const result = await dispatch(updateProfileData());

		if (updateProfileData.fulfilled.match(result)) {
			navigate(`${RoutePath.travel}`);
		}
	}, [dispatch, navigate]);

	return (
		<DynamicModuleLoader reducers={reducers}>
			<div className={cls.OnBoarding}>
				<Panel className={cls.OnBoardingWrapper}>
					<EditableProfileCardHeader isOnboarding={isOnboarding} />
					{validateErros?.length &&
						validateErros.map((err) => (
							<Text
								key={err}
								text={validateErrorTranslates[err]}
							/>
						))}
					<ProfileCard
						data={formData}
						isLoading={isLoading}
						error={error}
						onChangeFirstname={onChangeFirstname}
						onChangeLastname={onChangeLastname}
						// onChangeAvatar={onChangeAvatar}
						readonly={readonly}
						onChangeTravelInterest={onChangeTravelStyles}
						onSubmit={handleSubmit}
					/>
				</Panel>
			</div>
		</DynamicModuleLoader>
	);
};
