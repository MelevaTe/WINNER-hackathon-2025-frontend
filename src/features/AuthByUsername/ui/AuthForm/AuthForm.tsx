import type { FormEvent } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { User } from "@/entities/User";
import { classNames } from "@/shared/lib/classNames/classNames";
import { DynamicModuleLoader } from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import type { ReducersList } from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { useInput } from "@/shared/lib/hooks/useInput/useInput";
import type { InputState } from "@/shared/lib/hooks/useInput/useInput";
import { Button, ButtonTheme } from "@/shared/ui/Button/Button";
import { Input, InputTheme } from "@/shared/ui/Input/Input";
import type { TabItem } from "@/shared/ui/Tabs/Tabs";
import { Tabs } from "@/shared/ui/Tabs/Tabs";
import { Text } from "@/shared/ui/Text/Text";
import cls from "./AuthForm.module.scss";
import { getLoginConfirmPassword } from "../../model/selectors/getLoginConfrimPassword/getLoginConfirmPassword";
import { getLoginIsLoading } from "../../model/selectors/getLoginIsLoading/getLoginIsLoading";
import { getLoginPassword } from "../../model/selectors/getLoginPassword/getLoginPassword";
import { getLoginUsername } from "../../model/selectors/getLoginUsername/getLoginUsername";
import { loginByUsername } from "../../model/services/loginByUsername/loginByUsername";
import { registration } from "../../model/services/register/register";
import { loginActions, loginReducer } from "../../model/slices/loginSlice";

export interface AuthFormProps {
	className?: string;
	onSuccess: (id: number | string) => void;
}

const initialReducers: ReducersList = {
	loginForm: loginReducer,
};

const AuthForm = ({ className, onSuccess }: AuthFormProps) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const usernameState = useSelector(getLoginUsername);
	const passwordState = useSelector(getLoginPassword);
	const confirmPasswordState = useSelector(getLoginConfirmPassword);
	const isLoading = useSelector(getLoginIsLoading);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isRegistrationMode, setIsRegistrationMode] = useState(false);

	const typeTabs = useMemo<TabItem[]>(
		() => [
			{
				value: "login",
				content: t("Войти"),
			},
			{
				value: "register",
				content: t("Регистрация"),
			},
		],
		[t]
	);

	const onTabClick = useCallback((tab: TabItem) => {
		setIsRegistrationMode(tab.value === "register");
	}, []);

	const onChangeUsername = useCallback(
		(value: string) => {
			dispatch(loginActions.setUsername(value));
		},
		[dispatch]
	);

	const onChangePassword = useCallback(
		(value: string) => {
			dispatch(loginActions.setPassword(value));
		},
		[dispatch]
	);

	const onChangeConfirmPassword = useCallback(
		(value: string) => {
			dispatch(loginActions.setConfirmPassword(value));
		},
		[dispatch]
	);

	const username = useInput(
		"",
		{
			isEmpty: true,
			minlength: 5,
			isEmail: true,
		},
		onChangeUsername
	);

	const password = useInput(
		"",
		{
			isEmpty: true,
			minlength: 5,
		},
		onChangePassword
	);

	const confirmPassword = useInput(
		"",
		{
			isEmpty: true,
			minlength: 5,
			match: password.value,
		},
		onChangeConfirmPassword
	);

	const getInputTheme = (inputState: InputState): InputTheme => {
		if (!inputState.isDirty) return InputTheme.CLEAR;
		if (!inputState.wasBlurred) return inputState.inputValid ? InputTheme.DONE : InputTheme.NOTIFICATION;
		return inputState.inputValid ? InputTheme.DONE : InputTheme.ERROR;
	};

	const usernameInputTheme = useMemo(() => getInputTheme(username), [username]);
	const passwordInputTheme = useMemo(() => getInputTheme(password), [password]);
	const confirmPasswordInputTheme = useMemo(() => getInputTheme(confirmPassword), [confirmPassword]);

	const isButtonDisabled =
		(!username.inputValid && username.isDirty) ||
		(!password.inputValid && password.isDirty) ||
		isLoading ||
		(isSubmitted && (!username.inputValid || !password.inputValid || !confirmPassword.inputValid)) ||
		(!confirmPassword.inputValid && confirmPassword.isDirty);

	useEffect(() => {
		username.onChange("");
		password.onChange("");
		confirmPassword.onChange("");

		username.setIsDirty(false);
		password.setIsDirty(false);
		confirmPassword.setIsDirty(false);
		setIsSubmitted(false);
	}, [isRegistrationMode]);

	const onLoginClick = useCallback(async () => {
		if (
			!username.inputValid ||
			!password.inputValid ||
			(isRegistrationMode && password.value !== confirmPassword.value)
		) {
			setIsSubmitted(true);
		}

		if (!username.isDirty) {
			username.setIsDirty(true);
		}
		if (!password.isDirty) {
			password.setIsDirty(true);
		}
		if (isRegistrationMode && !confirmPassword.isDirty) {
			confirmPassword.setIsDirty(true);
		}

		username.onBlur();
		password.onBlur();
		if (isRegistrationMode) {
			confirmPassword.onBlur();
		}

		if (
			username.inputValid &&
			password.inputValid &&
			(!isRegistrationMode || password.value === confirmPassword.value)
		) {
			let result;
			if (isRegistrationMode) {
				result = await dispatch(
					registration({
						username: usernameState,
						password: passwordState,
						confirmPassword: confirmPasswordState,
					})
				);
			} else {
				result = await dispatch(loginByUsername({ username: usernameState, password: passwordState }));
			}

			if (result.meta.requestStatus === "fulfilled" && typeof result.payload !== "string") {
				const userId = (result.payload as User).id;
				onSuccess(userId);
			}
		} else {
			console.log("Есть ошибки в форме");
		}
	}, [dispatch, username, password, confirmPassword, isRegistrationMode, onSuccess]);

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			await onLoginClick();
		},
		[onLoginClick]
	);

	return (
		<DynamicModuleLoader
			removeAfterUnmount
			reducers={initialReducers}
		>
			<div className={cls.wrapperLoginForm}>
				<div className={cls.LoginForm}>
					<div className={cls.TextWrapper}>
						<Text
							text={"Добро пожаловать"}
							className={cls.titleH}
							align={"center"}
							as={"h2"}
						/>
						<Text
							text={"Начните планировать ваши путешествия"}
							className={cls["title-p"]}
							align={"center"}
							as={"p"}
						/>
					</div>
					<div>
						<Tabs
							tabs={typeTabs}
							value={isRegistrationMode ? "register" : "login"}
							onTabClick={onTabClick}
							className={classNames(cls.Tabs, {}, [className])}
						/>
						<form
							className={classNames(cls.Form, {}, [className])}
							onSubmit={onSubmit}
						>
							<Input
								label={"Электронная почта"}
								type="text"
								className={cls.InputAuthForm}
								value={username.value}
								onChange={username.onChange}
								onBlur={username.onBlur}
								theme={usernameInputTheme}
							/>
							<div className={cls.errorWrapper}></div>
							<Input
								label={"Пароль"}
								type="password"
								className={cls.InputAuthForm}
								value={password.value}
								onChange={password.onChange}
								onBlur={password.onBlur}
								theme={passwordInputTheme}
							/>
							<div className={cls.errorWrapper}></div>
							<>
								<Input
									label={"Подтвердите пароль"}
									type="password"
									className={[
										cls.InputAuthForm,
										isRegistrationMode ? cls.animateInputVisible : cls.animateInputHidden,
									].join(" ")}
									value={confirmPassword.value}
									onChange={confirmPassword.onChange}
									onBlur={confirmPassword.onBlur}
									theme={confirmPasswordInputTheme}
								/>
								<div className={cls.errorWrapper}></div>
							</>
							<Button
								theme={ButtonTheme.ACCENT}
								className={cls.AuthFormButtonSumbit}
								type="submit"
								disabled={isButtonDisabled}
							>
								{t("Продолжить")}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</DynamicModuleLoader>
	);
};

export default memo(AuthForm);
