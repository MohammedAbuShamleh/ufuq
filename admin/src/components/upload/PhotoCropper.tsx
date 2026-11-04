import { useState } from 'react'
import { CropDialog, type Pending } from './CropDialog'

/**
 * Team photos are shown in circles, so they are cut square before upload:
 * drag to place, zoom with the slider, arrows and +/- from the keyboard.
 * Returns `prepare` for SingleUpload and the dialog to render.
 */
export function usePhotoCropper() {
  const [pending, setPending] = useState<Pending | null>(null)

  const prepare = (file: File) =>
    new Promise<File | null>((resolve) => {
      setPending({ file, url: URL.createObjectURL(file), resolve })
    })

  const finish = (file: File | null) => {
    if (!pending) return
    URL.revokeObjectURL(pending.url)
    pending.resolve(file)
    setPending(null)
  }

  return { prepare, dialog: pending && <CropDialog key={pending.url} pending={pending} onDone={finish} /> }
}
