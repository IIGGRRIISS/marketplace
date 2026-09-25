import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// POST /api/orders/checkout
export async function checkout(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true, variant: true },
      });

      if (cart.length === 0) {
        throw new Error("CART_EMPTY");
      }

      let total = 0;
      for (const item of cart) {
        const unitPrice = item.product.price + (item.variant?.priceDelta ?? 0);

        if (item.variant) {
          if (item.variant.stock < item.quantity) {
            throw new Error(`OUT_OF_STOCK:${item.variant.name}`);
          }
        }
        total += unitPrice * item.quantity;
      }

      const created = await tx.order.create({
        data: {
          userId,
          total,
          status: "PENDING",
          items: {
            create: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price + (item.variant?.priceDelta ?? 0),
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart) {
        if (item.variant) {
          await tx.productVariant.update({
            where: { id: item.variant.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return created;
    });

    res.status(201).json(order);
  } catch (err: any) {
    const msg = String(err.message || "");
    if (msg === "CART_EMPTY") {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (msg.startsWith("OUT_OF_STOCK")) {
      return res.status(400).json({ error: msg });
    }
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
}

// GET /api/orders
export async function myOrders(req: AuthRequest, res: Response) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: {
      items: {
        include: { product: { select: { title: true, imageUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
}

// GET /api/orders/:id
export async function getOrder(req: AuthRequest, res: Response) {
  const order = await prisma.order.findUnique({
    where: { id: String(req.params.id) },
    include: {
      items: {
        include: { product: { select: { title: true, imageUrl: true } } },
      },
    },
  });
  if (!order) return res.status(404).json({ error: "Not found" });
  if (order.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Not your order" });
  }
  res.json(order);
}