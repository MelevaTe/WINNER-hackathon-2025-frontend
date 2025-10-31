import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { updateProfilePhoto } from "@/features/EditableProfileCard/model/services/updateProfilePhoto/updateProfilePhoto";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Badge } from "@/shared/ui/Badge/Badge.tsx";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button.tsx";
import { Input } from "@/shared/ui/Input/Input";
import { Loader } from "@/shared/ui/Loader/Loader";
import { Text } from "@/shared/ui/Text/Text.tsx";
import cls from "./ProfileCard.module.scss";
import type { IProfile } from "../../model/types/IProfile";

interface ProfileCardProps {
	className?: string;
	data?: IProfile;
	error?: string;
	isLoading?: boolean;
	readonly?: boolean;
	onChangeFirstname?: (value?: string) => void;
	onChangeLastname?: (value?: string) => void;
	onChangeTravelInterest?: (styles: string[]) => void;
	onSubmit?: () => void;
}

const interests = [
	"Музеи",
	"Природа",
	"Гастрономия",
	"Фестивали",
	"История",
	"Фотоспоты",
	"Архитектура",
	"Пляжи",
	"Рыбалка",
	"Казачья культура",
	"Винодельни",
	"Театры",
	"Парки",
	"Спорт",
	"Шоппинг",
	"Ночная жизнь",
	"Религиозные места",
	"Ремёсла",
	"Семейный отдых",
	"Экстрим",
];

export const ProfileCard = (props: ProfileCardProps) => {
	const {
		className,
		data,
		readonly,
		isLoading,
		onChangeFirstname,
		onChangeLastname,
		onChangeTravelInterest,
		onSubmit,
	} = props;
	const dispatch = useAppDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isNameValid = Boolean(data?.name?.trim());
	const isLastNameValid = Boolean(data?.secondName?.trim());
	const selectedInterestsCount = (data?.interest || []).length;
	const areInterestsValid = selectedInterestsCount >= 2;

	const isFormValid = isNameValid && isLastNameValid && areInterestsValid;

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const photoData = new FormData();
		photoData.append("file", file);
		dispatch(updateProfilePhoto(photoData));
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleStyleSelect = useCallback(
		(style: string) => {
			if (readonly || !onChangeTravelInterest) return;

			const current = data?.interest || [];
			const isSelected = current.includes(style);
			const next = isSelected ? current.filter((s) => s !== style) : [...current, style];

			onChangeTravelInterest(next);
		},
		[data?.interest, readonly, onChangeTravelInterest]
	);

	if (isLoading) {
		return <div className={classNames(cls.ProfileCard, { [cls.loading]: true }, [className])}>Loading...</div>;
	}

	return (
		<>
			<div className={cls.form}>
				<div className={cls.avatarWrapper}>
					<Avatar
						src={`data:image/jpeg;base64,${data?.photo}`}
						onClick={handleAvatarClick}
						className={cls.ava}
					/>
					<input
						type="file"
						ref={fileInputRef}
						style={{ display: "none" }}
						accept="image/*"
						onChange={handleFileChange}
						disabled={readonly}
					/>
				</div>
			</div>
			<div className={classNames(cls.WrapperInputs, {}, [cls.marginBlock])}>
				<div>
					<Text
						text={"Имя"}
						className={cls.LabelInput}
						align={"left"}
						as={"p"}
					/>
					<Input
						label={"Иван"}
						type="text"
						className={cls.InputAuthForm}
						value={data?.name ?? ""}
						readonly={readonly}
						onChange={onChangeFirstname}
					/>
				</div>
				<div>
					<Text
						text={"Фамилия"}
						className={cls.LabelInput}
						align={"left"}
						as={"p"}
					/>
					<Input
						label={"Иванов"}
						type="text"
						readonly={readonly}
						className={cls.InputAuthForm}
						value={data?.secondName ?? ""}
						onChange={onChangeLastname}
					/>
				</div>
			</div>
			<div className={cls.marginBlock}>
				<Text
					text="Стиль путешествия"
					className={cls.FieldGroupText}
					align="left"
					as="h3"
				/>
				<div className={cls.BadgeContainer}>
					{interests.map((style) => {
						const isSelected = (data?.interest || []).includes(style);
						return (
							<Badge
								key={style}
								variant={isSelected ? "primary" : "outline"}
								hover
								onClick={() => handleStyleSelect(style)}
								disabled={readonly}
							>
								{style}
							</Badge>
						);
					})}
				</div>
				{!readonly && !areInterestsValid && selectedInterestsCount > 0 && (
					<Text
						text="Выберите минимум 2 стиля путешествия"
						as={"p"}
						variant="error"
						className={cls.validationError}
					/>
				)}
			</div>
			<Button
				theme={ButtonTheme.ACCENT}
				className={cls.FormButton}
				onClick={onSubmit}
				disabled={!isFormValid || readonly}
			>
				Построить маршрут
			</Button>
		</>
	);
};
