export type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }>; role?: string }
    finishReason?: string
    index?: number
  }>
  usageMetadata?: unknown
  modelVersion?: string
  responseId?: string
}

const PRIMARY_MODEL = 'gemini-2.5-flash'
const FALLBACK_MODELS = ['gemini-2.1', 'gemini-1.0']
const makeModelUrl = (modelName: string) => `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`

async function fetchAvailableGenerateModels(apiKey: string): Promise<string[] | null> {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models'
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey } })
    if (!res.ok) return null
    const j = await res.json().catch(() => null)
    if (!j) return null
    const modelsRaw: unknown[] = Array.isArray(j.models) ? j.models : []
    const names: string[] = modelsRaw.map(m => {
      const mm = m as Record<string, unknown>;
      const n: string = typeof mm.name === 'string' ? mm.name : (typeof mm.model === 'string' ? mm.model : '')
      return n.replace(/^models\//, '')
    }).filter(Boolean)
    const supported = modelsRaw.filter(m => {
      const mm = m as Record<string, unknown>;
      return Array.isArray(mm.supportedMethods) && (mm.supportedMethods as unknown[]).includes('generateContent')
    }).map(m => {
      const mm = m as Record<string, unknown>;
      return typeof mm.name === 'string' ? mm.name.replace(/^models\//, '') : ''
    }).filter(Boolean)
    return supported.length > 0 ? supported : names
  } catch (err) {
    console.debug('fetchAvailableGenerateModels failed', err)
    return null
  }
}

type GeminiRequestBody = { contents: Array<{ parts: Array<{ text: string }> }> }

export type GeminiOptions = {
  temperature?: number
  maxOutputTokens?: number
  rawBody?: object
  apiKey?: string
}

export async function generateWithGemini(promptText: string, options?: GeminiOptions): Promise<{ raw: GeminiResponse; text?: string }> {
  if (!promptText) throw new Error('promptText is required')
  const { rawBody, temperature, maxOutputTokens, apiKey: apiKeyFromOptions } = options || {}

  let bodyToSend: unknown
  if (rawBody) {
    bodyToSend = rawBody
  } else {
    let finalPrompt = promptText
    if (temperature != null || maxOutputTokens != null) {
      const opts: Record<string, unknown> = {}
      if (temperature != null) opts.temperature = temperature
      if (maxOutputTokens != null) opts.maxOutputTokens = maxOutputTokens
      finalPrompt = `${promptText}\n\n[MODEL_OPTIONS] ${JSON.stringify(opts)}`
    }
    bodyToSend = { contents: [{ parts: [{ text: finalPrompt }] }] } as GeminiRequestBody
  }

  let apiKeyOverride = apiKeyFromOptions as string | undefined
  if (!apiKeyOverride) {
    try {
      const backend = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_BACKEND_URL || '';
      const url = backend ? `${backend.replace(/\/$/, '')}/user/apikey` : '/api/user/apikey';
      const token = (typeof window !== 'undefined' && window.localStorage) ? (window.localStorage.getItem('token') || '') : '';
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      console.debug('geminiService: requesting server-stored apiKey', { url, hasToken: !!token });
      const keyRes = await fetch(url, { method: 'GET', headers });
      console.debug('geminiService: GET /user/apikey status', { status: keyRes.status });
      if (!keyRes.ok) {
        const txt = await keyRes.text().catch(() => '');
        console.error('geminiService: server returned non-ok for /user/apikey', { status: keyRes.status, body: txt });
        const err = new Error(`GEMINI_KEY_MISSING_PROXY ${keyRes.status}: ${txt}`);
        ;(err as unknown as { code?: string }).code = 'GEMINI_KEY_MISSING'
        throw err
      }
      const keyData = await keyRes.json().catch(() => null);
      const kd = keyData as Record<string, unknown> | null;
      const apikey = (kd?.['apikey'] as string) || (kd?.['apiKey'] as string) || (kd?.['key'] as string) || '';
      console.debug('geminiService: server /user/apikey response', { keyData: { hasApikey: !!kd?.['apikey'], hasApiKey: !!kd?.['apiKey'] } });
      if (!apikey) {
        const err = new Error('GEMINI_KEY_MISSING');
        ;(err as unknown as { code?: string }).code = 'GEMINI_KEY_MISSING'
        throw err
      }
      apiKeyOverride = String(apikey);
    } catch (err) {
      console.error('generateWithGemini failed to obtain key from server', err)
      if (err instanceof Error) throw err
      throw new Error(String(err))
    }
  }

  try {
    let modelsToTry: string[] = []
    try {
      const available = await fetchAvailableGenerateModels(apiKeyOverride as string)
      if (Array.isArray(available) && available.length > 0) {
        const uniq = new Set<string>()
        if (available.includes(PRIMARY_MODEL)) {
          uniq.add(PRIMARY_MODEL)
        }
        for (const m of available) if (m !== PRIMARY_MODEL) uniq.add(m)
        for (const f of FALLBACK_MODELS) if (!uniq.has(f)) uniq.add(f)
        if (!uniq.has(PRIMARY_MODEL)) {
          modelsToTry = [PRIMARY_MODEL, ...Array.from(uniq)]
        } else {
          modelsToTry = Array.from(uniq)
        }
      } else {
        modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS]
      }
    } catch (err) {
      console.debug('generateWithGemini: fetchAvailableGenerateModels failed, using static model list', err)
      modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS]
    }

    console.debug('generateWithGemini will try models in order:', modelsToTry)

    let lastError: Error | null = null
    for (const modelName of modelsToTry) {
      const url = makeModelUrl(modelName)
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKeyOverride
          },
          body: JSON.stringify(bodyToSend)
        })

        if (!resp.ok) {
          const text = await resp.text()
          try {
            const parsed = JSON.parse(text)
            const errObj = parsed?.error
            const msg = errObj?.message || ''
            if (resp.status === 503 || /unavailable|overload|overloaded/i.test(String(msg)) || String(errObj?.status).toUpperCase() === 'UNAVAILABLE') {
              console.warn(`generateWithGemini: model ${modelName} returned ${resp.status} / overloaded, trying fallback if available`)
              lastError = new Error(`Gemini API error ${resp.status}: ${String(msg)}`)
              continue
            }

            const details = errObj?.details
            const hasInvalidKey = (typeof msg === 'string' && msg.toLowerCase().includes('api key not valid')) || (Array.isArray(details) && details.some((d: unknown) => (d && typeof d === 'object' && (d as Record<string, unknown>)['reason'] === 'API_KEY_INVALID')))
            if (resp.status === 400 && hasInvalidKey) {
              const err = new Error('GEMINI_KEY_INVALID')
              ;(err as unknown as { code?: string }).code = 'GEMINI_KEY_INVALID'
              throw err
            }
          } catch {
          }
          throw new Error(`Gemini API error ${resp.status}: ${text}`)
        }

        const data: GeminiResponse = await resp.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (modelName !== PRIMARY_MODEL) {
          console.info(`generateWithGemini: succeeded using fallback model ${modelName}`)
        }
        return { raw: data, text }
      } catch (innerErr: unknown) {
        if (innerErr instanceof Error && (innerErr as unknown as { code?: string }).code === 'GEMINI_KEY_INVALID') throw innerErr
        console.warn('generateWithGemini attempt failed for model', modelName, innerErr)
        lastError = innerErr instanceof Error ? innerErr : new Error(String(innerErr))
      }
    }

    if (lastError) throw lastError
    throw new Error('generateWithGemini: failed to get a response from any model')
  } catch (err: unknown) {
    console.error('generateWithGemini error', err)
    if (err instanceof Error) throw err
    throw new Error(String(err))
  }
}
