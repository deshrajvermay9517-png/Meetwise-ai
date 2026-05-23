// lib/ai/transcribe.ts — OpenAI Whisper transcription
import OpenAI from 'openai'
import { TranscriptSegment } from '@/lib/types'

let openai: OpenAI | null = null

function getOpenAI() {
  if (openai) return openai
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'sk-...' || apiKey.trim() === '') {
    throw new Error('AI transcription is not configured yet. Add your OpenAI API key in Settings or .env.local to enable transcription.')
  }
  openai = new OpenAI({ apiKey })
  return openai
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string,
  language = 'en'
): Promise<{ full_text: string; segments: TranscriptSegment[]; duration_secs: number }> {
  const client = getOpenAI()
  const file = new File([audioBuffer as any], filename, {
    type: getMimeType(filename),
  })

  const response = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  const segments: TranscriptSegment[] = (response.segments ?? []).map((seg, i) => ({
    start: seg.start,
    end: seg.end,
    speaker: `Speaker ${detectSpeaker(i, seg.text)}`, // basic heuristic; replace with diarization
    text: seg.text.trim(),
  }))

  return {
    full_text: response.text,
    segments,
    duration_secs: Math.round(response.duration ?? 0),
  }
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    mp4: 'audio/mp4',
    m4a: 'audio/m4a',
    wav: 'audio/wav',
    webm: 'audio/webm',
    ogg: 'audio/ogg',
  }
  return map[ext ?? ''] ?? 'audio/mpeg'
}

// Very basic speaker turn detection (upgrade to pyannote or AssemblyAI for real diarization)
function detectSpeaker(segmentIndex: number, _text: string): string {
  // Real diarization would go here. For MVP, alternate speakers every ~3 segments.
  const labels = ['A', 'B', 'C', 'D']
  return labels[Math.floor(segmentIndex / 3) % labels.length]
}
