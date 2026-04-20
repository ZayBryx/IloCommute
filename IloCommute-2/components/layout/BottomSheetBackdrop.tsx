import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet"

const CustomBackdrop = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.5}
    />
  )
}

export default CustomBackdrop
