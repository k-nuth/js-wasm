// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { loadLib } from ".";

beforeAll(async () => {
    await loadLib('src/kth.wasm', 'src/kth.js');
});
