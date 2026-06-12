// Real-time messaging uses REST API polling (every 5s in Messages.tsx, every 15s in Header.tsx).
// Pusher/Echo broadcasting is disabled because the backend at store-car-seven.vercel.app
// does not implement the broadcasting auth endpoint.
// To re-enable, ensure your backend has a broadcasting auth route and set
// VITE_PUSHER_KEY, VITE_PUSHER_CLUSTER, and VITE_PUSHER_AUTH_URL in .env.

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const appKey = import.meta.env.VITE_PUSHER_KEY || import.meta.env.VITE_PUSHER_APP_KEY;
const cluster = import.meta.env.VITE_PUSHER_CLUSTER;
const authUrl = import.meta.env.VITE_PUSHER_AUTH_URL;

if (appKey && cluster && authUrl) {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: appKey,
        cluster: cluster,
        forceTLS: true,
        authEndpoint: authUrl,
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    });
} else {
    window.Echo = null;
}