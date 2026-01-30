import { Client } from "@notionhq/client";

export async function fetchNotionTasks(token: string, databaseId: string, statusProp: string, statusValue: string) {
    const notion = new Client({ auth: token }) as any;


    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: statusProp,
            status: {
                equals: statusValue,
            },
        },
    });

    return response.results.map((page: any) => {
        const title = page.properties.Name?.title[0]?.plain_text || "Untitled";
        return `- [ ] ${title}`;
    });
}

export async function sendDiscordMessage(webhookUrl: string, content: string) {
    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        throw new Error(`Discord error: ${res.statusText}`);
    }
}
