'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import * as THREE from 'three'

type CoffeeSceneProps = {
  variant: 'latte' | 'espresso' | 'matcha'
}

const makeDrinkTexture = (variant: CoffeeSceneProps['variant']) => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')

  if (!context) throw new Error('Canvas textures are unavailable')

  const palette = variant === 'matcha'
    ? { base: '#71834d', edge: '#39472a', art: '#f4f0db', accent: '#c6d28e' }
    : variant === 'espresso'
      ? { base: '#4c251a', edge: '#29140f', art: '#d6a66b', accent: '#a96a3e' }
      : { base: '#9b5835', edge: '#512b1d', art: '#fff2d8', accent: '#e9c89b' }

  const base = context.createRadialGradient(195, 165, 16, 256, 256, 310)
  base.addColorStop(0, palette.base)
  base.addColorStop(0.78, palette.base)
  base.addColorStop(1, palette.edge)
  context.fillStyle = base
  context.fillRect(0, 0, 512, 512)

  context.save()
  context.translate(256, 256)
  context.strokeStyle = palette.accent
  context.globalAlpha = variant === 'espresso' ? 0.38 : 0.3
  context.lineWidth = 3
  for (let radius = 70; radius <= 250; radius += 25) {
    context.beginPath()
    context.ellipse(0, 0, radius, radius * 0.94, 0, 0.2, Math.PI * 1.92)
    context.stroke()
  }
  context.restore()

  context.save()
  context.translate(256, 260)
  context.fillStyle = palette.art
  context.strokeStyle = palette.art
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.globalAlpha = 0.96

  if (variant === 'espresso') {
    context.lineWidth = 12
    context.beginPath()
    context.arc(0, 0, 112, -0.82, 4.8)
    context.stroke()
    context.lineWidth = 7
    context.beginPath()
    context.arc(0, 0, 66, 0.15, 5.1)
    context.stroke()
    context.beginPath()
    context.arc(0, 0, 23, 0, Math.PI * 2)
    context.fill()
  } else {
    context.beginPath()
    context.moveTo(0, 122)
    context.bezierCurveTo(-13, 79, -23, 34, 0, -112)
    context.bezierCurveTo(25, 29, 15, 76, 0, 122)
    context.fill()

    const leaves = variant === 'matcha' ? 5 : 6
    for (let index = 0; index < leaves; index += 1) {
      const y = 79 - index * 29
      const direction = index % 2 === 0 ? -1 : 1
      context.beginPath()
      context.moveTo(0, y + 20)
      context.bezierCurveTo(direction * 21, y + 13, direction * 39, y - 5, direction * 43, y - 27)
      context.bezierCurveTo(direction * 18, y - 21, direction * 5, y - 8, 0, y + 20)
      context.fill()
      context.strokeStyle = variant === 'matcha' ? '#89965b' : '#d7ab7c'
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(0, y + 18)
      context.lineTo(direction * 34, y - 18)
      context.stroke()
      context.strokeStyle = palette.art
    }

    context.beginPath()
    context.moveTo(-1, 111)
    context.bezierCurveTo(-79, 91, -88, 30, -1, -3)
    context.bezierCurveTo(82, 34, 77, 91, -1, 111)
    context.fill()
    context.fillStyle = variant === 'matcha' ? '#829052' : '#b87a4d'
    context.beginPath()
    context.moveTo(0, 94)
    context.bezierCurveTo(-39, 76, -43, 43, 0, 13)
    context.bezierCurveTo(42, 43, 39, 76, 0, 94)
    context.fill()
  }

  context.restore()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

const makeLathe = (points: Array<[number, number]>, material: THREE.Material) => {
  const geometry = new THREE.LatheGeometry(
    points.map(([radius, height]) => new THREE.Vector2(radius, height)),
    96,
  )
  geometry.computeVertexNormals()
  return new THREE.Mesh(geometry, material)
}

const makeBean = (scene: THREE.Group, x: number, z: number, angle: number) => {
  const bean = new THREE.Mesh(
    new THREE.SphereGeometry(1, 28, 20),
    new THREE.MeshStandardMaterial({ color: '#59301f', roughness: 0.37, metalness: 0.04 }),
  )
  bean.position.set(x, -0.105, z)
  bean.scale.set(0.14, 0.085, 0.095)
  bean.rotation.set(-0.15, angle, 0.22)
  bean.castShadow = true
  bean.receiveShadow = true
  scene.add(bean)

  const groove = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.72, 0.68, 0),
    new THREE.Vector3(0, 1.02, 0.13),
    new THREE.Vector3(0.72, 0.68, 0),
  )
  const grooveMesh = new THREE.Mesh(
    new THREE.TubeGeometry(groove, 16, 0.045, 6, false),
    new THREE.MeshStandardMaterial({ color: '#29160f', roughness: 0.58 }),
  )
  grooveMesh.position.copy(bean.position)
  grooveMesh.scale.copy(bean.scale)
  grooveMesh.rotation.copy(bean.rotation)
  scene.add(grooveMesh)
}

export default function CoffeeScene({ variant }: CoffeeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const [interaction, setInteraction] = useState<{ pointerId: number; x: number; rotation: number } | null>(null)
  const rotationRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    let drinkTexture: THREE.CanvasTexture | undefined

    try {
      drinkTexture = makeDrinkTexture(variant)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      drinkTexture?.dispose()
      if (fallbackRef.current) {
        fallbackRef.current.hidden = false
        fallbackRef.current.style.display = 'grid'
      }
      return
    }

    if (fallbackRef.current) {
      fallbackRef.current.hidden = true
      fallbackRef.current.style.display = 'none'
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 80)
    camera.position.set(4.7, 8.5, 10)
    camera.lookAt(0, 0.48, 0)
    const artwork = new THREE.Group()
    rotationRef.current = artwork
    scene.add(artwork)

    scene.add(new THREE.HemisphereLight('#fff8e9', '#77735f', 2.35))
    const keyLight = new THREE.DirectionalLight('#fff0d5', 3.3)
    keyLight.position.set(-3.5, 8, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.left = -4
    keyLight.shadow.camera.right = 4
    keyLight.shadow.camera.top = 4
    keyLight.shadow.camera.bottom = -4
    keyLight.shadow.bias = -0.0003
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight('#e5ecd6', 1.05)
    fillLight.position.set(5, 4, -4)
    scene.add(fillLight)

    const saucerMaterial = new THREE.MeshStandardMaterial({ color: '#e8dfc9', roughness: 0.25, metalness: 0.02 })
    const saucer = makeLathe([
      [0, -0.19], [0.9, -0.19], [1.12, -0.16], [1.22, -0.1],
      [1.24, -0.055], [1.19, -0.025], [1.1, -0.065], [0.82, -0.1], [0, -0.1],
    ], saucerMaterial)
    saucer.receiveShadow = true
    artwork.add(saucer)

    const cupMaterial = new THREE.MeshStandardMaterial({ color: '#87977f', roughness: 0.24, metalness: 0.015 })
    const cup = makeLathe([
      [0, -0.04], [0.58, -0.04], [0.67, 0.015], [0.74, 0.18],
      [0.91, 1.12], [0.94, 1.25], [0.9, 1.3], [0.8, 1.3],
      [0.77, 1.2], [0.59, 0.27], [0.52, 0.19], [0, 0.19],
    ], cupMaterial)
    cup.castShadow = true
    cup.receiveShadow = true
    artwork.add(cup)

    const innerCup = makeLathe([
      [0, 0.22], [0.5, 0.22], [0.55, 0.28], [0.71, 1.14], [0.74, 1.21], [0.7, 1.22], [0.53, 0.31], [0, 0.31],
    ], new THREE.MeshStandardMaterial({ color: '#f0e8d8', roughness: 0.19, side: THREE.DoubleSide }))
    innerCup.castShadow = true
    artwork.add(innerCup)

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.855, 0.065, 18, 96),
      new THREE.MeshStandardMaterial({ color: '#a8b39b', roughness: 0.2 }),
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = 1.265
    rim.castShadow = true
    artwork.add(rim)

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.105, 24, 64),
      cupMaterial,
    )
    handle.position.set(1.14, 0.67, 0)
    handle.rotation.z = -0.1
    handle.castShadow = true
    handle.receiveShadow = true
    artwork.add(handle)

    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.735, 96),
      new THREE.MeshStandardMaterial({ map: drinkTexture, roughness: variant === 'espresso' ? 0.24 : 0.32 }),
    )
    coffee.rotation.x = -Math.PI / 2
    coffee.position.y = 1.175
    coffee.receiveShadow = true
    artwork.add(coffee)

    const cremaRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.724, 0.016, 10, 96),
      new THREE.MeshStandardMaterial({ color: variant === 'matcha' ? '#b5c27b' : '#c88751', roughness: 0.38 }),
    )
    cremaRim.rotation.x = Math.PI / 2
    cremaRim.position.y = 1.178
    artwork.add(cremaRim)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ color: '#514335', opacity: 0.19 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.205
    ground.receiveShadow = true
    scene.add(ground)

    makeBean(artwork, -0.91, 0.44, 0.5)
    makeBean(artwork, 0.93, 0.55, -0.65)
    makeBean(artwork, -0.83, -0.6, -0.3)
    makeBean(artwork, 0.72, -0.78, 0.8)

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      if (!width || !height) return
      const verticalExtent = 1.72
      const aspect = width / height
      camera.top = verticalExtent
      camera.bottom = -verticalExtent
      camera.left = -verticalExtent * aspect
      camera.right = verticalExtent * aspect
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      renderer.render(scene, camera)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionPreference.matches
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
    }
    motionPreference.addEventListener('change', updateMotionPreference)

    let frame = 0
    let disposed = false
    const render = () => {
      if (disposed) return
      if (!reducedMotion) artwork.rotation.y += 0.0012
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }
    frame = window.requestAnimationFrame(render)

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      motionPreference.removeEventListener('change', updateMotionPreference)
      rotationRef.current = null
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose()
            })
            material.dispose()
          })
        }
      })
      drinkTexture?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [variant])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const artwork = mountRef.current?.querySelector('canvas')
    if (!artwork) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const group = rotationRef.current
    setInteraction({ pointerId: event.pointerId, x: event.clientX, rotation: group?.rotation.y ?? 0 })
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interaction || interaction.pointerId !== event.pointerId || !rotationRef.current) return
    rotationRef.current.rotation.y = interaction.rotation + (event.clientX - interaction.x) * 0.009
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (interaction?.pointerId !== event.pointerId) return
    setInteraction(null)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!rotationRef.current || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    event.preventDefault()
    rotationRef.current.rotation.y += event.key === 'ArrowLeft' ? -0.18 : 0.18
  }

  return (
    <div
      ref={mountRef}
      tabIndex={0}
      role="img"
      aria-label={`Interactive 3D ${variant} coffee cup. Drag or use the left and right arrow keys to rotate.`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 320,
        overflow: 'hidden',
        cursor: interaction ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
      }}
    >
      <div
        ref={fallbackRef}
        hidden
        role="status"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'none',
          placeItems: 'center',
          padding: 24,
          color: '#59634f',
          font: '500 15px/1.5 system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        This 3D coffee scene is unavailable in this browser.
      </div>
    </div>
  )
}
