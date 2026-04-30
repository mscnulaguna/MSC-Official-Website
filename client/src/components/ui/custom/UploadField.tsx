import { useEffect, useRef, useState } from "react"
import { FileText, Upload } from "lucide-react"

import { Label } from "@/components/ui/label"

type UploadFieldProps = {
	id: string
	label: string
	helperText: string
	buttonText: string
	accept: string
	selectedFile: File | null
	onFileSelect: (file: File | null) => void
	previewMode?: "image" | "file"
}

export function UploadField({
	id,
	label,
	helperText,
	buttonText,
	accept,
	selectedFile,
	onFileSelect,
	previewMode = "file",
}: UploadFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	useEffect(() => {
		if (!selectedFile || previewMode !== "image" || !selectedFile.type.startsWith("image/")) {
			setPreviewUrl(null)
			return undefined
		}

		const objectUrl = URL.createObjectURL(selectedFile)
		setPreviewUrl(objectUrl)

		return () => {
			URL.revokeObjectURL(objectUrl)
		}
	}, [previewMode, selectedFile])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null
		onFileSelect(file)
		event.target.value = ""
	}

	const openPicker = () => {
		inputRef.current?.click()
	}

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<button
				type="button"
				onClick={openPicker}
				className="flex min-h-36 w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-background p-4 text-center transition-colors hover:bg-muted/30"
			>
				{previewMode === "image" && previewUrl ? (
					<div className="flex w-full max-w-xs flex-col items-center gap-3">
						<img
							src={previewUrl}
							alt={selectedFile?.name ?? label}
							className="max-h-48 max-w-full rounded-md border border-border object-contain"
						/>
						<p className="max-w-full truncate text-sm font-medium text-foreground">
							{selectedFile?.name}
						</p>
						<p className="text-xs text-muted-foreground">{buttonText}</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-2">
						<Upload className="h-8 w-8 text-foreground" />
						<p className="text-sm text-foreground">{buttonText}</p>
						{selectedFile ? (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<FileText className="h-3.5 w-3.5" />
								<span className="max-w-full truncate">{selectedFile.name}</span>
							</div>
						) : null}
						<p className="text-xs text-muted-foreground">{helperText}</p>
					</div>
				)}
			</button>
			<input ref={inputRef} id={id} type="file" accept={accept} className="hidden" onChange={handleChange} />
		</div>
	)
}