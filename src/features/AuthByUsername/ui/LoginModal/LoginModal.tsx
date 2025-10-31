import { Suspense } from "react";
import { AuthFormAsync } from "@/features/AuthByUsername/ui/AuthForm/AuthForm.async";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Loader } from "@/shared/ui/Loader/Loader";
import { Modal } from "@/shared/ui/Modal/Modal";
import cls from "./LoginModal.module.scss";

interface LoginModalProps {
	className?: string;
	isOpen: boolean;
	onClose: () => void;
}

export const LoginModal = ({ className, isOpen, onClose }: LoginModalProps) => {
	return (
		<Modal
			className={classNames(cls.LoginModal, {}, [className])}
			isOpen={isOpen}
			onClose={onClose}
			lazy
		>
			<Suspense fallback={<Loader />}>
				<AuthFormAsync onSuccess={onClose} />
			</Suspense>
		</Modal>
	);
};
