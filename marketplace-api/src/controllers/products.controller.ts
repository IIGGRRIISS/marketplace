import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ---------- Validation schemas ----------

const variantSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().min(0).default(0),
  priceDelta: z.number().int().default(0),
});

const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().min(0),
  imageUrl: z.string().url().nullable().optional(),
  variants: z.array(variantSchema).optional(),
});

const updateProductSchema = createProductSchema.partial();

// ---------- Helpers ----------

async function getSellerOrFail(userId: string, res: Response) {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) {
    res.status(403).json({ error: "Seller profile not found" });
    return null;
  }
  return seller;
}

// ---------- Handlers ----------

// POST /api/products  (SELLER only)
export async function createProduct(req: AuthRequest, res: Response) {
  const seller = await getSellerOrFail(req.user!.userId, res);
  if (!seller) return;

  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { title, description, price, imageUrl, variants } = parsed.data;

  const product = await prisma.product.create({
    data: {
      sellerId: seller.id,
      title,
      description,
      price,
      imageUrl,
      variants: variants ? { create: variants } : undefined,
    },
    include: { variants: true },
  });

  res.status(201).json(product);
}

// GET /api/products  (public)
export async function listProducts(req: Request, res: Response) {
  const { q, minPrice, maxPrice, sellerId } = req.query;

  const products = await prisma.product.findMany({
    where: {
      ...(q ? { title: { contains: String(q), mode: "insensitive" } } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
      ...(sellerId ? { sellerId: String(sellerId) } : {}),
    },
    include: { variants: true, seller: { select: { storeName: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(products);
}

// GET /api/products/:id  (public)
export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      variants: true,
      seller: { select: { storeName: true, bio: true } },
      reviews: { include: { user: { select: { name: true } } } },
    },
  });
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
}

// GET /api/products/mine  (SELLER only)
export async function myProducts(req: AuthRequest, res: Response) {
  const seller = await getSellerOrFail(req.user!.userId, res);
  if (!seller) return;

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
}

// PATCH /api/products/:id  (SELLER, owns product)
export async function updateProduct(req: AuthRequest, res: Response) {
  const seller = await getSellerOrFail(req.user!.userId, res);
  if (!seller) return;

  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Not found" });
  if (product.sellerId !== seller.id) {
    return res.status(403).json({ error: "Not your product" });
  }

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: parsed.data,
    include: { variants: true },
  });
  res.json(updated);
}

// DELETE /api/products/:id  (SELLER, owns product)
export async function deleteProduct(req: AuthRequest, res: Response) {
  const seller = await getSellerOrFail(req.user!.userId, res);
  if (!seller) return;

  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Not found" });
  if (product.sellerId !== seller.id) {
    return res.status(403).json({ error: "Not your product" });
  }

  await prisma.product.delete({ where: { id: product.id } });
  res.status(204).send();
}