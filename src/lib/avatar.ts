import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseEnv } from "@/lib/supabase/env"

export const AVATAR_BUCKET = "avatars"
export const AVATAR_SIZE = 256
export const AVATAR_MAX_INPUT_BYTES = 8 * 1024 * 1024

export function avatarObjectPath(userId: string) {
  return `${userId}/avatar.webp`
}

export function buildAvatarPublicUrl(path: string, version?: string | number) {
  const { url } = getSupabaseEnv()
  const base = `${url.replace(/\/$/, "")}/storage/v1/object/public/${AVATAR_BUCKET}/${path}`
  return version != null ? `${base}?v=${version}` : base
}

function readAvatarMeta(meta: Record<string, unknown> | undefined) {
  const avatarUrl =
    typeof meta?.avatar_url === "string" ? meta.avatar_url.trim() : ""
  const avatarPath =
    typeof meta?.avatar_path === "string" ? meta.avatar_path.trim() : ""
  return { avatarUrl, avatarPath }
}

export function resolveAvatarUrl(
  meta: Record<string, unknown> | undefined
): string | undefined {
  const { avatarUrl, avatarPath } = readAvatarMeta(meta)
  if (avatarUrl) return avatarUrl
  if (avatarPath) return buildAvatarPublicUrl(avatarPath)
  return undefined
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

/** Center-crop + resize to a small WebP (JPEG fallback) before upload. */
export async function compressAvatar(file: File): Promise<{
  blob: Blob
  contentType: string
  extension: "webp" | "jpg"
}> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.")
  }
  if (file.size > AVATAR_MAX_INPUT_BYTES) {
    throw new Error("Image must be 8MB or smaller.")
  }

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    throw new Error("Could not process image.")
  }

  const side = Math.min(bitmap.width, bitmap.height)
  const sx = (bitmap.width - side) / 2
  const sy = (bitmap.height - side) / 2
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)
  bitmap.close()

  const webp = await canvasToBlob(canvas, "image/webp", 0.82)
  if (webp && webp.size > 0) {
    return { blob: webp, contentType: "image/webp", extension: "webp" }
  }

  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.85)
  if (!jpeg) {
    throw new Error("Could not compress image.")
  }
  return { blob: jpeg, contentType: "image/jpeg", extension: "jpg" }
}

export async function uploadUserAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<string> {
  const compressed = await compressAvatar(file)
  const path =
    compressed.extension === "webp"
      ? avatarObjectPath(userId)
      : `${userId}/avatar.jpg`

  // Keep a single object per user; remove previous extensions first.
  await supabase.storage
    .from(AVATAR_BUCKET)
    .remove([avatarObjectPath(userId), `${userId}/avatar.jpg`])

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, compressed.blob, {
      upsert: true,
      contentType: compressed.contentType,
      cacheControl: "3600",
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const updatedAt = Date.now()
  const publicUrl = buildAvatarPublicUrl(path, updatedAt)

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      avatar_path: path,
      updated_at: new Date(updatedAt).toISOString(),
    },
    { onConflict: "id" }
  )

  if (profileError) {
    throw new Error(profileError.message)
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      avatar_url: publicUrl,
      avatar_path: path,
    },
  })

  if (metaError) {
    throw new Error(metaError.message)
  }

  return publicUrl
}

export async function removeUserAvatar(
  supabase: SupabaseClient,
  userId: string,
  currentPath?: string | null
): Promise<void> {
  const targets = new Set<string>([
    avatarObjectPath(userId),
    `${userId}/avatar.jpg`,
  ])
  if (currentPath?.trim()) targets.add(currentPath.trim())

  await supabase.storage.from(AVATAR_BUCKET).remove([...targets])

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      avatar_path: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (profileError) {
    throw new Error(profileError.message)
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      avatar_url: "",
      avatar_path: "",
    },
  })

  if (metaError) {
    throw new Error(metaError.message)
  }
}
