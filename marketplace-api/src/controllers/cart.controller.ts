import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const addSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
});

const updateSchema = z.object({
  quantity: z.number().int().min(0),
});

// GET /api/cart
export async function getCart(req: AuthRequest, res: Response) {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user!.userId },
    include: { product: true, variant: true },
    orderBy: { id: "asc" },
  });
  res.json(items);
}

// POST /api/cart
export async function addToCart(req: AuthRequest, res: Response) {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { productId, variantId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant || variant.productId !== productId) {
      return res.status(400).json({ error: "Invalid variant" });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }
  }

  // Upsert: if same product+variant already in cart, add to quantity
  const existing = await prisma.cartItem.findFirst({
    where: {
      userId: req.user!.userId,
      productId,
      variantId: variantId ?? null,
    },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
    : await prisma.cartItem.create({
        data: {
          userId: req.user!.userId,
          productId,
          variantId,
          quantity,
        },
      });

  res.status(201).json(item);
}

// PATCH /api/cart/:id
export async function updateCartItem(req: AuthRequest, res: Response) {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { quantity } = parsed.data;

  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.id },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  if (item.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Not your cart item" });
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return res.status(204).send();
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });
  res.json(updated);
}

// DELETE /api/cart/:id
export async function removeCartItem(req: AuthRequest, res: Response) {
  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.id },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  if (item.userId !== req.user!.userId) {
    return res.status(403).json({ error: "Not your cart item" });
  }
  await prisma.cartItem.delete({ where: { id: item.id } });
  res.status(204).send();
}