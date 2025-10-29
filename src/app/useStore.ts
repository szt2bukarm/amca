import { create } from 'zustand'

interface Store {
    jobs : any
    setJobs : any
}

export const useStore = create<Store>((set) => ({
    jobs: [],
    setJobs: (jobs:any) => set({ jobs }),
}))