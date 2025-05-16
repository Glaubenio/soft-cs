import { hexToRgbA } from "@/lib/utils"
import { JourneyStep } from "@/types/types"
import React from "react"

export const StepLabel = ({ step: { color, name } }: { step: JourneyStep }) => {
  const colorStyles = {
    '--step-bg-color': hexToRgbA(color, 0.2),
    '--step-text-color': color,
  } as React.CSSProperties

  return (
    <div className="flex flex-row font-[400] text-[10px] mt-[6px] items-center gap-1">
      <div style={colorStyles}
        className={`bg-[--step-bg-color] rounded-full flex flex-row items-center px-[12px] w-fit py-[4px]`}>
        <div
          style={colorStyles}
          className={`h-[6px] w-[6px] bg-[--step-text-color] rounded-full inline-block mr-[8px]`} />
        <div style={colorStyles} className={`text-[--step-text-color] text-[10px] font-[700]`}>
          {name}
        </div>
      </div>
    </div>
  )
}