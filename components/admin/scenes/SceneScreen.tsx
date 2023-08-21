"use client"
import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server';
import HotspotAddModal from './HotspotAddModal'
import { Viewer } from "@photo-sphere-viewer/core";
import { EquirectangularTilesAdapter } from "@photo-sphere-viewer/equirectangular-tiles-adapter";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css"
import "@photo-sphere-viewer/markers-plugin/index.css"
import { SceneDataState } from '@/app/admin/(admin)/scenes/page';
import { InfoHotspot, LinkHotspot } from '@prisma/client';
import LinkHotSpot4 from './hotspots/LinkHotSpot4';
import LinkHotSpot from './hotspots/LinkHotSpot';
import InfoHotSpot from './hotspots/InfoHotSpot';
import InfoHotSpot2 from './hotspots/InfoHotSpot2';
// import "$lib/admin/tinymce.css"

const AdminSceneScreen = ({
  scenes, sceneId, setSceneId
}: {
  scenes: SceneDataState[],
  sceneId?: string, 
  setSceneId: Dispatch<SetStateAction<string>>
}) => {
  const isMounted = useRef(false)

  const viewerHTML = useRef<HTMLDivElement>(null)
  const viewer = useRef<Viewer>()
  const markersPlugin = useRef<MarkersPlugin>()
  const autoRotate = useRef<AutorotatePlugin>()

  const [currentScene, setCurrentScene] = useState<SceneDataState | undefined>(scenes.find(v => v.id == sceneId))
  const [autoRotateCheck, setAutoRotateCheck] = useState(false)

  useEffect(() => {
    setCurrentScene(scenes.find(v => v.id == sceneId))
    changeScene(sceneId)
  }, [sceneId])

  useEffect(() => {
    changeDataScene(scenes)
  }, [scenes])

  const changeScene = (id: string | undefined) => {
    if (!isMounted.current) return
    let scene = scenes.find(v => v.id == id)
    if (scene) {
      autoRotate.current?.setOptions({
        autorotatePitch: scene.initialViewParameters.pitch
      })
      switchScene(scene)
    }
  }

  const changeDataScene = async (data: SceneDataState[]) => {
    if (currentScene && isMounted.current) {
      await new Promise(res => {
        markersPlugin.current?.clearMarkers()
        res(true)
      })
      createLinkHotspotElements(currentScene.linkHotspots)
      createInfoHotspotElements(currentScene.infoHotspots)
    }
  }

  const findSceneDataById = (id: string ) => scenes.find(v => v.id == id)

  function switchScene(scene: SceneDataState) {
    markersPlugin.current?.clearMarkers()
    viewer.current?.setPanorama({
      width: scene.faceSize,
      cols: 16,
      rows: 8,
      baseUrl: `/storage/tiles/${scene.id}/low.jpg`,
      tileUrl: (col: number, row: number) => {
        return `/storage/tiles/${scene.id}/${row}_${col}.jpg`
      },
    }, {
      pitch: scene.initialViewParameters.pitch,
      yaw: scene.initialViewParameters.yaw,
      zoom: scene.initialViewParameters.zoom,
      showLoader: false,
      transition: 100,

      // overlay: false
    }).then(v => {
      createLinkHotspotElements(scene.linkHotspots)
      createInfoHotspotElements(scene.infoHotspots)
    })
  }

  function toggleAutorotate() {
    if (autoRotateCheck) {
      autoRotate.current?.stop()
      setAutoRotateCheck(false)
    } else {
      autoRotate.current?.start()
      setAutoRotateCheck(true)
    }
  }
 
  function createLinkHotspotElements(hotspots: LinkHotspot[]) {
    hotspots.forEach(hotspot => {
      let tooltip = undefined,
        html = undefined,
        image = undefined,
        size = { width: 0, height: 0 }

      if (hotspot?.type == "2") {
        tooltip = findSceneDataById(hotspot.target)?.name || ""
        image = '/images/flycam.png'
        size = { width: 96, height: 96 }
      }
      else if (hotspot?.type == "3") {
        tooltip = findSceneDataById(hotspot.target)?.name || ""
        image = '/images/arrow.png'
        size = { width: 96, height: 96 }
      }
      else if (hotspot?.type == "4") {
        html = renderToString(LinkHotSpot4({title: findSceneDataById(hotspot.target)?.name || ""}))
      }
      else {
        html = renderToString(LinkHotSpot({
          title: findSceneDataById(hotspot.target)?.name || "", 
          image: `/storage/tiles/${hotspot.target}/fisheye.png`}
        ))
      }

      markersPlugin.current?.addMarker({
        id: hotspot.id,
        position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        html: html,
        image: image,
        size: size,
        anchor: 'center',
        data: {
          type: 'link',
          target: hotspot.target
        },
        tooltip: tooltip
      });
    })
  }

  function createInfoHotspotElements(hotspots: InfoHotspot[]) {
    hotspots.forEach(hotspot => {
      let tooltip = undefined,
        html = undefined,
        image = undefined,
        content = undefined

      if (hotspot?.type == "2") {
        tooltip = hotspot.title ?? ''
        html = renderToString(InfoHotSpot2())
      }
      else {
        tooltip = hotspot.title ?? ''
        content = hotspot.description ?? ''
        html = renderToString(InfoHotSpot())
      }

      markersPlugin.current?.addMarker({
        id: hotspot.id,
        position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        html: html,
        image: image,
        size: { width: 40, height: 40 },
        anchor: 'center',
        content,
        data: {
          type: 'info',
          title: tooltip,
          video: hotspot.video
        },
        tooltip: tooltip
      });
    })
  }

  // add hostpost modal
  const [openHotspotModal, setOpenHotspotModal] = useState(false)
  const [coordinatesAdd , setCoordinatesAdd ] = useState({ yaw: 0, pitch: 0 })

  useEffect(() => {
    if (!viewerHTML.current) return

    viewer.current = new Viewer({
      container: viewerHTML.current,
      adapter: EquirectangularTilesAdapter,
      navbar: false,
      plugins: [
        [AutorotatePlugin, {
          autostartDelay: null,
          autostartOnIdle: false,
          autorotatePitch: currentScene?.initialViewParameters.pitch,
          autorotateSpeed: '0.5rpm',
        }],
        MarkersPlugin
      ],

      defaultPitch: currentScene?.initialViewParameters.pitch,
      defaultYaw: currentScene?.initialViewParameters.yaw,
      defaultZoomLvl: currentScene?.initialViewParameters.zoom,

      touchmoveTwoFingers: true,
      panorama: {
        width: currentScene?.faceSize,
        cols: 16,
        rows: 8,
        baseUrl: `/storage/tiles/${currentScene?.id}/low.jpg`,
        tileUrl: (col: number, row: number) => {
          return `/storage/tiles/${currentScene?.id}/${row}_${col}.jpg`
        },
      },
    })

    markersPlugin.current = viewer.current.getPlugin(MarkersPlugin) as MarkersPlugin
    autoRotate.current = viewer.current.getPlugin(AutorotatePlugin) as AutorotatePlugin

    if (scenes.length > 0) {
      createLinkHotspotElements(currentScene?.linkHotspots || [])
      createInfoHotspotElements(currentScene?.infoHotspots || [])
    }

    markersPlugin.current.addEventListener('select-marker', ({ marker }) => {
      if (marker.data?.type == "link" && marker.data?.target) {
        sceneId = marker.data?.target
      }
      
      if (marker.data?.type == "info") {
        if (marker.data?.video) {
          // $videoShow = marker.data?.video
        }
      }
    })

    viewer.current.addEventListener('dblclick', ({ data }) => {
      setCoordinatesAdd({
        yaw: data.yaw,
        pitch: data.pitch
      })

      setOpenHotspotModal(true)
    })

    isMounted.current = true

    return () => {
      if(viewer)
        viewer.current?.destroy()
    }
  }, [])

  return (
    <>
      { scenes.length > 0
        ? <div ref={viewerHTML} className='w-full h-full'></div>
        : <div className="w-full h-full grid place-items-center">Không có điểm chụp nào</div>
      }
      
      <HotspotAddModal coordinates={coordinatesAdd} open={openHotspotModal} setOpen={setOpenHotspotModal} />
    </>
  )
}

export default AdminSceneScreen