import * as React from "react"
import { cn } from "@/lib/utils"

const MscTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-none border border-border">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
)
MscTable.displayName = "Table"

const MscTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-gray-50 border-b border-border", className)} {...props} />
  )
)
MscTableHeader.displayName = "TableHeader"

const MscTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
)
MscTableBody.displayName = "TableBody"

const MscTableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t border-border bg-gray-50 font-medium", className)}
      {...props}
    />
  )
)
MscTableFooter.displayName = "TableFooter"

const MscTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border hover:bg-gray-50/50 transition-colors data-[state=selected]:bg-blue-50",
        className
      )}
      {...props}
    />
  )
)
MscTableRow.displayName = "TableRow"

const MscTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
)
MscTableHead.displayName = "TableHead"

const MscTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-4 py-3 align-middle", className)} {...props} />
  )
)
MscTableCell.displayName = "TableCell"

const MscTableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
MscTableCaption.displayName = "TableCaption"

export {
  MscTable as Table,
  MscTableHeader as TableHeader,
  MscTableBody as TableBody,
  MscTableFooter as TableFooter,
  MscTableHead as TableHead,
  MscTableRow as TableRow,
  MscTableCell as TableCell,
  MscTableCaption as TableCaption,
}
