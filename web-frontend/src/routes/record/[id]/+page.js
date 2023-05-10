/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({params: {id}}) {
    return {
        title: "Massbank Europe",
        accession: id
    };
}
