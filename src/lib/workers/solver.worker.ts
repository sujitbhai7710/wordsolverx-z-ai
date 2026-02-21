/* eslint-disable no-undef */

declare function importScripts(...urls: string[]): void;
declare const wasm_bindgen: any;

importScripts('/wasm-lib/wasm_lib.js');

const { compute } = wasm_bindgen;

self.onmessage = async (event: MessageEvent) => {
	const data = event.data;

	if (data === null) {
		try {
			await wasm_bindgen('/wasm-lib/wasm_lib_bg.wasm');
			self.postMessage(null);
		} catch (error: any) {
			self.postMessage({ error: 'Failed to initialize solver' });
		}
		return;
	}

	try {
		const result = compute(data.state, data.isHardMode, data.useLimitNYT);
		self.postMessage(result);
	} catch (error: any) {
		self.postMessage({ error: error?.message || 'Computation failed' });
	}
};
