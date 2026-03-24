// worker.js
import { pipeline, env } from './lib/transformers.min.js';

// WASMを徹底的に排除
self.ort = { env: { wasm: { disabled: true } } };
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = '../models/';
env.backends.onnx.wasm.disabled = true;

let embedder = null;

self.onmessage = async (e) => {
    const { text } = e.data;
    try {
        if (!embedder) {
            embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
                device: 'cpu',
                quantized: true
            });
        }
        const output = await embedder(text, { pooling: 'mean', normalize: true });
        const vector = Array.from(output.data);
        self.postMessage({ status: 'success', vector });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
};