import { FC, ReactNode, useLayoutEffect, useRef, useState } from "react"
import clsx from "clsx"

type Props = {
  children: ReactNode
  defaultHeight: number
  className?: string
}
const Component: FC<Props> = ({ children, defaultHeight, className }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [height, setHeight] = useState(0)
  const needToToggle = defaultHeight < height
  const wrapperHeight = needToToggle ? defaultHeight : height
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const height = ref.current?.clientHeight
    setHeight(height || 0)
  }, [])

  const wrapperStyle = {
    height: `${isCollapsed ? height : wrapperHeight}px`,
  }

  return (
    <div
      style={wrapperStyle}
      className={clsx("overflow-hidden relative", className)}
    >
      <div ref={ref} className={clsx(isCollapsed && "pb-8")}>
        {children}
      </div>
      {needToToggle && (
        <div className="backdrop-blur-lg absolute bottom-0 left-0 w-full pt-1">
          <button
            className="btn btn-sm btn-ghost px-1"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? "一部を表示" : "もっと見る"}
          </button>
        </div>
      )}
    </div>
  )
}

export default Component
