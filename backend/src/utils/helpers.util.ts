import Website from '../models/website.model';

// Manually adds a list of websites
export async function addWebsites() {
    const urls = [
        'https://www.google.com/',
        'https://www.yahoo.com/',
        'https://www.msn.com/',
    ];

    for (let u of urls) {
        let w = await Website.findOne({ address: u });
        if (w) continue;

        await Website.create({
            address: u,
        });
    }
}