"use server";
import prisma from "@/lib/db";
import { z } from "zod";

export async function getYear() {
  try {
    const years = await prisma.businessCard.findMany({
      select: {
        createdAt: true,
      },
    });

    const uniqueYears = Array.from(
      new Set(years.map((item) => item.createdAt.getFullYear()))
    ).sort((a, b) => a - b);

    return { data: uniqueYears };
  } catch (error) {
    console.error("Error fetching years:", error);
    return { error: "Failed to fetch years." };
  }
}

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

export async function dashboardGraph(year: number) {
  try {
    // Fetch all businessCard records for the selected year
    const cardsForYear = await prisma.businessCard.findMany({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = monthNames.map((name) => ({
      month: name,
      total: 0,
    }));

    for (const card of cardsForYear) {
      const monthIndex = card.createdAt.getMonth();
      monthlyData[monthIndex].total++;
    }

    return { data: monthlyData };
  } catch (error) {
    console.error("Error fetching dashboard graph data:", error);
    return { error: "Failed to fetch dashboard graph data." };
  }
}

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
