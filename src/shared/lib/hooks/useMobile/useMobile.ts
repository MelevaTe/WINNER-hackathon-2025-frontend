import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 960;

export const useMobile = (): boolean => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	return isMobile;
};
