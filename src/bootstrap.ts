import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Only initialize Echo if we have a valid app key
const appKey = import.meta.env.VITE_PUSHER_KEY || import.meta.env.VITE_PUSHER_APP_KEY;
const cluster = import.meta.env.VITE_PUSHER_CLUSTER;

if (appKey && cluster) {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: appKey,
        cluster: cluster,
        forceTLS: true,
        authEndpoint: `${import.meta.env.VITE_API_URL || ''}/api/v1/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    });
} else {
    window.Echo = null;
}