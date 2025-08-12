"use server";
import prisma from "@/lib/db";
import { success, z } from "zod";
import { cardSchema } from "@/lib/zodSchema";

export async function getCard(
  startDate?: Date,
  endDate?: Date,
  page?: number,
  pageSize?: number
) {
  try {
    page = page || 1;
    pageSize = pageSize || 10;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const totalRows = await prisma.businessCard.count({
      where,
    });

    const totalPages = Math.ceil(totalRows / pageSize);

    const data = await prisma.businessCard.findMany({
      orderBy: { createdAt: "desc" },
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: pageSize,
        totalRecords: totalRows,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Failed to fetch cards");
  }
}

export async function createCard(data: z.infer<typeof cardSchema>) {
  try {
    const parsed = cardSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Invalid card data");
    }
    const cardData = { ...parsed.data, location: parsed.data.location ?? "" }; // Ensure location is always a string
    const card = await prisma.businessCard.create({
      data: cardData,
    });
    return { success: true, card };
  } catch (error) {
    return { success: false };
  }
}

export async function updateCard(guestId: string) {
  try {
    await prisma.businessCard.update({
      where: { guestId: guestId },
      data: {
        totalScan: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating card:", error);
    return { success: false };
  }
}

export async function deleteCard(id: string) {
  await prisma.businessCard.delete({
    where: { id },
  });
}
