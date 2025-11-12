import { Model, KaldiRecognizer, createModel } from 'vosk-browser'

class SpeechService {
  private model: Model | null = null;
  private recognizer: KaldiRecognizer | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isListening: boolean = false;
  private onPartial: ((text: string) => void) | null = null;
  private onFinal: ((text: string) => void) | null = null;

  constructor() {}

  async init(modelPath = '/models/vosk-model-small-cn-0.22.zip') {
    if (this.model) return
    try {
      this.model = await createModel(modelPath)
      console.log('✅ Vosk 模型加载完成')
    } catch (_) {
      this.model = null
    }
  }

  async start(onPartial: (text: string) => void, onFinal: (text: string) => void) {
    if (this.isListening) return

    if (!this.model) {
      await this.init()
      if (!this.model) return
    }

    this.onPartial = onPartial
    this.onFinal = onFinal

    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 })
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = this.audioContext.createMediaStreamSource(this.stream)

      this.recognizer = new this.model.KaldiRecognizer(this.audioContext.sampleRate)
      this.recognizer.setWords(true)

      // 事件监听只注册一次，并兼容 vosk-browser 的消息结构（message.result.*）
      this.recognizer.on('result', (message: any) => {
        const finalText = message?.result?.text ?? message?.text ?? ''
        if (finalText && this.onFinal) this.onFinal(finalText)
      })

      this.recognizer.on('partialresult', (message: any) => {
        const partialText = message?.result?.partial ?? message?.partial ?? ''
        if (partialText && this.onPartial) this.onPartial(partialText)
      })

      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1)
      this.processor.onaudioprocess = (event) => {
        const data = event.inputBuffer.getChannelData(0)
        this.recognizer?.acceptWaveformFloat(data, this.audioContext!.sampleRate)
      }

      source.connect(this.processor)
      this.processor.connect(this.audioContext.destination)
      this.isListening = true
    } catch (_) {
      this.stop()
    }
  }

  stop() {
    if (!this.isListening) return
    this.isListening = false

    try {
      if (this.processor) this.processor.disconnect()
      if (this.audioContext) this.audioContext.close()
      if (this.stream) this.stream.getTracks().forEach(t => t.stop())
    } catch (_) {
    } finally {
      this.processor = null
      this.audioContext = null
      this.stream = null
      this.recognizer = null
    }
  }

  floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2)
    const view = new DataView(buffer)
    let offset = 0
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return new Int16Array(buffer)
  }
}

export const speechService = new SpeechService()
