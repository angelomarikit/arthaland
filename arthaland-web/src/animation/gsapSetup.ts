import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let initialized = false

export function initGsap() {
  if (initialized) return
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  })
  initialized = true
}

export { gsap, ScrollTrigger }
