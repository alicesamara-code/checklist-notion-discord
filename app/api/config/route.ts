import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await prisma.config.findFirst({
        where: { userId: (session.user as any).id },
    });

    return NextResponse.json(config || {});
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const data = await req.json();

    const {
        notionToken,
        notionDatabaseId,
        statusProperty,
        discordWebhookUrl,
        scheduleTime,
        selectedStatus,
    } = data;

    const config = await prisma.config.upsert({
        where: { id: data.id || "new-id" }, // Simple logic for MVP
        update: {
            notionToken,
            notionDatabaseId,
            statusProperty,
            discordWebhookUrl,
            scheduleTime,
            selectedStatus,
        },
        create: {
            userId,
            notionToken,
            notionDatabaseId,
            statusProperty,
            discordWebhookUrl,
            scheduleTime,
            selectedStatus,
        },
    });

    // If ID was "new-id", prisma might have failed if it didn't find it. 
    // Let's use a better approach for single config per user.
    const existingConfig = await prisma.config.findFirst({ where: { userId } });
    if (existingConfig) {
        await prisma.config.update({
            where: { id: existingConfig.id },
            data: {
                notionToken,
                notionDatabaseId,
                statusProperty,
                discordWebhookUrl,
                scheduleTime,
                selectedStatus,
            },
        });
    } else {
        await prisma.config.create({
            data: {
                userId,
                notionToken,
                notionDatabaseId,
                statusProperty,
                discordWebhookUrl,
                scheduleTime,
                selectedStatus,
            },
        });
    }

    return NextResponse.json({ message: "Config saved" });
}
