'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react'

interface CartConfirmationDialogProps {
  isOpen: boolean
  productName: string
  onClose: () => void
}

export function CartConfirmationDialog({
  isOpen,
  productName,
  onClose,
}: CartConfirmationDialogProps) {
  const router = useRouter()

  const handleContinueShopping = () => {
    onClose()
  }

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-primary/20 shadow-2xl shadow-primary/20">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-light tracking-wide">
            Added to Cart!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="font-semibold text-foreground">{productName}</span>
            <span className="text-foreground/60"> has been added to your cart</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-sm text-foreground/70 text-center">
              Enhance your beauty routine with premium skincare products
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/40 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <Button
            onClick={handleCheckout}
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/40 cursor-pointer"
          >
            Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
