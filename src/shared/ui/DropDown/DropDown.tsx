import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { ReactNode } from "react";
import cls from "./DropDown.module.scss";
import { classNames } from "../../lib/classNames/classNames";
import type { DropDownDirection } from "../../types/ui";
import AppLink from "../AppLink/AppLink";

export interface DropDownItem {
	content?: ReactNode;
	disabled?: boolean;
	href?: string;
	onClick?: () => void;
}

interface DropDownProps {
	className?: string;
	items: DropDownItem[];
	trigger: ReactNode;
	direction?: DropDownDirection;
}

const mapDirectionClass: Record<DropDownDirection, string> = {
	"bottom left": cls.optionsBottomLeft,
	"bottom right": cls.optionsBottomRight,
	"top left": cls.optionsTopLeft,
	"top right": cls.optionsTopRight,
};

export function DropDown(props: DropDownProps) {
	const { className, trigger, items, direction = "bottom right" } = props;

	const menuClasses = [mapDirectionClass[direction]];

	return (
		<div className={classNames(cls.DropDown, {}, [className])}>
			<Menu>
				<MenuButton className={cls.btn}>{trigger}</MenuButton>
				<MenuItems
					className={classNames(cls.menu, {}, menuClasses)}
					anchor="bottom"
				>
					{items.map((item, index) => {
						const content = (
							<button
								type="button"
								disabled={item.disabled}
								onClick={item.onClick}
								className={classNames(cls.item, {}, [])}
							>
								{item.content}
							</button>
						);

						if (item.href) {
							return (
								<MenuItem
									key={index}
									as={AppLink}
									to={item.href}
									disabled={item.disabled}
								>
									{content}
								</MenuItem>
							);
						}

						return (
							<MenuItem
								key={index}
								disabled={item.disabled}
							>
								{content}
							</MenuItem>
						);
					})}
				</MenuItems>
			</Menu>
		</div>
	);
}
