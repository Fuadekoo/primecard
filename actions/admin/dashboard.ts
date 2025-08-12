"use server";
import prisma from "@/lib/db";
import { z } from "zod";

export async function dashboardCard() {
  try {
    const totalCards = await prisma.businessCard.count();
    const totalScan = await prisma.businessCard.aggregate({
      _sum: {
        totalScan: true,
      },
    });
    const totalScanSum = totalScan._sum.totalScan || 0;
    const totalUsers = await prisma.user.count();

    return {
      totalCards,
      totalScan: totalScanSum,
      totalUsers,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

export async function dashboardGraph() {}

export async function getGuest(
  startDate?: Date,
  endDate?: Date,
  page?: number,
  pageSize?: number
) {
  try {
    // Default values for pagination
    page = page || 1;
    pageSize = pageSize || 10;

    // Build where clause for date filtering
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    } else if (endDate) {
      where.createdAt = {
        lte: endDate,
      };
    }

    // Count total records
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
    console.error("Error fetching guests:", error);
    throw new Error("Failed to fetch guests");
  }
}
