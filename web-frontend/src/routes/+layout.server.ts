/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {
        baseurl: import.meta.env.VITE_SERVER_API_URL,
    };
}