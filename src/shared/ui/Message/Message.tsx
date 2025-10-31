import type { HTMLAttributes } from "react";
import React from "react";
import { Icon } from "@/shared/ui/Icon/Icon";
import cls from "./Message.module.scss";
import MessageIcon from "../../assets/icons/message.svg?react";
import MessageNotOwnIcon from "../../assets/icons/messageNotOwn.svg?react";
import { classNames } from "../../lib/classNames/classNames";

export enum MessageTheme {
	NOTOWN = "notown",
	OWN = "own",
}

interface MessageProps extends HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
	theme?: MessageTheme;
}

export const Message = ({ className, children, theme = MessageTheme.NOTOWN, ...otherprops }: MessageProps) => {
	const SvgComponent = theme === MessageTheme.OWN ? MessageIcon : MessageNotOwnIcon;
	return (
		<div
			className={classNames(cls.Message, {}, [className, cls[theme]])}
			{...otherprops}
		>
			<div className={cls.MessageContentWrapper}>
				<div className={cls.MessageContentWrapperPeer}>
					<div className={cls.ContentInner}>
						<div className={cls.TextContent}>{children}</div>
					</div>
					<Icon
						className={cls.SvgAppendix}
						width={9}
						height={20}
						Svg={SvgComponent}
					/>
				</div>
			</div>
		</div>
	);
};
