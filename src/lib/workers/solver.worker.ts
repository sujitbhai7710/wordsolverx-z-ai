/* eslint-disable no-undef */

declare function importScripts(...urls: string[]): void;
declare const wasm_bindgen: any;

importScripts('/wasm-lib/wasm_lib.js');

const { compute } = wasm_bindgen;
let initPromise: Promise<unknown> | null = null;

function ensureReady() {
	if (!initPromise) {
		initPromise = wasm_bindgen('/wasm-lib/wasm_lib_bg.wasm');
	}

	return initPromise;
}

self.onmessage = async (event: MessageEvent<any>) => {
	const data = event.data;

	if (data?.type === 'init') {
		try {
			await ensureReady();
			self.postMessage({ type: 'ready' });
		} catch (error: any) {
			self.postMessage({
				type: 'error',
				error: error?.message || 'Failed to initialize the solver engine.'
			});
		}
		return;
	}

	if (data?.type !== 'solve') {
		return;
	}

	try {
		await ensureReady();
		const result = compute(
			data.state || '',
			Boolean(data.isHardMode),
			Boolean(data.useLimitNYT),
			data.wordLength || 5
		);

		self.postMessage({
			type: 'result',
			requestId: data.requestId,
			result
		});
	} catch (error: any) {
		self.postMessage({
			type: 'error',
			requestId: data.requestId,
			error: error?.message || 'The solver could not finish this request.'
		});
	}
};
