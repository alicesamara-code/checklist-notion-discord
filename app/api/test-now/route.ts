import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/db";
import { fetchNotionTasks, sendDiscordMessage } from "@/lib/services";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const config = await prisma.config.findFirst({
        where: { userId },
    });

    if (!config) {
        return NextResponse.json({ error: "No configuration found" }, { status: 404 });
    }

    try {
        const tasks = await fetchNotionTasks(
            config.notionToken,
            config.notionDatabaseId,
            config.statusProperty,
            config.selectedStatus || "Pendente"
        );

        if (tasks.length === 0) {
            await sendDiscordMessage(config.discordWebhookUrl, "✅ Nenhuma tarefa pendente no momento!");
        } else {
            const message = `📋 **Checklist Notion - ${new Date().toLocaleDateString()}**\n\n${tasks.join("\n")}`;
            await sendDiscordMessage(config.discordWebhookUrl, message);
        }

        await prisma.syncLog.create({
            data: {
                configId: config.id,
                status: "SUCCESS",
                message: `Sent ${tasks.length} tasks to Discord`,
            },
        });

        return NextResponse.json({ message: "Test successful" });
    } catch (error: any) {
        console.error("Test error:", error);
        await prisma.syncLog.create({
            data: {
                configId: config.id,
                status: "ERROR",
                message: error.message || "Unknown error",
            },
        });
        return NextResponse.json({ error: error.message || "Test failed" }, { status: 500 });
    }
}
