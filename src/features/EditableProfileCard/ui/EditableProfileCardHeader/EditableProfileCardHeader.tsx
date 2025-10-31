import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button";
import { Text } from "@/shared/ui/Text/Text";
import cls from "./EditableProfileCardHeader.module.scss";
import { getProfileReadonly } from "../../model/selectors/getProfileReadonly/getProfileReadonly";
import { updateProfileData } from "../../model/services/updateProfileData/updateProfileData";
import { profileActions } from "../../model/slice/profileSlice";

interface EditableProfileCardHeaderProps {
	className?: string;
	isOnboarding?: boolean;
}

export const EditableProfileCardHeader = ({ isOnboarding }: EditableProfileCardHeaderProps) => {
	// const isMyPage = authData?.id === profileData?.id;
	// Mock DATA
	const isMyPage = true;
	const readonly = useSelector(getProfileReadonly);
	const dispatch = useAppDispatch();

	const onEdit = useCallback(() => {
		dispatch(profileActions.setReadonly(false));
	}, []);

	const onCancelEdit = useCallback(() => {
		dispatch(profileActions.cancelEdit());
	}, [dispatch]);

	const onSave = useCallback(() => {
		dispatch(updateProfileData());
	}, [dispatch]);

	if (isOnboarding) {
		return (
			<div className={cls.wrapperText}>
				<Text
					text={"Расскажите о себе"}
					align={"center"}
					as={"h2"}
				/>
				<Text
					text={"Это поможет нам создать идеальный маршрут для вас"}
					align={"center"}
					as={"p"}
				/>
			</div>
		);
	}

	return (
		<>
			<div className={cls.wrapperText}>
				<Text
					text={"Привет снова!"}
					align={"center"}
					as={"h2"}
				/>
				<Text
					text={"Это поможет нам создать идеальный маршрут для вас"}
					align={"center"}
					as={"p"}
				/>
			</div>
			{isMyPage ? (
				<div className={cls.btnWrapper}>
					{readonly ? (
						<Button
							theme={ButtonTheme.ACCENT}
							onClick={onEdit}
						>
							Редактировать
						</Button>
					) : (
						<div className={cls.btnWrapper}>
							<Button
								theme={ButtonTheme.ACCENT}
								onClick={onCancelEdit}
							>
								Отменить
							</Button>
							<Button
								theme={ButtonTheme.ACCENT}
								onClick={onSave}
							>
								Сохранить
							</Button>
						</div>
					)}
				</div>
			) : (
				<div className={cls.btnWrapper} />
			)}
		</>
	);
};
