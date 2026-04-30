import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type BannerImageEditorProps = {
	imageFile: File
	onSave: (file: File, offsetY: number) => void
	onCancel: () => void
}

export function BannerImageEditor({ imageFile, onSave, onCancel }: BannerImageEditorProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [offsetY, setOffsetY] = useState(0)
	const [imageUrl, setImageUrl] = useState<string>("")
	const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 })

	useEffect(() => {
		const url = URL.createObjectURL(imageFile)
		setImageUrl(url)

		const img = new Image()
		img.onload = () => {
			setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight })
		}
		img.src = url

		return () => {
			URL.revokeObjectURL(url)
		}
	}, [imageFile])

	useEffect(() => {
		if (!canvasRef.current || !imageUrl || imgDimensions.width === 0) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const bannerWidth = 844
		const bannerHeight = 500
		canvas.width = bannerWidth
		canvas.height = bannerHeight

		ctx.fillStyle = "#f5f5f5"
		ctx.fillRect(0, 0, bannerWidth, bannerHeight)

		const img = new Image()
		img.onload = () => {
			// Calculate scaling to cover the banner width
			const scale = Math.max(bannerWidth / img.width, bannerHeight / img.height)
			const scaledWidth = img.width * scale
			const scaledHeight = img.height * scale

			// Center horizontally, apply offset vertically
			const x = (bannerWidth - scaledWidth) / 2
			const y = (bannerHeight - scaledHeight) / 2 + offsetY

			// Enable image smoothing for better quality
			ctx.imageSmoothingEnabled = true
			ctx.imageSmoothingQuality = 'high'

			ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
		}
		img.src = imageUrl
	}, [imageUrl, offsetY, imgDimensions])

	const maxOffsetY = imgDimensions.height ? Math.floor((imgDimensions.height * 0.5)) : 100

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg border border-border bg-background p-6 space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-foreground">Adjust Banner Image</h2>
					<button
						type="button"
						onClick={onCancel}
						className="text-muted-foreground hover:text-foreground"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<p className="text-sm text-muted-foreground">
					Adjust the image position to fit the banner properly. The preview shows how it will look.
				</p>

				{/* Preview */}
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-foreground">Preview (844x500)</p>
					<div className="overflow-hidden rounded border border-border">
						<canvas
							ref={canvasRef}
							className="w-full"
							style={{ maxHeight: "400px", backgroundColor: "#f5f5f5" }}
						/>
					</div>
				</div>

				{/* Controls */}
				<div className="space-y-4 rounded-lg bg-muted/30 p-4">
					<div className="space-y-2">
						<p className="text-sm font-medium text-foreground">Position Adjustment</p>
						<p className="text-xs text-muted-foreground">Move the image up or down to frame it correctly</p>
					</div>

					<div className="flex items-center justify-center gap-4">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => setOffsetY(Math.min(offsetY + 10, maxOffsetY))}
							className="h-9 w-9"
							title="Move image down"
						>
							<ChevronDown className="h-4 w-4" />
						</Button>

						<div className="flex-1 space-y-2">
							<input
								type="range"
								min={-maxOffsetY}
								max={maxOffsetY}
								value={offsetY}
								onChange={(e) => setOffsetY(Number(e.target.value))}
								className="w-full"
							/>
							<div className="text-center">
								<p className="text-xs text-muted-foreground">
									Offset: <span className="font-medium text-foreground">{offsetY}px</span>
								</p>
							</div>
						</div>

						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => setOffsetY(Math.max(offsetY - 10, -maxOffsetY))}
							className="h-9 w-9"
							title="Move image up"
						>
							<ChevronUp className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" onClick={onCancel} className="h-9">
						Cancel
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={() => onSave(imageFile, offsetY)}
						className="h-9"
					>
						Save Position
					</Button>
				</div>
			</div>
		</div>
	)
}
