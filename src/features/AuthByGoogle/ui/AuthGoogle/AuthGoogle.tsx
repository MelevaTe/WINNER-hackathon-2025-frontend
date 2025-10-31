import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import type { User } from "@/entities/User";
import { classNames } from "@/shared/lib/classNames/classNames";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { Text } from "@/shared/ui/Text/Text";
import cls from "./AuthGoogle.module.scss";
import { loginByGoogle } from "../../model/services/loginByGoogle/loginByGoogle";

interface AuthGoogleProps {
	className?: string;
	onSuccess: (id: number | string) => void;
}

const AuthGoogle = ({ className, onSuccess }: AuthGoogleProps) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	return (
		<div className={classNames(cls.AuthGoogle, {}, [className])}>
			<Text
				className={cls.SocialText}
				// size={TextSize.S}
				text={t("Или войти с помощью")}
			/>
			<GoogleLogin
				type="icon"
				theme="filled_black"
				size="large"
				shape="circle"
				onSuccess={async (response) => {
					try {
						const { credential } = response;

						if (!credential) {
							throw new Error("Credential is missing");
						}
						const result = await dispatch(loginByGoogle({ token: credential }));
						if (result.meta.requestStatus === "fulfilled" && typeof result.payload !== "string") {
							const userId = (result.payload as User).id;
							onSuccess(userId);
						}
					} catch (error) {
						console.error("Error during Google login:", error);
					}
				}}
			/>
		</div>
	);
};

export default AuthGoogle;
