import classNames from "classnames";
import Image from "next/image";
import c_imgLupe from "styles/components/imgLupe.module.scss";

export default function Output({ state_ImgLupe, src, height, width, alt }) {
	// console.log(state_ImgLupe);
	return (
		<>
			<div
				className={classNames(c_imgLupe.wrapper, {
					[c_imgLupe.open]: state_ImgLupe,
				})}
				style={{
					"--positionX": state_ImgLupe.x,
					"--positionY": state_ImgLupe.y,
					"--width": width,
					"--height": height,
				}}
			>
				<Image src={src} alt={alt} width={width} height={height} />
			</div>
		</>
	);
}
