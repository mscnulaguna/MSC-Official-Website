import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

/**
 * AlertDialogBasic - MSC Custom Component
 * ========================================
 * A pre-configured alert dialog component with MSC branding and messaging.
 * This is an app-specific custom variant of the base AlertDialog from shadcn/ui.
 *
 * USAGE:
 * <AlertDialogBasic />
 *
 * CUSTOMIZATION:
 * Edit the text content, button labels, and styling as needed for your use case.
 * For generic AlertDialog patterns, use the base AlertDialog component instead.
 */

export function AlertDialogBasic() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hold up… save first?</AlertDialogTitle>
          <AlertDialogDescription>
            You made updates to your profile. Saving helps us recommend sessions that match your interests and goals.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
