/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {
        baseurl: typeof import.meta.env.VITE_SERVER_API_URL !== 'undefined' && import.meta.env.VITE_SERVER_API_URL !== null && import.meta.env.VITE_SERVER_API_URL !== "" ? import.meta.env.VITE_SERVER_API_URL : process.env.MB3_API_URL,
    };
}
