import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { startServer, stopServer } from '../app';
import type { AddressInfo } from 'node:net';

let address : AddressInfo;

beforeAll(async () => {
    address = await startServer();
});

afterAll(async() => {
    await stopServer();
});

describe('Workspaces endpoint', () => {
    describe('Get all workspaces', () => {
        test('When all workspaces are requested, all should be returned', async () => {
            const res = await fetch(`http://localhost:${address.port}/`);
            const data = await res.json();

            expect(data.title).toBe("Home");
        });
    })
});