import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getTripPlaces } from "@/features/tripResult/model/selectors/getTripPlaces/getTripPlaces.ts";
import { Card } from "@/shared/ui/Card/Card.tsx";
import cls from "./TripResult.module.scss";

interface tripResultProps {
	className?: string;
}

export const TripResult = ({ className }: tripResultProps) => {
	const { t } = useTranslation();
	const result = useSelector(getTripPlaces);

	return (
		<div>
			{result.map((result, index) => (
				<Card key={result.id}>
					<div className={cls.resultContent}>
						<div className={cls.resultImage}>
							{result.image !== null && (
								<img
									src={result.image}
									alt="Place"
								/>
							)}
						</div>

						<div className={cls.resultInfo}>
							<div className={cls.resultHeader}>
								<div className={cls.resultNumber}>{index + 1}</div>
								<h3 className={cls.resultName}>{result.title}</h3>
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
};
