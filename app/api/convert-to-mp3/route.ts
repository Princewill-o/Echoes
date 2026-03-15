import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const { audioUrl } = await req.json()
    
    if (!audioUrl) {
      return NextResponse.json({ error: 'No audio URL provided' }, { status: 400 })
    }

    // Extract filename from URL
    const filename = audioUrl.split('/').pop()
    const wavPath = path.join(process.cwd(), 'public', 'audio', filename)
    const mp3Filename = filename.replace('.wav', '.mp3')
    const mp3Path = path.join(process.cwd(), 'public', 'audio', mp3Filename)

    // Check if WAV file exists
    if (!fs.existsSync(wavPath)) {
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 })
    }

    // Check if MP3 already exists
    if (fs.existsSync(mp3Path)) {
      return NextResponse.json({
        mp3Url: `/audio/${mp3Filename}`,
        message: 'MP3 already exists'
      })
    }

    // Convert WAV to MP3 using ffmpeg
    // Note: ffmpeg must be installed on the system
    try {
      await execAsync(`ffmpeg -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}"`)
      
      return NextResponse.json({
        mp3Url: `/audio/${mp3Filename}`,
        message: 'Conversion successful'
      })
    } catch (ffmpegError) {
      console.error('FFmpeg error:', ffmpegError)
      return NextResponse.json({
        error: 'FFmpeg not available',
        message: 'Install ffmpeg to enable MP3 conversion',
        hint: 'brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error converting to MP3:', error)
    return NextResponse.json(
      { error: 'Failed to convert audio' },
      { status: 500 }
    )
  }
}
