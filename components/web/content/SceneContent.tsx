"use client"

import { SceneDataState } from "@/app/admin/(admin)/scenes/page"
import { GroupScene } from "@prisma/client"
import ScenesScreen from "../scenes/ScenesScreen"
import { Children, useRef, useState } from "react"
import useSettings from "@/stores/settings"
import Image from "next/image"
import { Button } from "@mui/material"
import useScene from "@/stores/web/scene"
import { motion } from "framer-motion"

const SceneContent = ({
  defaultScenes = [], defaultGroups = [], children
}: {
  defaultScenes: SceneDataState[],
  defaultGroups: GroupScene[],
  children: React.ReactNode
}) => {
  const {findSettingByName} = useSettings()

  const  {start, setStart, setScenes, setGroups} = useScene()

  const willMount = useRef(true)

  if (willMount.current) {
    setScenes(defaultScenes)
    setGroups(defaultGroups)
    willMount.current = false
  }

  const [startCompleted, setStartCompleted] = useState(false)

  return (
    <>
      <style global jsx>
        {`body {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }`}
      </style>

      { defaultScenes.length > 0
        ? <ScenesScreen />
        : <div className="fixed w-full h-screen top-0 left-0 grid place-items-center">
          Không có bối cảnh nào
        </div>
      }

      { !start
        ? <motion.div 
            className="fixed w-full h-screen top-0 left-0 z-[100] bg-white"
            animate={{
              scale: startCompleted ? 2 : 1,
              opacity: startCompleted ? 0 : 1
            }}
            initial={false}
            transition={{ type: "tween", duration: 0.7}}
            onAnimationComplete={() => {
              setStart(true)
            }}
          >
          <Image 
            src={findSettingByName('banner')?.url || ''} 
            alt="banner website"
            width={1920}
            height={1080} 
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 70vw, 100vw"
          />

          <div className="absolute w-full h-full left-0 top-0 flex flex-col items-center justify-center gap-8">
            <Button 
              size="large" 
              variant="contained" 
              className="!rounded-full !bg-gradient-to-r !from-cyan-500 !to-blue-500" 
              onClick={() => setStartCompleted(true)}
            >Bắt đầu tham quan</Button>
          </div>
        </motion.div>
        : null
      }

      { children }
    </>
  )
}

export default SceneContent