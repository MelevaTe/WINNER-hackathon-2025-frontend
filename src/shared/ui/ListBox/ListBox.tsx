import { Listbox as HListBox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import type { ReactNode } from "react";
import React from "react";
import cls from "./ListBox.module.scss";
import { classNames } from "../../lib/classNames/classNames";
import type { DropDownDirection } from "../../types/ui";
import { Button } from "../Button/Button";

export interface ListBoxItem {
	value: string;
	content: ReactNode;
	disabled?: boolean;
}

interface ListBoxProps {
	items?: ListBoxItem[];
	className?: string;
	value?: string;
	defaultValue?: string;
	onChange: (value: string) => void;
	readonly?: boolean;
	direction?: DropDownDirection;
	label?: string;
}

const mapDirectionClass: Record<DropDownDirection, string> = {
	"bottom left": cls.optionsBottomLeft,
	"bottom right": cls.optionsBottomRight,
	"top left": cls.optionsTopLeft,
	"top right": cls.optionsTopRight,
};

export function ListBox(props: ListBoxProps): ReactNode {
	const { items, className, value, defaultValue, onChange, readonly, direction = "bottom right", label } = props;

	const optionsClasses = [mapDirectionClass[direction]];

	return (
		<>
			{label && <span className={cls.label}>{`${label}>`}</span>}
			<HListBox
				disabled={readonly}
				as="div"
				className={classNames(cls.ListBox, {}, [className])}
				value={value}
				onChange={onChange}
			>
				<ListboxButton
					disabled={readonly}
					className={cls.trigger}
				>
					<Button disabled={readonly}>{value ?? defaultValue}</Button>
				</ListboxButton>
				<ListboxOptions
					className={classNames(cls.options, {}, optionsClasses)}
					anchor="bottom"
				>
					{items?.map((item) => (
						<ListboxOption
							key={item.value}
							value={item.value}
							className={cls.item}
							disabled={item.disabled}
						>
							{item.content}
						</ListboxOption>
					))}
				</ListboxOptions>
			</HListBox>
		</>
	);
}
