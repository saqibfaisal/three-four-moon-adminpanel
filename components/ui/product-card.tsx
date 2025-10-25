'use client'

import type React from 'react'
import { Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/providers/cart-provider'
import { useInternationalization } from '@/components/providers/internationalization-provider'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import { wishlistService } from '@/services/wishlistService'
import { type Product } from '@/services/productService'

interface ProductCardProps {
  product: Product
  showColors?: boolean
  showSizes?: boolean
}

export function ProductCard({ product, showColors = false, showSizes = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { formatPrice } = useInternationalization()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image || '',
    })
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await wishlistService.addToWishlist(product.id)
    toast({
      title: 'Added to wishlist',
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const discount = product.compare_price && product.price < product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const rating = product.average_rating ? parseFloat(product.average_rating) : 0

  return (
    <Link href={`/product/${product.id}`} className='group block'>
      <div className='bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow'>
        <div className='relative'>
          <Image
            src={product.primary_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'}
            alt={product.name}
            width={300}
            height={400}
            className='w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300'
          />
          {discount > 0 && <Badge className='absolute top-2 left-2 bg-red-500'>-{discount}%</Badge>}
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={handleAddToWishlist}
          >
            <Heart className='h-4 w-4' />
          </Button>

          <Button
            size='sm'
            className='absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black hover:bg-gray-800'
            onClick={handleAddToCart}
          >
            Quick Add
          </Button>
        </div>

        <div className='p-3'>
          <h3 className='font-medium text-sm mb-1 line-clamp-1'>{product.name}</h3>

          {rating > 0 && (
            <div className='flex items-center gap-1 mb-2'>
              <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
              <span className='text-xs text-muted-foreground'>{rating.toFixed(1)}</span>
              {product.review_count > 0 && <span className='text-xs text-muted-foreground'>({product.review_count})</span>}
            </div>
          )}

          <div className='flex flex-col items-start gap-2 mb-3'>
            <span className='font-bold text-sm text-red-500'>{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className='text-xs text-muted-foreground line-through'>{formatPrice(product.compare_price)}</span>
            )}
          </div>

          {showColors && product.variants && (
            <div className='flex gap-1 mb-2'>
              {/* This is a simplified representation of colors from variants */}
            </div>
          )}

          {showSizes && product.variants && (
            <div className='flex gap-1 flex-wrap'>
              {/* This is a simplified representation of sizes from variants */}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}