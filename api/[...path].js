const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'transfer-encoding',
])

function getBackendOrigin() {
  const backendUrl = process.env.BACKEND_URL

  if (!backendUrl) {
    throw new Error('Missing BACKEND_URL environment variable')
  }

  return backendUrl.replace(/\/+$/, '')
}

function buildTargetUrl(req) {
  const backendOrigin = getBackendOrigin()
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean)
  const upstreamPath = pathParts.join('/')
  const target = new URL(`${backendOrigin}/api/${upstreamPath}`)
  const requestUrl = new URL(req.url, 'http://localhost')

  target.search = requestUrl.search

  if (req.url.endsWith('/') && !target.pathname.endsWith('/')) {
    target.pathname = `${target.pathname}/`
  }

  return target
}

function getRequestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined
  }

  if (req.body == null) {
    return undefined
  }

  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
    return req.body
  }

  return JSON.stringify(req.body)
}

function copyResponseHeaders(upstreamResponse, res) {
  upstreamResponse.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      res.setHeader(key, value)
    }
  })
}

module.exports = async function handler(req, res) {
  let targetUrl

  try {
    targetUrl = buildTargetUrl(req)
  } catch (error) {
    res.status(500).json({ detail: error.message })
    return
  }

  const headers = {}
  for (const [key, value] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && value !== undefined) {
      headers[key] = value
    }
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: getRequestBody(req),
      redirect: 'manual',
    })

    const responseBody = await upstreamResponse.text()
    copyResponseHeaders(upstreamResponse, res)
    res.status(upstreamResponse.status).send(responseBody)
  } catch (error) {
    res.status(502).json({
      detail: `Could not reach backend at ${targetUrl.origin}.`,
      error: error.message,
    })
  }
}
