import type { JSX } from "react"

type BannerDisplayProps = {
	imageUrl?: string | null
	position?: number
	alt?: string
	className?: string
	children?: React.ReactNode
}

/**
 * Shared presentational component for displaying a guild banner image.
 * Mirrors the rendering used inside DirectBannerEditor so that the saved
 * vertical position matches exactly across admin and public pages.
 */
export function BannerDisplay({
	imageUrl,
	position = 0,
	alt = "Banner",
	className = "relative h-48 w-full overflow-hidden rounded border border-border bg-muted/30",
	children,
}: BannerDisplayProps): JSX.Element {
	return (
		<div className={className}>
			{imageUrl ? (
				<img
					src={imageUrl}
					alt={alt}
					className="absolute top-0 left-0 w-full h-auto select-none"
					style={{
						transform: `translateY(${position}px)`,
						imageRendering: "auto",
					}}
					draggable={false}
				/>
			) : null}
			{children}
		</div>
	)
}
