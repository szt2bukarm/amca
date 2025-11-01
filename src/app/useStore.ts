import { create } from 'zustand'
import * as THREE from 'three'

interface DepthPlaneTexture {
    color: THREE.Texture
    depth: THREE.Texture
  }

  interface Store {
    jobs: any[]
    setJobs: (jobs: any[]) => void
  
    loaded: boolean
    setLoaded: (loaded: boolean) => void
  
    loadedHeroFrames: HTMLImageElement[] | null
    setHeroFrames: (frames: HTMLImageElement[]) => void
  
    depthPlaneTextures: DepthPlaneTexture[] | null
    setDepthPlaneTextures: (textures: DepthPlaneTexture[]) => void

    isMobile: boolean
    setIsMobile: (isMobile: boolean) => void
  }
  
  export const useStore = create<Store>((set) => ({
    jobs: [],
    setJobs: (jobs) => set({ jobs }),
  
    loaded: false,
    setLoaded: (loaded) => set({ loaded }),
  
    loadedHeroFrames: null,
    setHeroFrames: (frames) => set({ loadedHeroFrames: frames }),
  
    depthPlaneTextures: null,
    setDepthPlaneTextures: (textures) => set({ depthPlaneTextures: textures }),

    isMobile: false,
    setIsMobile: (isMobile) => set({ isMobile }),
  }))