import { useEffect, useState } from "react"

type DirectBannerEditorProps = {
	imageFile: File
	onSave: (file: File, offsetY: number) => void
	onCancel: () => void
	initialOffsetY?: number
}

export function DirectBannerEditor({ 
	imageFile, 
	onSave, 
	onCancel, 
	initialOffsetY = 0 
}: DirectBannerEditorProps) {
		const [offsetY, setOffsetY] = useState(initialOffsetY)
	const [imageUrl, setImageUrl] = useState<string>("")
	const [isDragging, setIsDragging] = useState(false)
	const [dragStartY, setDragStartY] = useState(0)
	const [dragStartOffset, setDragStartOffset] = useState(0)

	useEffect(() => {
		const url = URL.createObjectURL(imageFile)
		setImageUrl(url)

		return () => {
			URL.revokeObjectURL(url)
		}
	}, [imageFile])

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault()
		setIsDragging(true)
		setDragStartY(e.clientY)
		setDragStartOffset(offsetY)
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging) return

		const deltaY = e.clientY - dragStartY
		const newOffset = dragStartOffset + deltaY
		
		// Limit the offset to reasonable bounds
		const maxOffset = 300
		const minOffset = -300
		setOffsetY(Math.max(minOffset, Math.min(maxOffset, newOffset)))
	}

	const handleMouseUp = () => {
		if (isDragging) {
			setIsDragging(false)
			onSave(imageFile, offsetY)
		}
	}

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
			
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}
		}
	}, [isDragging, dragStartY, dragStartOffset, offsetY])

	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault()
		const touch = e.touches[0]
		setIsDragging(true)
		setDragStartY(touch.clientY)
		setDragStartOffset(offsetY)
	}

	const handleTouchMove = (e: TouchEvent) => {
		if (!isDragging) return
		
		const touch = e.touches[0]
		const deltaY = touch.clientY - dragStartY
		const newOffset = dragStartOffset + deltaY
		
		const maxOffset = 300
		const minOffset = -300
		setOffsetY(Math.max(minOffset, Math.min(maxOffset, newOffset)))
	}

	const handleTouchEnd = () => {
		if (isDragging) {
			setIsDragging(false)
			onSave(imageFile, offsetY)
		}
	}

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('touchmove', handleTouchMove)
			document.addEventListener('touchend', handleTouchEnd)
			
			return () => {
				document.removeEventListener('touchmove', handleTouchMove)
				document.removeEventListener('touchend', handleTouchEnd)
			}
		}
	}, [isDragging, dragStartY, dragStartOffset, offsetY])

	return (
		<div className="relative w-full h-48 overflow-hidden rounded border border-border bg-muted/30">
			<img
				src={imageUrl}
				alt="Banner preview"
				className={`absolute top-0 left-0 w-full h-auto select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
				style={{ 
					transform: `translateY(${offsetY}px)`,
					imageRendering: 'auto'
				}}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				draggable={false}
			/>
			
			{isDragging && (
				<div className="absolute inset-0 border-2 border-primary rounded pointer-events-none" />
			)}
			
			<div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
				Click and drag to adjust position
			</div>
			
			<div className="absolute top-2 right-2 flex gap-1">
				<button
					type="button"
					onClick={() => {
						setOffsetY(0)
						onSave(imageFile, 0)
					}}
					className="bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
				>
					Reset
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
				>
					Remove
				</button>
			</div>
		</div>
	)
}
